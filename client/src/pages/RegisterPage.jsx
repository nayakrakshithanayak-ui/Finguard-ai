import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onPasswordChange = (event) => {
    const nextPassword = event.target.value;
    setForm((prev) => ({ ...prev, password: nextPassword }));
    if (nextPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    const response = await register(form.name, form.email, form.password);
    if (response.success) {
      navigate("/dashboard");
      return;
    }
    setError(response.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
      <div className="flex min-h-screen items-center justify-center p-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-300">Start managing finances smarter.</p>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/15 p-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <div className="mt-5">
            <label className="mb-1 block text-sm text-slate-200" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm text-slate-200" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onPasswordChange}
                minLength={8}
                required
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 pr-16 text-white outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError ? <p className="mt-1 text-sm text-red-400">{passwordError}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loading || form.password.length < 8}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-3 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="mt-4 text-sm text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-300 transition-all duration-300 hover:text-indigo-200">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
