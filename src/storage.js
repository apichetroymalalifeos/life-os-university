// Storage adapter for Life OS.
// Today it uses localStorage only. The app talks to this adapter instead of
// localStorage directly so SQLite, Supabase, or a local API can replace it later.
(function () {
  const STATE_KEY = "life-os-2-state";

  const defaultState = {
    version: "2.1",
    generatedDate: null,
    sleep: { hours: "", deep: "", rem: "", wakes: "" },
    progress: {
      ai: { day: 1, completed: 0, skipped: 0 },
      crypto: { day: 1, completed: 0, skipped: 0 },
      longevity: { day: 1, completed: 0, skipped: 0 },
      sales: { day: 1, completed: 0, skipped: 0 },
      psychology: { day: 1, completed: 0, skipped: 0 },
      future: { day: 1, completed: 0, skipped: 0 },
      workout: { day: 1, completed: 0, skipped: 0 }
    },
    university: {
      currentFaculty: "ai",
      weakAreas: [],
      strongAreas: [],
      goals: ["Health", "AI", "Financial Freedom", "Family"],
      quizScores: {},
      history: []
    },
    days: {},
    notes: {},
    settings: { workoutOverride: "auto", language: "en", notificationsEnabled: false },
    streaks: { current: 0, longest: 0, lastFullCompleteDate: null }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDefaults(raw) {
    const state = Object.assign(clone(defaultState), raw || {});
    state.sleep = Object.assign(clone(defaultState.sleep), state.sleep || {});
    state.progress = Object.assign(clone(defaultState.progress), state.progress || {});
    Object.keys(defaultState.progress).forEach(key => {
      state.progress[key] = Object.assign(clone(defaultState.progress[key]), state.progress[key] || {});
    });
    state.days = state.days || {};
    state.notes = state.notes || {};
    state.university = Object.assign(clone(defaultState.university), state.university || {});
    state.university.weakAreas ||= [];
    state.university.strongAreas ||= [];
    state.university.goals ||= clone(defaultState.university.goals);
    state.university.quizScores ||= {};
    state.university.history ||= [];
    state.settings = Object.assign(clone(defaultState.settings), state.settings || {});
    state.streaks = Object.assign(clone(defaultState.streaks), state.streaks || {});
    state.version = "2.1";
    return state;
  }

  function load() {
    try {
      return mergeDefaults(JSON.parse(localStorage.getItem(STATE_KEY)));
    } catch {
      return mergeDefaults();
    }
  }

  function save(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function exportJson(state) {
    return JSON.stringify(state, null, 2);
  }

  function importJson(json) {
    return mergeDefaults(JSON.parse(json));
  }

  window.LifeOSStorage = {
    STATE_KEY,
    defaultState,
    load,
    save,
    exportJson,
    importJson
  };
})();
