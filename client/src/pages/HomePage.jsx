import { Link } from "react-router-dom";
import { BarChart3, Filter, IndianRupee, ShieldCheck } from "lucide-react";

const createPlaceholder = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const featureCards = [
  {
    title: "Track income and expenses",
    description:
      "Capture every inflow and outflow in a clean dashboard designed for daily financial visibility.",
    icon: IndianRupee,
    iconClass: "text-green-400",
    iconBgClass: "bg-green-400/10",
    image: createPlaceholder(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
        <defs>
          <linearGradient id="bgA" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
        </defs>
        <rect width="800" height="520" rx="32" fill="url(#bgA)"/>
        <rect x="48" y="58" width="704" height="404" rx="28" fill="#0b1120" opacity="0.75"/>
        <rect x="92" y="104" width="188" height="88" rx="18" fill="#1e293b"/>
        <rect x="304" y="104" width="188" height="88" rx="18" fill="#1d4ed8" opacity="0.9"/>
        <rect x="516" y="104" width="188" height="88" rx="18" fill="#0f766e"/>
        <rect x="92" y="232" width="300" height="178" rx="22" fill="#172033"/>
        <rect x="418" y="232" width="286" height="178" rx="22" fill="#172033"/>
        <path d="M122 355 L180 318 L228 336 L292 270 L356 292" fill="none" stroke="#60a5fa" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M456 360 L456 310" stroke="#22c55e" stroke-width="18" stroke-linecap="round"/>
        <path d="M518 360 L518 280" stroke="#38bdf8" stroke-width="18" stroke-linecap="round"/>
        <path d="M580 360 L580 244" stroke="#f59e0b" stroke-width="18" stroke-linecap="round"/>
        <path d="M642 360 L642 294" stroke="#e879f9" stroke-width="18" stroke-linecap="round"/>
      </svg>
    `)
  },
  {
    title: "Visualize data with charts",
    description:
      "Understand trends faster using chart-driven summaries that make spending patterns easier to spot.",
    icon: BarChart3,
    iconClass: "text-purple-400",
    iconBgClass: "bg-purple-400/10",
    image: createPlaceholder(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
        <defs>
          <linearGradient id="bgB" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#111827"/>
            <stop offset="100%" stop-color="#1e40af"/>
          </linearGradient>
        </defs>
        <rect width="800" height="520" rx="32" fill="url(#bgB)"/>
        <rect x="62" y="70" width="676" height="380" rx="30" fill="#0f172a" opacity="0.82"/>
        <circle cx="230" cy="265" r="110" fill="#1e293b"/>
        <path d="M230 155 A110 110 0 0 1 334 300 L230 265 Z" fill="#38bdf8"/>
        <path d="M334 300 A110 110 0 0 1 170 357 L230 265 Z" fill="#22c55e"/>
        <path d="M170 357 A110 110 0 0 1 230 155 L230 265 Z" fill="#f59e0b"/>
        <rect x="404" y="152" width="250" height="22" rx="11" fill="#334155"/>
        <rect x="404" y="208" width="190" height="18" rx="9" fill="#60a5fa"/>
        <rect x="404" y="258" width="224" height="18" rx="9" fill="#22c55e"/>
        <rect x="404" y="308" width="148" height="18" rx="9" fill="#f59e0b"/>
        <rect x="404" y="358" width="210" height="18" rx="9" fill="#c084fc"/>
      </svg>
    `)
  },
  {
    title: "Fraud detection",
    description:
      "Highlight unusual transaction behavior quickly so high-risk activity stands out before it grows.",
    icon: ShieldCheck,
    iconClass: "text-yellow-400",
    iconBgClass: "bg-yellow-400/10",
    image: createPlaceholder(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
        <defs>
          <linearGradient id="bgC" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#312e81"/>
          </linearGradient>
        </defs>
        <rect width="800" height="520" rx="32" fill="url(#bgC)"/>
        <rect x="80" y="74" width="640" height="372" rx="28" fill="#0b1120" opacity="0.78"/>
        <path d="M400 122 L532 176 V264 C532 334 483 394 400 420 C317 394 268 334 268 264 V176 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="10"/>
        <path d="M352 266 L387 301 L457 223" fill="none" stroke="#22c55e" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="606" cy="184" r="52" fill="#ef4444" opacity="0.92"/>
        <path d="M606 160 V190" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
        <circle cx="606" cy="216" r="7" fill="#fff"/>
        <rect x="126" y="154" width="96" height="14" rx="7" fill="#475569"/>
        <rect x="126" y="190" width="128" height="14" rx="7" fill="#334155"/>
        <rect x="126" y="226" width="104" height="14" rx="7" fill="#334155"/>
      </svg>
    `)
  },
  {
    title: "Smart filtering",
    description:
      "Narrow activity by date and type to focus on the exact signals you want to investigate.",
    icon: Filter,
    iconClass: "text-cyan-400",
    iconBgClass: "bg-cyan-400/10",
    image: createPlaceholder(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
        <defs>
          <linearGradient id="bgD" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0b1120"/>
            <stop offset="100%" stop-color="#0f766e"/>
          </linearGradient>
        </defs>
        <rect width="800" height="520" rx="32" fill="url(#bgD)"/>
        <rect x="72" y="68" width="656" height="384" rx="30" fill="#0f172a" opacity="0.84"/>
        <rect x="116" y="118" width="170" height="54" rx="18" fill="#1e293b"/>
        <rect x="304" y="118" width="170" height="54" rx="18" fill="#1e293b"/>
        <rect x="492" y="118" width="170" height="54" rx="18" fill="#1d4ed8" opacity="0.9"/>
        <rect x="116" y="218" width="546" height="24" rx="12" fill="#334155"/>
        <rect x="116" y="270" width="452" height="24" rx="12" fill="#475569"/>
        <rect x="116" y="322" width="388" height="24" rx="12" fill="#475569"/>
        <circle cx="648" cy="318" r="54" fill="#14b8a6"/>
        <path d="M626 319 L644 337 L678 299" fill="none" stroke="#ecfeff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)
  }
];

const steps = [
  {
    title: "Add transactions",
    description: "Log income and expense activity in one place so every update stays organized.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 10h8M8 14h5M16 3v4" />
      </svg>
    )
  },
  {
    title: "Analyze data",
    description: "Review dashboard summaries and visual reports to understand trends quickly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 19V9M12 19V5M19 19v-8" />
        <path d="M3 19h18" />
      </svg>
    )
  },
  {
    title: "Detect suspicious activity",
    description: "Surface abnormal amounts and patterns early so you can act with more confidence.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v5c0 4.5-2.7 7.7-7 10-4.3-2.3-7-5.5-7-10V6l7-3z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    )
  }
];

const securityIllustration = createPlaceholder(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">
    <defs>
      <linearGradient id="bgE" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="shield" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>
    <rect width="900" height="620" rx="36" fill="url(#bgE)"/>
    <circle cx="716" cy="122" r="72" fill="#38bdf8" opacity="0.14"/>
    <circle cx="170" cy="498" r="88" fill="#22c55e" opacity="0.12"/>
    <rect x="86" y="110" width="728" height="396" rx="34" fill="#0f172a" opacity="0.86"/>
    <rect x="134" y="164" width="262" height="36" rx="18" fill="#1e293b"/>
    <rect x="134" y="226" width="320" height="22" rx="11" fill="#334155"/>
    <rect x="134" y="268" width="280" height="22" rx="11" fill="#334155"/>
    <rect x="134" y="310" width="220" height="22" rx="11" fill="#334155"/>
    <path d="M598 176 L722 224 V307 C722 373 675 430 598 462 C521 430 474 373 474 307 V224 Z" fill="url(#shield)"/>
    <path d="M548 313 L584 349 L654 270" fill="none" stroke="#ecfeff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="534" y="122" width="130" height="28" rx="14" fill="#38bdf8" opacity="0.28"/>
    <rect x="614" y="520" width="132" height="18" rx="9" fill="#1e40af" opacity="0.6"/>
  </svg>
`);

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl space-y-10">
        <section className="py-10">
          <div className="grid items-center gap-6 rounded-[2rem] border border-white/10 bg-white/10 px-6 py-8 shadow-2xl shadow-slate-950/30 backdrop-blur transition-all duration-300 hover:scale-[1.02] sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-100">
                Welcome to smarter money management
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                FinGuard AI
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Manage income, monitor trends, and detect suspicious transactions with a tighter,
                smarter financial workspace built for clarity.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-4 shadow-xl shadow-slate-950/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5 transition-all duration-300">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                  Start Now
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full rounded-full bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full rounded-full border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800"
                  >
                    Register
                  </Link>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {["Track income & expenses", "Visualize financial data", "Detect suspicious activity"].map(
                    (item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <p className="text-sm font-semibold text-slate-100">{item}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:scale-[1.02] sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A richer financial view without the empty space
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                Each feature pairs clear explanations with visual placeholders that match the
                product's dashboard and analytics feel.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-slate-800 hover:shadow-2xl sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.95fr)] sm:items-center sm:p-5"
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full rounded-xl shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${feature.iconBgClass} ${feature.iconClass}`}
                      >
                        {feature.icon && <feature.icon className="h-5 w-5" />}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:scale-[1.02] sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three simple steps to financial visibility
            </h2>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-slate-800 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                      {step.icon}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Step 0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="grid items-center gap-6 rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:scale-[1.02] sm:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
                Why FinGuard AI
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Designed for smarter and safer money management
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
                FinGuard AI helps people and teams understand financial activity in one place,
                turning daily transaction data into clear insight while highlighting unusual
                patterns before they become expensive problems.
              </p>
            </div>

            <img
              src={securityIllustration}
              alt="Security and fraud detection dashboard illustration"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </section>

        <footer className="py-10">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/10 px-8 py-5 text-center shadow-2xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:scale-[1.02]">
            <p className="text-sm font-medium tracking-wide text-slate-300">&copy; 2026 FinGuard AI</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
