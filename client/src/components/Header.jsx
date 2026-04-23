import { useAuth } from "../context/AuthContext";

const Header = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full px-4 py-4 text-white lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]">
          <h1 className="text-xl font-bold tracking-tight text-white">FinGuard AI</h1>
          <p className="text-sm text-slate-300">Your personal finance command center</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-800"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <span className="hidden text-sm font-medium text-slate-200 sm:inline">
            {user?.name || "User"}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
