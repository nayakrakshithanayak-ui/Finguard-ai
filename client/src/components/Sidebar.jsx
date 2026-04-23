import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkStyle = ({ isActive }) =>
  `block rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
    isActive
      ? "bg-indigo-600 text-white shadow-lg"
      : "text-slate-200 hover:bg-slate-800"
  }`;

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const Sidebar = ({ stats = {} }) => {
  const { user } = useAuth();
  const initials = (user?.name || "FG")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] lg:w-64">
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Profile
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-200">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "FinGuard User"}</p>
            <p className="truncate text-xs text-slate-300">{user?.email || "No email available"}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Quick Stats
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-black/20 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Balance</p>
            <p className="mt-1 text-sm font-semibold text-indigo-200">{formatCurrency(stats.balance)}</p>
          </div>
          <div className="rounded-xl bg-black/20 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Income</p>
            <p className="mt-1 text-sm font-semibold text-emerald-300">{formatCurrency(stats.income)}</p>
          </div>
          <div className="rounded-xl bg-black/20 px-3 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Total Expense</p>
            <p className="mt-1 text-sm font-semibold text-red-300">{formatCurrency(stats.expense)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-white/10 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Workspace
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">Navigation</h2>
      </div>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/add-transaction" className={linkStyle}>
          Add Transaction
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
