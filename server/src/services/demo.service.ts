import { FitnessProfile, AIPlanContent } from "../types/index.js";

export function generateDemoPlan(profile: FitnessProfile): AIPlanContent {
  const isBeginner = profile.experience === "Beginner";
  const days = profile.workoutDays || 4;
  const duration = profile.workoutDuration || 45;
  const goal = profile.goal || "General Fitness";
  const equipment = profile.equipment || "Bodyweight";
  const diet = profile.diet || "Balanced";

  // Build weekly schedule
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklySchedule = weekDays.map((day, idx) => {
    const isTraining = idx < days;
    let activity = "Active Recovery & Mobility";
    if (isTraining) {
      if (idx % 2 === 0) activity = "Upper Body & Core Foundation";
      else activity = "Lower Body & Aerobic Capacity";
    } else {
      if (idx === 6) activity = "Complete Rest & Nutrition Prep";
    }
    return {
      day,
      activity,
      isRestDay: !isTraining,
    };
  });

  // Build workouts matching user equipment
  const sampleWorkouts = [];
  const exerciseBank: Record<string, { name: string; sets: number; reps: string; rest: string; instructions: string }[]> = {
    "Bodyweight": [
      { name: "Standard Bodyweight Squats", sets: 3, reps: "12-15", rest: "45s", instructions: "Keep chest up and knees tracking over toes." },
      { name: "Incline or Standard Push-ups", sets: 3, reps: "8-12", rest: "60s", instructions: "Maintain a straight plank line from heels to head." },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "60s", instructions: "Step forward into a 90-degree angle without letting front knee collapse inward." },
      { name: "Glute Bridges", sets: 3, reps: "15 reps", rest: "45s", instructions: "Drive through heels, squeeze glutes at the top." },
      { name: "Forearm Plank Hold", sets: 3, reps: "30-45s", rest: "45s", instructions: "Brace abdominal wall and avoid letting lower back sag." },
    ],
    "Dumbbells": [
      { name: "Goblet Squats", sets: 3, reps: "10-12", rest: "60s", instructions: "Hold dumbbell vertically against chest, descend controlled." },
      { name: "Dumbbell Floor or Bench Press", sets: 3, reps: "8-10", rest: "60s", instructions: "Drive dumbbells upward, elbows at 45-degree angle." },
      { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", rest: "60s", instructions: "Hinge at hips with slight knee bend, feeling hamstring tension." },
      { name: "One-Arm Dumbbell Row", sets: 3, reps: "10-12 each", rest: "60s", instructions: "Pull dumbbell towards hip crease while maintaining flat back." },
      { name: "Seated Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "60s", instructions: "Press vertically overhead without arching lower back excessively." },
    ],
    "Full Gym": [
      { name: "Barbell Back Squat / Leg Press", sets: 3, reps: "8-10", rest: "90s", instructions: "Brace core, descend to parallel with controlled tempo." },
      { name: "Barbell Bench Press / Cable Chest Press", sets: 3, reps: "8-10", rest: "90s", instructions: "Retract shoulder blades and lower bar smoothly to sternum." },
      { name: "Lat Pulldown / Pull-ups", sets: 3, reps: "10-12", rest: "60s", instructions: "Drive elbows down and squeeze lats at the bottom." },
      { name: "Dumbbell Walking Lunges", sets: 3, reps: "12 each leg", rest: "60s", instructions: "Maintain upright posture with controlled knee descent." },
      { name: "Hanging Leg Raises / Cable Woodchops", sets: 3, reps: "12-15", rest: "45s", instructions: "Engage core to lift knees without swinging." },
    ],
  };

  const selectedExercises =
    equipment.includes("Gym")
      ? exerciseBank["Full Gym"]
      : equipment.includes("Dumbbell")
      ? exerciseBank["Dumbbells"]
      : exerciseBank["Bodyweight"];

  for (let i = 0; i < Math.min(days, 5); i++) {
    const day = weekDays[i];
    const isUpper = i % 2 === 0;
    sampleWorkouts.push({
      day,
      focus: isUpper ? "Upper Body & Core Hypertrophy" : "Lower Body & Posterior Chain",
      duration,
      warmup: [
        "5 minutes light brisk walking or jumping jacks",
        "Arm circles & shoulder dislocates (10 reps each direction)",
        "Dynamic leg swings & bodyweight hip openers",
      ],
      exercises: selectedExercises.slice(isUpper ? 0 : 2, isUpper ? 4 : 5),
      cooldown: [
        "Hamstring & hip flexor stretch (45s each)",
        "Child's pose & torso rotation (60s)",
        "Slow diaphragmatic breathing for parasympathetic recovery (2 mins)",
      ],
    });
  }

  // Build nutrition based on diet preference
  const isVeg = diet.toLowerCase().includes("veg");
  const isVegan = diet.toLowerCase().includes("vegan");
  const isIndian = diet.toLowerCase().includes("indian");

  let breakfastFoods = ["Rolled oats with almond milk, chia seeds, and berries", "Scrambled eggs with spinach (or tofu scramble)", "Black coffee or green tea"];
  let lunchFoods = ["Grilled lemon herb chicken breast", "Brown rice or quinoa", "Steamed broccoli with olive oil"];
  let snackFoods = ["Greek yogurt with walnuts and honey", "1 sliced apple"];
  let dinnerFoods = ["Pan-seared salmon fillet", "Roasted sweet potato wedges", "Arugula & cucumber salad"];

  if (isIndian) {
    breakfastFoods = ["Moong dal chilla / Poha with peanuts and veggies", "1 cup low-fat curd or paneer bhurji", "Ginger spiced tea without refined sugar"];
    lunchFoods = ["2 Multigrain rotis / Brown rice bowl", "Yellow tadka dal or Rajma curry", "Palak paneer or Soya chunks curry", "Fresh cucumber & carrot salad"];
    snackFoods = ["Roasted makhana (foxnuts) with chaat masala", "Sprouted moong salad with lemon juice"];
    dinnerFoods = ["Grilled paneer tikka or Tandoori chicken", "Mixed vegetable sabzi", "Warm bowl of vegetable soup"];
  } else if (isVegan) {
    breakfastFoods = ["Chia pudding with soy milk, flaxseeds, and mixed berries", "Handful of crushed almonds and pumpkin seeds"];
    lunchFoods = ["Tempeh & black bean quinoa bowl", "Avocado slices, diced tomatoes, cilantro", "Tahini lemon dressing"];
    snackFoods = ["Hummus with raw carrot and cucumber sticks", "Handful of roasted edamame"];
    dinnerFoods = ["Tofu and bok choy stir-fry with ginger-garlic sauce", "Brown jasmine rice", "Sesame seeds garnish"];
  } else if (isVeg) {
    breakfastFoods = ["Oatmeal cooked with skim milk, sliced banana, and hemp seeds", "Handful of walnuts"];
    lunchFoods = ["Paneer / Lentil grain bowl", "Quinoa, roasted zucchini, and bell peppers", "Olive oil vinaigrette"];
    snackFoods = ["Cottage cheese / Greek yogurt with blueberries", "Unsalted almonds"];
    dinnerFoods = ["Chickpea spinach curry", "Brown basmati rice", "Cucumber raita"];
  }

  const nutrition = [
    {
      meal: "Breakfast",
      foods: breakfastFoods,
      estimatedCalories: 450,
      protein: 24,
      carbohydrates: 55,
      fat: 14,
    },
    {
      meal: "Lunch",
      foods: lunchFoods,
      estimatedCalories: 620,
      protein: 45,
      carbohydrates: 65,
      fat: 18,
    },
    {
      meal: "Afternoon Snack",
      foods: snackFoods,
      estimatedCalories: 220,
      protein: 16,
      carbohydrates: 22,
      fat: 6,
    },
    {
      meal: "Dinner",
      foods: dinnerFoods,
      estimatedCalories: 560,
      protein: 40,
      carbohydrates: 48,
      fat: 16,
    },
  ];

  return {
    summary: `Personalized AI blueprint calibrated for ${goal.toLowerCase()} using ${equipment.toLowerCase()}. Built around progressive overload, ${diet.toLowerCase()} nutrition, and adequate neuromuscular recovery.`,
    goal: `${goal} with ${days} training sessions per week at ${duration} minutes per workout.`,
    weeklySchedule,
    workouts: sampleWorkouts,
    nutrition,
    recovery: [
      "Prioritize 7.5 to 8.5 hours of uninterrupted sleep for tissue repair.",
      "Hydrate consistently with 30-40ml of water per kg of body weight daily.",
      "Take 10-minute low-intensity post-meal walks to enhance insulin sensitivity.",
      "Incorporate 5 minutes of foam rolling or gentle dynamic stretches after each workout.",
    ],
    tips: [
      "Log your weights and reps each week; aim for 1 extra rep or slightly better form before increasing resistance.",
      "Eat within 90 minutes post-training to replenish glycogen and support protein synthesis.",
      "If fatigue persists beyond 48 hours, replace a high-intensity session with light mobility.",
    ],
  };
}

export function generateDemoChatResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("miss") || lower.includes("skip")) {
    return `**No stress at all!** Fitness is a long game. Missing a single workout won't undo your progress.\n\nHere is what you should do:\n- **Don't double up:** Do not do two workouts in one day to compensate.\n- **Shift by one day:** Simply pick up today with the workout you missed yesterday.\n- **Focus on consistency:** Stay hydrated and hit your nutrition targets today.`;
  }

  if (lower.includes("egg") || lower.includes("substitute") || lower.includes("protein")) {
    return `Here are excellent high-protein alternatives to eggs:\n\n- **Plant-based:** Tofu scramble (seasoned with turmeric, nutritional yeast, and black salt), Sprouted Moong Dal chilla, or Tempeh bacon.\n- **Dairy:** Low-fat Greek yogurt (15-20g protein per cup) or Paneer / Cottage cheese.\n- **Convenient:** High-quality pea/rice or whey protein smoothie with oats and chia seeds.`;
  }

  if (lower.includes("rest") || lower.includes("recovery")) {
    return `Rest days are when your muscles actually grow and repair! Here is the optimal rest day protocol:\n\n1. **Active Recovery:** A relaxed 20-30 minute outdoor walk or gentle yoga flow.\n2. **Hydration:** Keep sipping water throughout the day with a pinch of electrolytes.\n3. **Nutrition:** Maintain your protein intake to support muscle repair, even on non-training days.\n4. **Sleep:** Aim for 8 hours of restorative deep sleep tonight!`;
  }

  if (lower.includes("today") || lower.includes("workout")) {
    return `To see today's workout, head over to the **Workout** tab in your dashboard! Make sure to:\n\n- Spend 5 minutes on dynamic warm-ups.\n- Focus on mind-muscle connection over heavy ego lifting.\n- Check off each set as you conquer it!`;
  }

  return `That's a great question! Consistent habits, progressive overload, and mindful nutrition will get you to your goal faster than extreme regimens. Remember to listen to your body, prioritize sleep, and stay hydrated. How can I help refine your routine today?`;
}
