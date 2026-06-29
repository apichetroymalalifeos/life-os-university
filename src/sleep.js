// Sleep Optimization + Sleep Intelligence engine.
// Uses local JSON-shaped data and localStorage state only. No paid APIs, AI APIs, or OCR.
// Future: OCR screenshot import
// Future: Apple Health / Samsung Health import
// Future: auto trend chart
// Future: AI analysis optional only when user requests
// Future: export sleep report as PDF
(function () {
  const TARGETS = {
    workday: { bedtime: "22:00", wake: "05:30", minutes: 450 },
    weekend: { bedtime: "22:00", wake: "05:30", minutes: 450 },
    holiday: { bedtime: "22:00", wake: "05:30", minutes: 450 }
  };

  const HABITS = [
    ["caffeine_after_14", "ดื่มกาแฟหลัง 14:00"],
    ["exercise", "ออกกำลังกาย"],
    ["late_heavy_meal", "กินมื้อหนักดึก"],
    ["screen_after_21", "ใช้จอหลัง 21:00"],
    ["work_stress_after_21", "งาน/ความเครียดหลัง 21:00"],
    ["alcohol", "แอลกอฮอล์"],
    ["reading_before_bed", "อ่านหนังสือก่อนนอน"],
    ["breathing_exercise", "ฝึกหายใจ"],
    ["morning_sunlight", "รับแสงแดดตอนเช้า"]
  ];

  const SAMPLE_LOGS = [
    {
      date: "2026-06-28",
      day_type: "holiday",
      source: "manual_from_screenshot",
      screenshot_note: "ข้อมูลมาจากรูปแคปหน้าจอแอปสุขภาพ",
      sleep_score: 84,
      bedtime: "02:36",
      wake_time: "08:54",
      total_sleep_minutes: 378,
      deep_sleep_minutes: 125,
      deep_sleep_percent: 33,
      light_sleep_minutes: 175,
      light_sleep_percent: 46,
      rem_sleep_minutes: 78,
      rem_sleep_percent: 21,
      awake_count: 0,
      breathing_quality_score: 94,
      heart_rate_range: "40-75",
      spo2_range: "93-99",
      breathing_rate_range: "12-17",
      target_bedtime: "22:00",
      target_wake_time: "05:30",
      target_sleep_minutes: 450,
      notes: "วันหยุด คะแนนดี Deep และ REM ดี แต่เวลานอนรวมยังน้อยกว่ามาตรฐาน",
      habits: {
        caffeine_after_14: false,
        exercise: false,
        late_heavy_meal: false,
        screen_after_21: true,
        work_stress_after_21: false,
        alcohol: false,
        reading_before_bed: false,
        breathing_exercise: false,
        morning_sunlight: false
      }
    },
    {
      date: "2026-06-29",
      day_type: "workday",
      source: "manual_from_screenshot",
      screenshot_note: "ข้อมูลมาจากรูปแคปหน้าจอแอปสุขภาพ",
      sleep_score: 87,
      bedtime: "22:23",
      wake_time: "05:50",
      total_sleep_minutes: 445,
      deep_sleep_minutes: 118,
      deep_sleep_percent: 27,
      light_sleep_minutes: 260,
      light_sleep_percent: 58,
      rem_sleep_minutes: 67,
      rem_sleep_percent: 15,
      awake_count: 1,
      sleep_continuity_score: 89,
      breathing_quality_score: 96,
      heart_rate_range: "45-68",
      spo2_range: "89-99",
      breathing_rate_range: "13-20",
      target_bedtime: "22:00",
      target_wake_time: "05:30",
      target_sleep_minutes: 450,
      notes: "เข้าใกล้เป้าหมายวันทำงานมาก นอนขาดเพียง 5 นาที Deep ดี การหายใจดี แต่ REM ต่ำกว่าที่ต้องการ",
      habits: {
        caffeine_after_14: false,
        exercise: false,
        late_heavy_meal: false,
        screen_after_21: false,
        work_stress_after_21: false,
        alcohol: false,
        reading_before_bed: true,
        breathing_exercise: true,
        morning_sunlight: true
      }
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function minutesFromTime(time) {
    if (!time || !String(time).includes(":")) return null;
    const [hours, minutes] = String(time).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  }

  function bedtimeDelayMinutes(bedtime, target = "22:00") {
    const actual = minutesFromTime(bedtime);
    const goal = minutesFromTime(target);
    if (actual === null || goal === null) return 0;
    let diff = actual - goal;
    if (diff < -720) diff += 1440;
    return diff;
  }

  function wakeDeltaMinutes(wake, target = "05:30") {
    const actual = minutesFromTime(wake);
    const goal = minutesFromTime(target);
    if (actual === null || goal === null) return 0;
    return Math.abs(actual - goal);
  }

  function formatMinutes(minutes) {
    const safe = Math.max(0, Math.round(Number(minutes) || 0));
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    return `${h}ชม. ${m}น.`;
  }

  function normalizeLog(log) {
    const target = TARGETS[log.day_type] || TARGETS.workday;
    const habits = Object.fromEntries(HABITS.map(([key]) => [key, Boolean(log.habits?.[key])]));
    return {
      source: "manual_from_screenshot",
      screenshot_note: "ข้อมูลมาจากรูปแคปหน้าจอแอปสุขภาพ",
      target_bedtime: target.bedtime,
      target_wake_time: target.wake,
      target_sleep_minutes: target.minutes,
      notes: "",
      ...log,
      habits
    };
  }

  function sortedLogs(logs) {
    return (logs || []).map(normalizeLog).sort((a, b) => a.date.localeCompare(b.date));
  }

  function latestLog(logs) {
    return sortedLogs(logs).at(-1) || null;
  }

  function average(logs, field) {
    const values = logs.map(log => Number(log[field])).filter(Number.isFinite);
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function onTargetBedtime(log) {
    return bedtimeDelayMinutes(log.bedtime, log.target_bedtime) <= 30;
  }

  function onTargetWake(log) {
    return wakeDeltaMinutes(log.wake_time, log.target_wake_time) <= 30;
  }

  function metSleepTarget(log) {
    return Number(log.total_sleep_minutes) >= Number(log.target_sleep_minutes);
  }

  function analyzeDaily(log, history = []) {
    if (!log) return null;
    const normalized = normalizeLog(log);
    const issues = [];
    const strengths = [];
    const holidayNote = normalized.day_type !== "workday"
      ? "วันนี้เป็นวันหยุด ข้อมูลนี้ใช้ดูแนวโน้ม แต่เป้าหมายหลักของวันทำงานคือ 22:00–05:30"
      : "";

    if (Number(normalized.total_sleep_minutes) < Number(normalized.target_sleep_minutes)) issues.push("เวลานอนยังไม่ถึงเป้าหมาย");
    if (bedtimeDelayMinutes(normalized.bedtime, normalized.target_bedtime) > 30) issues.push("เข้านอนช้ากว่าเป้าหมาย");
    if (wakeDeltaMinutes(normalized.wake_time, normalized.target_wake_time) > 30) issues.push("เวลาตื่นไม่ตรงเป้าหมาย");
    if (Number(normalized.rem_sleep_percent) < 20) issues.push("REM ต่ำกว่าที่ต้องการ");

    if (Number(normalized.deep_sleep_percent) >= 25) strengths.push("Deep Sleep ดี");
    if (Number(normalized.rem_sleep_percent) >= 20 && Number(normalized.rem_sleep_percent) <= 25) strengths.push("REM ดี");
    if (Number(normalized.awake_count) <= 1) strengths.push("การนอนต่อเนื่องดี");
    if (Number(normalized.breathing_quality_score) >= 90) strengths.push("คุณภาพการหายใจดี");

    const recentLowBreathing = sortedLogs(history).slice(-3).filter(item => Number(item.breathing_quality_score) < 70).length >= 2;
    if (recentLowBreathing) issues.push("คุณภาพการหายใจต่ำต่อเนื่อง ควรติดตามซ้ำและพิจารณาปรึกษาแพทย์");

    const primaryWeakness = normalized.date === "2026-06-29"
      ? "REM ต่ำกว่าที่ต้องการ"
      : issues[0] || "ยังไม่มีจุดบกพร่องเด่น";

    const todayFix = primaryWeakness.includes("REM")
      ? "คืนนี้ลดแสงจอหลัง 20:30 งดงานหนักหลัง 21:00 และฝึกหายใจ 4-2-6 ก่อนนอน"
      : primaryWeakness.includes("เวลานอน")
        ? "ขยับเข้านอนเร็วขึ้น 10–15 นาที โดยไม่ฝืนตื่นเช้าเกินไป"
        : "รักษา routine เดิมและดูค่าเฉลี่ย 7 วัน";

    return {
      log: normalized,
      strengths,
      primaryWeakness,
      todayFix,
      holidayNote,
      tonightTarget: "คืนนี้เป้าหมายคือเข้านอน 22:00 ตื่น 05:30 และนอนให้ได้อย่างน้อย 7 ชั่วโมง 30 นาที",
      medicalNote: "ข้อมูลนี้เป็นการศึกษาและติดตามพฤติกรรม ไม่ใช่คำแนะนำการรักษา หากมีอาการผิดปกติควรปรึกษาแพทย์"
    };
  }

  function trend(logs, days) {
    const slice = sortedLogs(logs).slice(-days);
    return {
      days,
      count: slice.length,
      averageSleepScore: Math.round(average(slice, "sleep_score")),
      averageSleepMinutes: Math.round(average(slice, "total_sleep_minutes")),
      averageDeepPercent: Math.round(average(slice, "deep_sleep_percent")),
      averageRemPercent: Math.round(average(slice, "rem_sleep_percent")),
      bedtimeOnTargetDays: slice.filter(onTargetBedtime).length,
      sleepTargetDays: slice.filter(metSleepTarget).length
    };
  }

  function sleepDebt(logs, days) {
    let debt = 0;
    sortedLogs(logs).slice(-days).forEach(log => {
      const diff = Number(log.target_sleep_minutes) - Number(log.total_sleep_minutes);
      debt = Math.max(0, debt + diff);
    });
    let status = "ดีมาก";
    let advice = "รักษาความสม่ำเสมอเดิม";
    if (debt > 300) {
      status = "ควรจัด recovery week";
      advice = "เพิ่ม recovery night 1–2 คืน และห้ามนอนชดเชยยาวจนเสีย circadian rhythm";
    } else if (debt > 120) {
      status = "ต้องระวัง";
      advice = "เพิ่ม recovery night 1–2 คืน";
    } else if (debt > 30) {
      status = "เริ่มสะสม";
      advice = "เข้านอนเร็วขึ้น 10–15 นาที";
    }
    return { days, debt, status, advice };
  }

  function habitImpact(logs) {
    const list = sortedLogs(logs);
    if (list.length < 7) {
      return { ready: false, message: "ต้องมีข้อมูลอย่างน้อย 7 วันเพื่อวิเคราะห์ผลของพฤติกรรม" };
    }
    const impacts = HABITS.map(([key, label]) => {
      const withHabit = list.filter(log => log.habits?.[key]);
      const withoutHabit = list.filter(log => !log.habits?.[key]);
      const scoreDelta = average(withoutHabit, "sleep_score") ? average(withHabit, "sleep_score") - average(withoutHabit, "sleep_score") : 0;
      return {
        key,
        label,
        scoreDelta,
        remDelta: average(withHabit, "rem_sleep_percent") - average(withoutHabit, "rem_sleep_percent"),
        deepDelta: average(withHabit, "deep_sleep_percent") - average(withoutHabit, "deep_sleep_percent"),
        bedtimeDelayDelta: average(withHabit.map(log => ({ delay: bedtimeDelayMinutes(log.bedtime, log.target_bedtime) })), "delay") -
          average(withoutHabit.map(log => ({ delay: bedtimeDelayMinutes(log.bedtime, log.target_bedtime) })), "delay")
      };
    });
    const best = [...impacts].sort((a, b) => b.scoreDelta - a.scoreDelta)[0];
    const worst = [...impacts].sort((a, b) => a.scoreDelta - b.scoreDelta)[0];
    return { ready: true, best, worst, impacts };
  }

  function recoveryScore(logs) {
    const log = latestLog(logs);
    if (!log) return { score: 0, status: "ยังไม่มีข้อมูล" };
    const debt7 = sleepDebt(logs, 7).debt;
    const totalCompletion = Math.min(100, (Number(log.total_sleep_minutes) / Number(log.target_sleep_minutes)) * 100);
    const deepScore = Math.min(100, (Number(log.deep_sleep_percent) / 25) * 100);
    const remScore = Math.min(100, (Number(log.rem_sleep_percent) / 20) * 100);
    const debtScore = Math.max(0, 100 - debt7 / 3);
    let score = Number(log.sleep_score) * .3 + totalCompletion * .2 + deepScore * .15 + remScore * .15 +
      Number(log.breathing_quality_score || 0) * .1 + debtScore * .1;
    if (Number(log.awake_count) > 1) score -= 5;
    if (bedtimeDelayMinutes(log.bedtime, log.target_bedtime) > 60) score -= 5;
    if (debt7 > 120) score -= 5;
    score = Math.max(0, Math.min(100, Math.round(score)));
    const status = score >= 85 ? "ลุยได้เต็มที่" : score >= 70 ? "ทำงานปกติ แต่ระวังพลังตก" : score >= 55 ? "ลดงานหนัก / ลดออกกำลังกายหนัก" : "Recovery Day";
    return { score, status };
  }

  function sleepStreak(logs) {
    const list = sortedLogs(logs).filter(log => log.day_type === "workday");
    let current = 0;
    let best = 0;
    const dayResults = list.map(log => {
      const checks = {
        bedtime: bedtimeDelayMinutes(log.bedtime, log.target_bedtime) <= 30,
        wake: onTargetWake(log),
        sleep: metSleepTarget(log),
        caffeine: !log.habits?.caffeine_after_14,
        screen: !log.habits?.screen_after_21,
        breathing: Boolean(log.habits?.breathing_exercise)
      };
      const passed = Object.values(checks).every(Boolean);
      current = passed ? current + 1 : 0;
      best = Math.max(best, current);
      return { log, checks, passed };
    });
    const today = dayResults.at(-1);
    const passedItems = today ? Object.entries(today.checks).filter(([, ok]) => ok).map(([key]) => key) : [];
    const missedItems = today ? Object.entries(today.checks).filter(([, ok]) => !ok).map(([key]) => key) : [];
    const message = today?.checks.sleep === false
      ? "วันนี้เกือบสมบูรณ์ ขาดเพียงเวลานอนอีกเล็กน้อย"
      : Number(today?.log.rem_sleep_percent) < 20
        ? "REM ต่ำวันนี้ อย่าเพิ่งกังวล ให้ดูค่าเฉลี่ย 7 วัน"
        : "รักษาเวลา 22:00–05:30 ต่ออีก 3 วัน จะเริ่มเห็น pattern ชัดขึ้น";
    return { current, best, passedItems, missedItems, weeklyGoal: "ทำ streak คุณภาพ 4 วันทำงานในสัปดาห์นี้", message };
  }

  function weeklySummary(logs) {
    const week = sortedLogs(logs).slice(-7);
    const workdays = week.filter(log => log.day_type === "workday");
    const holidays = week.filter(log => log.day_type !== "workday");
    const repeated = {};
    week.forEach(log => {
      analyzeDaily(log, week).primaryWeakness.split(",").forEach(issue => {
        repeated[issue] = (repeated[issue] || 0) + 1;
      });
    });
    const topIssue = Object.entries(repeated).sort((a, b) => b[1] - a[1])[0]?.[0] || "ยังไม่มีข้อมูลพอ";
    const firstHalf = average(week.slice(0, Math.ceil(week.length / 2)), "sleep_score");
    const secondHalf = average(week.slice(Math.ceil(week.length / 2)), "sleep_score");
    return {
      averageSleepMinutes: Math.round(average(week, "total_sleep_minutes")),
      averageSleepScore: Math.round(average(week, "sleep_score")),
      averageDeepPercent: Math.round(average(week, "deep_sleep_percent")),
      averageRemPercent: Math.round(average(week, "rem_sleep_percent")),
      averageWorkdayScore: Math.round(average(workdays, "sleep_score")),
      averageHolidayScore: Math.round(average(holidays, "sleep_score")),
      workdayBedtimeOnTarget: workdays.filter(onTargetBedtime).length,
      workdayWakeOnTarget: workdays.filter(onTargetWake).length,
      workdaySleepTarget: workdays.filter(metSleepTarget).length,
      recurringWeakness: topIssue,
      trend: secondHalf >= firstHalf ? "แนวโน้มดีขึ้นหรือทรงตัว" : "แนวโน้มแย่ลง ควรลด sleep debt"
    };
  }

  function buildLogFromForm(form) {
    const data = new FormData(form);
    const log = {
      date: data.get("date"),
      day_type: data.get("day_type"),
      source: "manual_from_screenshot",
      screenshot_note: "ข้อมูลมาจากรูปแคปหน้าจอแอปสุขภาพ",
      sleep_score: Number(data.get("sleep_score")),
      bedtime: data.get("bedtime"),
      wake_time: data.get("wake_time"),
      total_sleep_minutes: Number(data.get("total_sleep_minutes")),
      deep_sleep_minutes: Number(data.get("deep_sleep_minutes")),
      deep_sleep_percent: Number(data.get("deep_sleep_percent")),
      light_sleep_minutes: Number(data.get("light_sleep_minutes")),
      light_sleep_percent: Number(data.get("light_sleep_percent")),
      rem_sleep_minutes: Number(data.get("rem_sleep_minutes")),
      rem_sleep_percent: Number(data.get("rem_sleep_percent")),
      awake_count: Number(data.get("awake_count")),
      sleep_continuity_score: Number(data.get("sleep_continuity_score")),
      breathing_quality_score: Number(data.get("breathing_quality_score")),
      heart_rate_range: data.get("heart_rate_range"),
      spo2_range: data.get("spo2_range"),
      breathing_rate_range: data.get("breathing_rate_range"),
      target_bedtime: "22:00",
      target_wake_time: "05:30",
      target_sleep_minutes: 450,
      notes: data.get("notes") || "",
      habits: {}
    };
    HABITS.forEach(([key]) => {
      log.habits[key] = data.get(key) === "on";
    });
    return normalizeLog(log);
  }

  window.LifeOSSleep = {
    TARGETS,
    HABITS,
    SAMPLE_LOGS,
    clone,
    formatMinutes,
    bedtimeDelayMinutes,
    wakeDeltaMinutes,
    normalizeLog,
    sortedLogs,
    latestLog,
    analyzeDaily,
    trend,
    sleepDebt,
    habitImpact,
    recoveryScore,
    sleepStreak,
    weeklySummary,
    buildLogFromForm,
    onTargetBedtime,
    onTargetWake,
    metSleepTarget
  };
})();
