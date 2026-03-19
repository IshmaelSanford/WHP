export default function DashboardActivityPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <h1 className="text-3xl font-outfit font-semibold text-zinc-950">Herd Activity</h1>
        <p className="text-zinc-500 mt-2">
          Live movement and behavior logs for tracked herds.
        </p>
      </header>

      <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <p className="text-zinc-600">
          Activity stream and telemetry details can be placed here.
        </p>
      </section>
    </div>
  );
}
