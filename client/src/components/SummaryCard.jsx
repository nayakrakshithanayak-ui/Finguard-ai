const SummaryCard = ({ title, value, colorClass, icon: Icon, iconClass = "", iconBgClass = "" }) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">{title}</p>
        {Icon ? (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${iconBgClass} ${iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <h3 className={`mt-3 text-3xl font-bold tracking-tight ${colorClass}`}>${value.toFixed(2)}</h3>
    </div>
  );
};

export default SummaryCard;
