import { useEffect, useState } from "react";
import {
  BadgeIndianRupee,
  Bus,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Landmark,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Plane,
  Utensils
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const CATEGORY_OPTIONS = {
  income: [
    { label: "Salary", icon: BadgeIndianRupee, iconClass: "text-green-400", iconBgClass: "bg-green-400/10" },
    { label: "Freelance", icon: BadgeIndianRupee, iconClass: "text-green-400", iconBgClass: "bg-green-400/10" },
    { label: "Business", icon: Landmark, iconClass: "text-green-400", iconBgClass: "bg-green-400/10" },
    { label: "Investments", icon: TrendingUp, iconClass: "text-emerald-300", iconBgClass: "bg-emerald-400/10" },
    { label: "Bonus", icon: Sparkles, iconClass: "text-lime-300", iconBgClass: "bg-lime-400/10" }
  ],
  expense: [
    { label: "Food", icon: Utensils, iconClass: "text-amber-400", iconBgClass: "bg-amber-400/10" },
    { label: "Transport", icon: Bus, iconClass: "text-sky-400", iconBgClass: "bg-sky-400/10" },
    { label: "Shopping", icon: ShoppingBag, iconClass: "text-purple-400", iconBgClass: "bg-purple-400/10" },
    { label: "Bills", icon: ReceiptText, iconClass: "text-yellow-400", iconBgClass: "bg-yellow-400/10" },
    { label: "Health", icon: HeartPulse, iconClass: "text-rose-400", iconBgClass: "bg-rose-400/10" },
    { label: "Entertainment", icon: Clapperboard, iconClass: "text-pink-300", iconBgClass: "bg-pink-400/10" },
    { label: "Education", icon: GraduationCap, iconClass: "text-cyan-200", iconBgClass: "bg-cyan-400/10" },
    { label: "Travel", icon: Plane, iconClass: "text-indigo-300", iconBgClass: "bg-indigo-400/10" }
  ]
};

const TYPE_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" }
];

const AddTransactionPage = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10)
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const categoryOptions = CATEGORY_OPTIONS[form.type];

  useEffect(() => {
    if (!isEditMode) {
      setPageLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const { data } = await api.get(`/transactions/${id}`);
        setForm({
          amount: data.amount?.toString() || "",
          type: data.type || "expense",
          category: data.category || "",
          date: data.date ? new Date(data.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load transaction.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchTransaction();
  }, [id, isEditMode]);

  const onChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      if (name !== "type") {
        return { ...prev, [name]: value };
      }

      return {
        ...prev,
        type: value,
        category: CATEGORY_OPTIONS[value].some((option) => option.label === prev.category)
          ? prev.category
          : ""
      };
    });
  };

  const setType = (value) => {
    setForm((prev) => ({
      ...prev,
      type: value,
      category: CATEGORY_OPTIONS[value].some((option) => option.label === prev.category)
        ? prev.category
        : ""
    }));
  };

  const setCategory = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date
      };

      if (isEditMode) {
        await api.put(`/transactions/${id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${isEditMode ? "update" : "create"} transaction.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 lg:flex-row lg:p-6">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/80">
                {isEditMode ? "Update Entry" : "Quick Entry"}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {isEditMode ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                {isEditMode
                  ? "Update the transaction details and keep your records accurate."
                  : "Capture income and spending in a clean, focused flow that feels like a modern fintech app."}
              </p>

              {error ? (
                <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              {pageLoading ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300">
                  Loading transaction details...
                </div>
              ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                <div className="rounded-2xl border border-white/15 bg-black/20 p-5 shadow-inner shadow-black/10 transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-medium text-slate-300" htmlFor="amount">
                    Amount
                  </label>
                  <div className="mt-3 flex items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400">
                    <span className="mr-3 text-3xl font-bold text-indigo-200">\u20B9</span>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={onChange}
                      required
                      placeholder="0.00"
                      className="w-full bg-transparent text-3xl font-bold text-white outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">Type</label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {TYPE_OPTIONS.map((option) => {
                      const isActive = form.type === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setType(option.value)}
                          className={`rounded-2xl border px-4 py-3 text-base font-semibold transition-all ${
                            isActive
                              ? option.value === "income"
                                ? "border-emerald-400/70 bg-emerald-400/20 text-emerald-100 shadow-lg shadow-emerald-950/20"
                                : "border-rose-400/70 bg-rose-400/20 text-rose-100 shadow-lg shadow-rose-950/20"
                              : "border-white/15 bg-white/5 text-slate-200 hover:scale-105 hover:bg-slate-800"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">Category</label>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categoryOptions.map((option) => {
                      const isSelected = form.category === option.label;
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setCategory(option.label)}
                          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                            isSelected
                              ? "border-indigo-400/70 bg-indigo-500/20 text-white shadow-lg shadow-indigo-950/20"
                              : "border-white/15 bg-white/5 text-slate-200 hover:scale-105 hover:bg-slate-800"
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 ${
                              isSelected ? `bg-slate-950/40 ${option.iconClass}` : `${option.iconBgClass} ${option.iconClass}`
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="text-sm font-semibold">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!form.category ? (
                    <p className="mt-2 text-xs text-slate-400">Choose a category to continue.</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={onChange}
                    required
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.category}
                  className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Transaction" : "Save Transaction"}
                </button>
              </form>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AddTransactionPage;
