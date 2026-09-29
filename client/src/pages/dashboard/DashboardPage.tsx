import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Dumbbell,
  Scale,
  Flame,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Bot,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AIPlanContent, WorkoutSession, ProgressEntry, FitnessProfile } from "../../types";

export const DashboardPage: React.FC = () => {
  const { user, isDemoAiMode } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [activePlan, setActivePlan] = useState<AIPlanContent | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, planRes, workoutsRes, progressRes] = await Promise.allSettled([
        apiService.getProfile(),
        apiService.getCurrentPlan(),
        apiService.getWorkouts(),
        apiService.getProgress(),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.data?.profile) {
        setProfile(profileRes.value.data.profile);
      }
      if (planRes.status === "fulfilled" && planRes.value.data?.plan) {
        setActivePlan(planRes.value.data.plan);
      }
      if (workoutsRes.status === "fulfilled" && workoutsRes.value.data?.workouts) {
        setWorkouts(workoutsRes.value.data.workouts);
      }
      if (progressRes.status === "fulfilled" && progressRes.value.data?.entries) {
        setProgressEntries(progressRes.value.data.entries);
      }
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const currentWeight =
    progressEntries.length > 0 ? progressEntries[0].weight : profile?.weight || 75;
  const completedWorkoutsCount = workouts.filter((w) => w.completed).length;
  const totalWorkouts = workouts.length || 4;
  const consistencyScore = Math.min(100, Math.round((completedWorkoutsCount / totalWorkouts) * 100)) || 85;

  // Chart Data: Weight trend
  const weightTrendData =
    progressEntries.length > 1
      ? [...progressEntries].reverse().map((p) => ({
          date: new Date(p.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          weight: p.weight,
        }))
      : [
          { date: "W1", weight: (profile?.weight || 75) + 1.8 },
          { date: "W2", weight: (profile?.weight || 75) + 1.2 },
          { date: "W3", weight: (profile?.weight || 75) + 0.6 },
          { date: "W4", weight: profile?.weight || 75 },
        ];

  // Chart Data: Weekly Activity
  const weeklyActivityData = [
    { day: "Mon", minutes: 45, target: 45 },
    { day: "Tue", minutes: 50, target: 45 },
    { day: "Wed", minutes: 0, target: 0 },
    { day: "Thu", minutes: 45, target: 45 },
    { day: "Fri", minutes: 40, target: 45 },
    { day: "Sat", minutes: 30, target: 30 },
    { day: "Sun", minutes: 0, target: 0 },
  ];

  // Chart Data: Macro ratio
  const macroData = [
    { name: "Protein", value: 30, color: "#7C3AED" },
    { name: "Carbs", value: 45, color: "#06B6D4" },
    { name: "Fats", value: 25, color: "#22C55E" },
  ];

  // Today's workout session
  const todaysWorkout = workouts[0] || activePlan?.workouts?.[0];
  const todaysMeals = activePlan?.nutrition || [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted">Syncing FitBuddy dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['JetBrains_Mono']">
              Welcome back, <span className="text-primary-light">{user?.name?.split(" ")[0] || "Athlete"}</span>!
            </h1>
            {isDemoAiMode && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo AI Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {profile?.goal ? `Target: ${profile.goal}` : "Your personal AI fitness coach is active and tracking."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/assessment"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-50 border border-white/10 hover:border-primary/40 text-xs font-semibold text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary-light" />
            Recalibrate Plan
          </Link>
          <Link
            to="/coach"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white text-xs font-bold shadow-glow-primary transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            Chat with Coach
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Current Weight */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Current Weight</span>
            <Scale className="w-4 h-4 text-primary-light" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold font-mono text-white">{currentWeight} <span className="text-xs font-sans text-muted">kg</span></p>
            <p className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Tracked
            </p>
          </div>
        </div>

        {/* Card 2: Goal */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Primary Goal</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <p className="text-sm sm:text-base font-bold text-white truncate">{profile?.goal || "Fat Loss"}</p>
            <p className="text-[11px] text-muted truncate">{profile?.experience || "Beginner"} level</p>
          </div>
        </div>

        {/* Card 3: Weekly Workouts */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Weekly Workouts</span>
            <Dumbbell className="w-4 h-4 text-accent" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold font-mono text-white">
              {completedWorkoutsCount} <span className="text-xs font-sans text-muted">/ {totalWorkouts} Done</span>
            </p>
            <p className="text-[11px] text-accent mt-0.5">
              {profile?.workoutDays || 4} scheduled / week
            </p>
          </div>
        </div>

        {/* Card 4: Consistency */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Consistency</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold font-mono text-secondary">{consistencyScore}%</p>
            <p className="text-[11px] text-muted mt-0.5">Adherence Rate</p>
          </div>
        </div>

        {/* Card 5: Diet & Fuel */}
        <div className="glass-card p-4 rounded-2xl border border-white/5 col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase">Diet Profile</span>
            <UtensilsCrossed className="w-4 h-4 text-primary-light" />
          </div>
          <div className="mt-2">
            <p className="text-sm sm:text-base font-bold text-white truncate">{profile?.diet || "Balanced"}</p>
            <p className="text-[11px] text-muted truncate">{profile?.equipment || "Dumbbells"}</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recharts Trend Graphs (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Training Volume Chart */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Activity (Minutes)</h3>
                <p className="text-xs text-muted">Actual workout duration vs. planned session target</p>
              </div>
              <span className="text-xs font-mono text-primary-light bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                This Week
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData}>
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: 8 }}
                    itemStyle={{ color: "#fff", fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight Trajectory Chart */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Weight Progress Trajectory</h3>
                <p className="text-xs text-muted">Historical recorded entries over time</p>
              </div>
              <Link to="/progress" className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold">
                Log New Weight <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#71717A" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: 8 }}
                    itemStyle={{ color: "#fff", fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={{ fill: "#22C55E", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Action Widgets (1 col) */}
        <div className="space-y-6">
          {/* Today's Workout Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary-light" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Workout</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-muted">
                {todaysWorkout?.duration || 45}m
              </span>
            </div>

            <div className="mt-3">
              <p className="text-base font-bold text-white">{todaysWorkout?.focus || "Full Body Power"}</p>
              <p className="text-xs text-muted mt-0.5">
                {(todaysWorkout as any)?.exercises?.length || 4} targeted exercises
              </p>

              <div className="mt-3 space-y-2">
                {((todaysWorkout as any)?.exercises || []).slice(0, 3).map((ex: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-surface-100 text-xs">
                    <span className="text-gray-200 font-medium truncate max-w-[170px]">{ex.name}</span>
                    <span className="text-muted font-mono">{ex.sets} × {ex.reps}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/workouts"
                className="mt-4 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-primary/30"
              >
                Start Workout Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Today's Nutrition Breakdown */}
          <div className="glass-card p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Macro Targets</h3>
              </div>
              <span className="text-xs font-bold text-secondary font-mono">~2,200 kcal</span>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      dataKey="value"
                      innerRadius={24}
                      outerRadius={38}
                      paddingAngle={4}
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Protein
                  </span>
                  <span className="font-mono font-bold text-white">155g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-accent" /> Carbs
                  </span>
                  <span className="font-mono font-bold text-white">230g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Fats
                  </span>
                  <span className="font-mono font-bold text-white">65g</span>
                </div>
              </div>
            </div>

            <Link
              to="/nutrition"
              className="mt-3 block text-center text-xs text-secondary hover:underline font-semibold"
            >
              View Full Meal Plan & Recipes →
            </Link>
          </div>

          {/* AI Recommendation Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-2 mb-2 text-primary-light">
              <Bot className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Daily Recommendation</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed italic">
              "{activePlan?.tips?.[0] || "Remember progressive overload: focus on clean form and steady pacing before adding resistance."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
