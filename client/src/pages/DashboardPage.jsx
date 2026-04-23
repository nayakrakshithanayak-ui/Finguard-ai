import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { ArrowDownRight, IndianRupee, Wallet } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const getFraudReason = (transaction, transactions) => {
  if (transaction.fraudReason !== undefined) {
    return transaction.fraudReason;
  }

  if (transaction.amount > 10000) return "High Amount";

  const sameCategoryCount = transactions.filter((t) => t.category === transaction.category).length;
  if (sameCategoryCount > 3) return "Repeated Category";

  const avg =
    transactions.reduce((sum, t) => sum + t.amount, 0) /
    (transactions.length || 1);
  if (transaction.amount > avg * 3) return "Unusual Spike";

  return null;
};

const escapeCSVCell = (value) => {
  const stringValue = String(value ?? "");
  const escapedValue = stringValue.replace(/"/g, "\"\"");
  return /[",\n]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
};

const DashboardPage = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filterMenuRef = useRef(null);
  const filterOptionRefs = useRef([]);
  const hasShownFraudAlertRef = useRef(false);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch transactions.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fraud = transactions.some((transaction) => getFraudReason(transaction, transactions));
    if (fraud && !hasShownFraudAlertRef.current) {
      hasShownFraudAlertRef.current = true;
      setToast({
        visible: true,
        message: "\u26A0 Suspicious transaction detected. Review highlighted transactions."
      });
    }

    if (!fraud) {
      hasShownFraudAlertRef.current = false;
    }
  }, [transactions]);

  useEffect(() => {
    if (!toast.visible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast((currentToast) => ({ ...currentToast, visible: false }));
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [toast.visible]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const fraudCount = useMemo(
    () => transactions.filter((transaction) => getFraudReason(transaction, transactions)).length,
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  );

  const highest = useMemo(
    () => (transactions.length ? Math.max(...transactions.map((transaction) => transaction.amount || 0)) : 0),
    [transactions]
  );

  const monthlyData = useMemo(() => {
    const buckets = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      if (!buckets[month]) {
        buckets[month] = 0;
      }

      if (transaction.type === "expense") {
        buckets[month] += transaction.amount;
      }
    });

    return {
      labels: Object.keys(buckets),
      datasets: [
        {
          label: "Monthly Spending",
          data: Object.values(buckets),
          backgroundColor: "#2c9a77"
        }
      ]
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const buckets = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        if (!buckets[transaction.category]) {
          buckets[transaction.category] = 0;
        }

        buckets[transaction.category] += transaction.amount;
      });

    return {
      labels: Object.keys(buckets),
      datasets: [
        {
          data: Object.values(buckets),
          backgroundColor: ["#2c9a77", "#4f46e5", "#f59e0b", "#ef4444", "#14b8a6", "#8b5cf6"]
        }
      ]
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.category.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) {
        return false;
      }

      const matchesType = filter === "all" || transaction.type === filter;
      if (!matchesType) {
        return false;
      }

      if (!fromDate && !toDate) {
        return true;
      }

      const transactionDate = new Date(transaction.date);

      if (fromDate) {
        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);

        if (startDate > transactionDate) {
          return false;
        }
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        if (endDate < transactionDate) {
          return false;
        }
      }

      return true;
    });
  }, [filter, fromDate, search, toDate, transactions]);

  const dashboardInsights = useMemo(() => {
    const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");
    const highestExpense = expenseTransactions.reduce(
      (highest, transaction) =>
        !highest || transaction.amount > highest.amount ? transaction : highest,
      null
    );

    const categoryCounts = transactions.reduce((counts, transaction) => {
      counts[transaction.category] = (counts[transaction.category] || 0) + 1;
      return counts;
    }, {});

    const mostUsedCategory =
      Object.entries(categoryCounts).reduce(
        (topCategory, currentCategory) => (currentCategory[1] > topCategory[1] ? currentCategory : topCategory),
        ["None", 0]
      )[0] || "None";

    const latestTransaction = [...transactions].sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
    )[0];

    return {
      highestExpense,
      mostUsedCategory,
      categoriesUsed: new Set(transactions.map((transaction) => transaction.category)).size,
      latestTransaction
    };
  }, [transactions]);

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete transaction.");
    }
  };

  const chartTextColor = "#e2e8f0";
  const chartGridColor = "rgba(148, 163, 184, 0.18)";
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" }
  ];
  const selectedFilterLabel =
    filterOptions.find((option) => option.value === filter)?.label || "All";
  const downloadCSV = () => {
    const rows = [
      ["Date", "Type", "Category", "Amount"],
      ...transactions.map((transaction) => [
        transaction.date,
        transaction.type,
        transaction.category,
        transaction.amount
      ])
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.map((cell) => escapeCSVCell(cell)).join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "transactions.csv");
    link.click();
  };
  const latestFraud = useMemo(
    () => transactions.find((transaction) => getFraudReason(transaction, transactions)) || null,
    [transactions]
  );
  const selectedFilterIndex = filterOptions.findIndex((option) => option.value === filter);

  useEffect(() => {
    setActiveFilterIndex(selectedFilterIndex >= 0 ? selectedFilterIndex : 0);
  }, [selectedFilterIndex]);

  useEffect(() => {
    if (!isFilterOpen) {
      return undefined;
    }

    const activeOption = filterOptionRefs.current[activeFilterIndex];
    if (activeOption) {
      activeOption.focus();
    }
  }, [activeFilterIndex, isFilterOpen]);

  const selectFilter = (value) => {
    setFilter(value);
    setIsFilterOpen(false);
  };

  const handleFilterTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveFilterIndex(selectedFilterIndex >= 0 ? selectedFilterIndex : 0);
      setIsFilterOpen(true);
    }
  };

  const handleFilterOptionKeyDown = (event, index, value) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveFilterIndex((index + 1) % filterOptions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveFilterIndex((index - 1 + filterOptions.length) % filterOptions.length);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectFilter(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      {toast.visible ? (
        <div className="fixed right-6 top-6 z-50 max-w-sm rounded-xl border border-yellow-300/20 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-yellow-400">{"\u26A0"}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Fraud Alert</p>
              <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast((currentToast) => ({ ...currentToast, visible: false }))}
              className="text-sm text-slate-400 transition-colors duration-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex w-full flex-col gap-6 px-6 py-6 lg:flex-row lg:py-8">
        <Sidebar stats={totals} />

        <main className="flex-1 space-y-6">
          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Overview
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Financial Dashboard
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Track spending patterns, monitor balance, and review transactions in one place.
                </p>
              </div>
            </div>
          </section>

          {error ? <div className="rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-100 transition-all duration-300">{error}</div> : null}

          <section className="grid gap-4 md:grid-cols-4">
            <SummaryCard
              title="Total Income"
              value={totals.income}
              colorClass="text-emerald-300"
              icon={IndianRupee}
              iconClass="text-green-400"
              iconBgClass="bg-green-400/10"
            />
            <SummaryCard
              title="Total Expenses"
              value={totals.expense}
              colorClass="text-red-300"
              icon={ArrowDownRight}
              iconClass="text-red-400"
              iconBgClass="bg-red-400/10"
            />
            <SummaryCard
              title="Balance"
              value={totals.balance}
              colorClass="text-indigo-300"
              icon={Wallet}
              iconClass="text-indigo-400"
              iconBgClass="bg-indigo-400/10"
            />
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="text-sm text-slate-300">Suspicious Transactions</h3>
              <p className="text-2xl font-bold text-yellow-400">{fraudCount}</p>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg">
              <h3 className="mb-2 font-semibold text-white">Monthly Insights</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total Expense</p>
                  <p className="mt-1 text-lg font-semibold text-red-300">{"\u20B9"}{totalExpense.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Highest Transaction</p>
                  <p className="mt-1 text-lg font-semibold text-white">{"\u20B9"}{highest.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Most Used Category</p>
                  <p className="mt-1 text-lg font-semibold text-white">{dashboardInsights.mostUsedCategory}</p>
                </div>
                <div className="rounded-xl bg-black/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Categories Used</p>
                  <p className="mt-1 text-lg font-semibold text-indigo-200">{dashboardInsights.categoriesUsed}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg">
              <h3 className="mb-2 font-semibold text-white">Reports & Alerts</h3>
              <p className="text-sm text-slate-300">
                {latestFraud
                  ? `Latest fraud signal: ${getFraudReason(latestFraud, transactions)} in ${latestFraud.category}.`
                  : "No suspicious transactions detected right now."}
              </p>
              <button
                type="button"
                onClick={downloadCSV}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700"
              >
                Download Report
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-white">Monthly Spending</h3>
              <p className="mt-1 text-sm text-slate-300">
                A quick view of how expenses are trending over time.
              </p>
            </div>
            <div className="h-[240px]">
              <Bar
                data={monthlyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: chartTextColor
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: chartTextColor
                      },
                      grid: {
                        color: chartGridColor
                      }
                    },
                    y: {
                      ticks: {
                        color: chartTextColor
                      },
                      grid: {
                        color: chartGridColor
                      }
                    }
                  }
                }}
              />
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white">Transactions</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Filter and review recent account activity.
                </p>
              </div>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:ml-auto">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 sm:mb-0 sm:w-52"
                  />
                  <label className="flex w-full flex-col gap-1 text-sm font-medium text-slate-200 sm:w-44">
                    <span>From Date</span>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(event) => setFromDate(event.target.value)}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                    />
                  </label>
                  <label className="flex w-full flex-col gap-1 text-sm font-medium text-slate-200 sm:w-44">
                    <span>To Date</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(event) => setToDate(event.target.value)}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                    />
                  </label>
                  <div ref={filterMenuRef} className="relative w-full sm:w-44">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      onKeyDown={handleFilterTriggerKeyDown}
                      aria-expanded={isFilterOpen}
                      aria-haspopup="listbox"
                      className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm font-medium text-white shadow-lg outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                    >
                      <span>{selectedFilterLabel}</span>
                      <span className="text-slate-300">{isFilterOpen ? "^" : "v"}</span>
                    </button>

                    {isFilterOpen ? (
                      <div className="absolute z-10 mt-2 w-full rounded-lg bg-slate-800 text-white shadow-lg" role="listbox">
                        {filterOptions.map((option, index) => (
                          <button
                            key={option.value}
                            type="button"
                            ref={(element) => {
                              filterOptionRefs.current[index] = element;
                            }}
                            onClick={() => selectFilter(option.value)}
                            onKeyDown={(event) => handleFilterOptionKeyDown(event, index, option.value)}
                            role="option"
                            aria-selected={filter === option.value}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 hover:bg-slate-700 ${
                              filter === option.value ? "text-indigo-300" : "text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {transactions.length === 0 ? (
                <p className="text-sm text-slate-300">No transactions added yet.</p>
              ) : filteredTransactions.length === 0 ? (
                <p className="text-sm text-slate-300">No transactions match the selected filter.</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/20 shadow-lg">
                  <div className="max-h-[420px] overflow-y-auto p-3">
                    <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                      <thead>
                        <tr className="text-slate-300">
                          <th className="px-4 py-3 font-semibold uppercase tracking-wide">Date</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wide">Type</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wide">Category</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wide">Amount</th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => {
                          const fraudReason = getFraudReason(transaction, transactions);

                          return (
                            <tr
                              key={transaction._id}
                              className={`${
                                fraudReason
                                  ? "bg-red-500/10"
                                  : transaction.type === "income"
                                    ? "bg-emerald-500/15"
                                    : "bg-white/10"
                              } hover:bg-slate-800 transition-all duration-300`}
                            >
                              <td className="rounded-l-xl px-4 py-4 font-medium text-slate-100">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${
                                      transaction.type === "income"
                                        ? "bg-emerald-400/20 text-emerald-100"
                                        : "bg-red-400/20 text-red-100"
                                    }`}
                                  >
                                    {transaction.type === "income" ? "Income" : "Expense"}
                                  </span>
                                  {fraudReason ? (
                                    <span className="ml-2 font-semibold text-yellow-400">
                                      {"\u26A0"} {fraudReason}
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                              <td className="px-4 py-4 font-medium text-slate-100">{transaction.category}</td>
                              <td
                                className={`px-4 py-4 text-base font-bold ${
                                  transaction.type === "income" ? "text-emerald-300" : "text-red-300"
                                }`}
                              >
                                ${transaction.amount.toFixed(2)}
                              </td>
                              <td className="rounded-r-xl px-4 py-4">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/transactions/${transaction._id}/edit`)}
                                    className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-800"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteTransaction(transaction._id)}
                                    className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white">Category-wise Expenses</h3>
                <p className="mt-1 text-sm text-slate-300">
                  See which categories are driving the largest outflows.
                </p>
              </div>
              {categoryData.labels.length > 0 ? (
                <div className="h-[240px]">
                  <Doughnut
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: chartTextColor
                          }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-300">No expense data available yet.</p>
              )}
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="mb-2 text-lg font-semibold text-white">Quick Stats</h3>
              <p className="text-sm text-slate-300">
                Total transactions: <span className="font-semibold text-white">{transactions.length}</span>
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Categories used: <span className="font-semibold text-white">{dashboardInsights.categoriesUsed}</span>
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Highest expense:{" "}
                <span className="font-semibold text-white">
                  {dashboardInsights.highestExpense
                    ? `Rs. ${dashboardInsights.highestExpense.amount.toFixed(2)}`
                    : "No expense data"}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="mb-2 text-lg font-semibold text-white">Recent Activity</h3>
              <p className="text-sm text-slate-300">
                Last transaction:{" "}
                <span className="font-semibold text-white">
                  {dashboardInsights.latestTransaction
                    ? `Rs. ${dashboardInsights.latestTransaction.amount.toFixed(2)} (${dashboardInsights.latestTransaction.category})`
                    : "No transactions yet"}
                </span>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
