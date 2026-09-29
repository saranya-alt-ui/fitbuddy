import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Plus,
  Calendar,
  FileText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { apiService } from "../../services/api";
import { ProgressEntry } from "../../types";

export const ProgressPage: React.FC = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const res = await apiService.getProgress();
      if (res.data?.entries) {
        setEntries(res.data.entries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        weight: parseFloat(weight),
        waist: waist ? parseFloat(waist) : null,
        notes: notes.trim() || null,
      };

      const res = await apiService.addProgress(payload);
      if (res.data?.entry) {
        setEntries((prev) => [res.data.entry, ...prev]);
        setWeight("");
        setWaist("");
        setNotes("");
        setFeedback("New metric recorded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setFeedback("Failed to save progress entry. Please verify numbers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare chart data (chronological)
  const chartData =
    entries.length > 0
      ? [...entries]
          .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
          .map((entry) => ({
            date: new Date(entry.recordedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            weight: entry.weight,
            waist: entry.waist || undefined,
          }))
      : [
          { date: "Day 1", weight: 78.5, waist: 88 },
          { date: "Day 7", weight: 77.9, waist: 87.5 },
          { date: "Day 14", weight: 77.2, waist: 86.8 },
          { date: "Day 21", weight: 76.5, waist: 86.0 },
        ];

  const currentWeight = entries.length > 0 ? entries[0].weight : 76.5;
  const initialWeight = entries.length > 0 ? entries[entries.length - 1].weight : 78.5;
  const diff = Number((currentWeight - initialWeight).toFixed(1));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
          Progress & <span className="text-secondary">Metric Tracking</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Record your weigh-ins, waist circumference, and personal notes to view long-term physiological trends.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs text-muted uppercase font-bold">Latest Recorded Weight</span>
          <p className="text-3xl font-extrabold font-mono text-white mt-1">
            {currentWeight} <span className="text-sm font-sans text-muted">kg</span>
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs text-muted uppercase font-bold">Net Change</span>
          <p
            className={`text-3xl font-extrabold font-mono mt-1 ${
              diff <= 0 ? "text-secondary" : "text-amber-400"
            }`}
          >
            {diff > 0 ? `+${diff}` : `${diff}`}{" "}
            <span className="text-sm font-sans text-muted">kg</span>
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <span className="text-xs text-muted uppercase font-bold">Total Logs</span>
          <p className="text-3xl font-extrabold font-mono text-accent mt-1">
            {entries.length}{" "}
            <span className="text-sm font-sans text-muted">entries recorded</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Logging Form + Recharts Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary-light" />
            <span>Log New Measurement</span>
          </h3>

          <form onSubmit={handleLogProgress} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Body Weight (kg) *
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 74.5"
                  className="w-full bg-surface-100 border border-white/10 focus:border-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Waist Measurement (cm, optional)
              </label>
              <input
                type="number"
                step="0.5"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="e.g. 84.0"
                className="w-full bg-surface-100 border border-white/10 focus:border-secondary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Notes & Physical Feedback (optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Felt high energy during workout, hit all protein targets."
                className="w-full bg-surface-100 border border-white/10 focus:border-secondary rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !weight}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-black font-bold text-sm shadow-glow-secondary hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Recording..." : "Save Metric Entry"}
            </button>
          </form>
        </div>

        {/* Right: Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Body Composition Curve</h3>
                <p className="text-xs text-muted">Weight (kg) progress recorded chronologically</p>
              </div>
              <span className="text-xs font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                Live Dynamic
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: 8 }}
                    itemStyle={{ color: "#fff", fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#22C55E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#greenArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-surface-100 border border-white/5 text-[11px] text-muted flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <span>
              Weight fluctuations of 0.5 - 1.5kg are normal due to water retention and glycogen storage. Track weekly averages for best accuracy.
            </span>
          </div>
        </div>
      </div>

      {/* Historical Entries Log Table */}
      <div className="glass-card p-6 rounded-2xl border border-white/5">
        <h3 className="text-base font-bold text-white mb-4">Measurement History Log</h3>

        {entries.length === 0 ? (
          <p className="text-xs text-muted text-center py-6">
            No entries recorded yet. Use the form above to log your first weigh-in!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted uppercase font-mono tracking-wider">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Weight (kg)</th>
                  <th className="pb-3">Waist (cm)</th>
                  <th className="pb-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-gray-300">
                      {new Date(entry.recordedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-mono font-bold text-white">{entry.weight} kg</td>
                    <td className="py-3 font-mono text-muted">
                      {entry.waist ? `${entry.waist} cm` : "—"}
                    </td>
                    <td className="py-3 text-gray-300">{entry.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
