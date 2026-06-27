const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const roadmapDir = path.join(root, "roadmaps");
const srcDir = path.join(root, "src");
const legacyRoadmapFiles = ["ai.json", "crypto.json", "longevity.json", "sales.json", "psychology.json", "future.json"];

const tracks = {
  ai_automation: {
    label: "AI & Automation",
    stages: [
      ["ChatGPT Basics", ["Use clear roles", "Ask for structured answers", "Compare short vs detailed prompts", "Create reusable prompt templates"]],
      ["Prompt Engineering", ["Define context windows", "Use examples and constraints", "Design critique prompts", "Turn vague goals into tasks"]],
      ["Projects", ["Build a learning tracker", "Create a sales follow-up system", "Draft customer visit briefs", "Make a personal knowledge workflow"]],
      ["Memory", ["Design persistent preference notes", "Separate facts from assumptions", "Create weekly memory reviews", "Clean outdated context"]],
      ["Canvas", ["Draft strategy documents", "Edit long proposals", "Compare versions", "Build reusable outlines"]],
      ["Deep Research", ["Scope research questions", "Evaluate sources", "Build evidence tables", "Synthesize decisions"]],
      ["Claude", ["Compare long-context workflows", "Draft negotiation scenarios", "Analyze customer emails", "Create style guides"]],
      ["Gemini", ["Use multimodal reasoning", "Compare model answers", "Extract insights from images", "Plan mobile-first research"]],
      ["AI Agents", ["Define agent goals", "Design tool boundaries", "Write agent checklists", "Review agent failures"]],
      ["Automation", ["Map repetitive work", "Create trigger-action flows", "Design approval steps", "Measure time saved"]],
      ["MCP", ["Understand tool connectors", "Plan local tool access", "Design safe permissions", "Document integration contracts"]],
      ["APIs", ["Read API docs", "Plan request payloads", "Handle errors", "Design data schemas"]],
      ["n8n", ["Build a CRM note flow", "Create email follow-up automation", "Add manual approval", "Log results"]],
      ["Python", ["Read and write JSON", "Parse CSV customer lists", "Create small reports", "Automate daily summaries"]],
      ["Sales AI", ["Generate account briefs", "Create pain-point questions", "Draft follow-ups", "Score opportunities"]],
      ["Executive AI", ["Build decision memos", "Create weekly dashboards", "Run scenario planning", "Design personal operating reviews"]]
    ]
  },
  crypto_macro: {
    label: "Crypto & Macro Investing",
    stages: [
      ["Bitcoin", ["Supply schedule", "Self-custody thesis", "Halving cycles", "Store of value debates"]],
      ["Ethereum", ["Smart contracts", "Gas and settlement", "Staking basics", "Application ecosystems"]],
      ["Solana", ["High-throughput chains", "Validator tradeoffs", "Consumer crypto", "Network risk"]],
      ["Wallets", ["Seed phrases", "Hardware wallets", "Hot vs cold storage", "Transaction hygiene"]],
      ["Market Cycles", ["Bull and bear phases", "Liquidity signals", "Sentiment extremes", "Cycle journaling"]],
      ["On-chain", ["Active addresses", "Exchange flows", "Stablecoin supply", "Whale behavior"]],
      ["DeFi", ["AMMs", "Lending risk", "Yield sources", "Smart contract risk"]],
      ["Layer2", ["Rollups", "Bridges", "Sequencers", "Fee compression"]],
      ["AI Coins", ["Narrative risk", "Utility screening", "Token incentives", "Hype control"]],
      ["RWA", ["Tokenized treasuries", "Real asset custody", "Regulatory risk", "Yield quality"]],
      ["DePIN", ["Physical networks", "Token demand", "Unit economics", "Adoption signals"]],
      ["Macro", ["Rates and liquidity", "Dollar strength", "Risk assets", "Central bank cycles"]],
      ["Risk Management", ["Position sizing", "Drawdown plans", "No-leverage rules", "Security checklist"]],
      ["DCA", ["Schedule design", "Rebalance rules", "Cash buffers", "Behavior control"]],
      ["Portfolio", ["Core-satellite allocation", "Thesis writing", "Exit criteria", "Quarterly review"]]
    ]
  },
  longevity_health: {
    label: "Longevity & Health",
    stages: [
      ["Sleep", ["Sleep opportunity", "Wake consistency", "Sleep debt", "Bedroom setup"]],
      ["Circadian Rhythm", ["Morning sunlight", "Meal timing", "Evening light", "Travel rhythm"]],
      ["Nutrition", ["Food quality", "Fiber targets", "Hydration", "Meal composition"]],
      ["Protein", ["Protein distribution", "Leucine threshold", "Lean mass protection", "Dinner choices"]],
      ["Strength", ["Movement patterns", "Progressive overload", "Joint-safe loading", "Recovery days"]],
      ["Zone2", ["Easy aerobic base", "Talk test", "Weekly volume", "Liver-friendly intensity"]],
      ["VO2 Max", ["Intervals basics", "Readiness gating", "Warm-up discipline", "Progress tracking"]],
      ["Mobility", ["Hip mobility", "Thoracic rotation", "Ankle range", "Daily reset"]],
      ["Stress", ["Breathing drills", "Work decompression", "Cortisol habits", "Boundaries"]],
      ["Meditation", ["Attention reps", "Body scan", "Urge surfing", "Evening calm"]],
      ["Liver Health", ["Hepatitis B monitoring", "Alcohol avoidance", "Medication awareness", "Metabolic health"]],
      ["Brain Health", ["Learning blocks", "Social connection", "Blood flow", "Cognitive load"]],
      ["Hormones", ["Sleep and testosterone", "Strength signals", "Body composition", "Stress effects"]],
      ["Recovery", ["Deload rules", "HRV interpretation", "Soreness audit", "Low-energy plans"]],
      ["Latest Research", ["Read abstracts", "Separate signal from hype", "Apply conservatively", "Update routines"]]
    ]
  },
  elite_b2b_sales: {
    label: "Elite B2B Sales",
    stages: [
      ["Prospecting", ["Target interior firms", "Qualify hospitality buyers", "Map marine refit accounts", "Find aviation upholstery leads"]],
      ["Pain Points", ["Material durability", "Color consistency", "Delivery reliability", "Warranty anxiety"]],
      ["Presentation", ["Show genuine vs synthetic tradeoffs", "Tell texture stories", "Use swatches with context", "Link material to project ROI"]],
      ["Negotiation", ["Protect premium positioning", "Trade terms carefully", "Anchor on lifecycle value", "Handle price objections"]],
      ["Closing", ["Define decision process", "Confirm next step", "Ask for trial order", "Lock sample approval"]],
      ["Follow-up", ["Send visit recap", "Share matching options", "Confirm procurement timeline", "Revive dormant deals"]],
      ["CRM", ["Record pain points", "Tag project stage", "Log sample requests", "Schedule next touch"]],
      ["Relationship Marketing", ["Create designer trust", "Remember project details", "Invite showroom visits", "Send useful market notes"]],
      ["Luxury Selling", ["Sell feel and confidence", "Protect brand perception", "Use scarcity honestly", "Elevate decision language"]],
      ["Architect Sales", ["Read specification needs", "Support design intent", "Prepare compliance notes", "Coordinate samples"]],
      ["Marine", ["Salt and humidity concerns", "UV resistance", "Cleaning protocols", "Refit scheduling"]],
      ["Aviation", ["Weight and safety sensitivity", "Premium cabin feel", "Documentation needs", "High-trust follow-up"]],
      ["Hospitality", ["High-traffic durability", "Maintenance cost", "Brand ambience", "Rollout consistency"]]
    ]
  },
  psychology_decision: {
    label: "Psychology & Decision Making",
    stages: [
      ["Persuasion", ["Trust before argument", "Reciprocity", "Social proof", "Authority signals"]],
      ["Behavioral Economics", ["Loss aversion", "Anchoring", "Choice architecture", "Status quo bias"]],
      ["Mental Models", ["Inversion", "Second-order thinking", "Opportunity cost", "Circle of competence"]],
      ["Critical Thinking", ["Separate facts from stories", "Question base rates", "Check incentives", "Look for disconfirming evidence"]],
      ["Negotiation", ["BATNA", "Trading variables", "Silence and pacing", "Framing concessions"]],
      ["Influence", ["Identity-based change", "Commitment", "Emotional temperature", "Language precision"]],
      ["Leadership", ["Clarity", "Standards", "Feedback", "Calm authority"]],
      ["Decision Science", ["Decision journal", "Expected value", "Pre-mortem", "Review loops"]]
    ]
  },
  future_trends: {
    label: "Future Trends",
    stages: [
      ["AI", ["Agentic workflows", "Model commoditization", "AI-native companies", "Human-AI leverage"]],
      ["Robotics", ["Humanoid robots", "Warehouse automation", "Service robots", "Embodied AI"]],
      ["Energy", ["Grid storage", "Solar economics", "Nuclear revival", "Energy abundance"]],
      ["Economics", ["Productivity shocks", "Demographics", "Debt cycles", "Global capital flows"]],
      ["Automation", ["White-collar automation", "Workflow redesign", "New job bundles", "Human oversight"]],
      ["AGI", ["Capability ladders", "Alignment debates", "Economic impact", "Uncertainty maps"]],
      ["Future Jobs", ["AI operators", "Technical sales", "Automation consultants", "Human trust roles"]],
      ["Technology", ["Spatial computing", "Semiconductors", "Edge AI", "Data centers"]],
      ["Geopolitics", ["Supply chains", "Compute sovereignty", "Energy security", "Reserve currencies"]]
    ]
  },
  workout: {
    label: "Recovery-Aware Training",
    stages: [
      ["Strength", ["Upper body push-pull", "Lower body basics", "Full-body circuit", "Core and posture"]],
      ["Moderate Workout", ["Zone2 walk", "Bike or incline walk", "Mobility plus light strength", "Easy conditioning"]],
      ["Mobility", ["Spine reset", "Hip opening", "Shoulder care", "Ankle and calf work"]],
      ["Walking", ["Post-meal walk", "Futsal-waiting walk", "Easy outdoor walk", "Stress decompression walk"]],
      ["Stretching", ["Hamstring and hip flexor", "Chest opener", "Neck and upper back", "Breathing stretch flow"]]
    ]
  }
};

function makeLesson(trackKey, day) {
  const track = tracks[trackKey];
  const stageSpan = Math.ceil(365 / track.stages.length);
  const stageIndex = Math.min(track.stages.length - 1, Math.floor((day - 1) / stageSpan));
  const [category, topics] = track.stages[stageIndex];
  const topic = topics[(day - 1) % topics.length];
  const title = `${category}: ${topic}`;
  const estimatedMinutes = trackKey === "crypto_macro" ? 20 : trackKey === "workout" ? 30 : trackKey === "elite_b2b_sales" ? 12 : trackKey === "psychology_decision" ? 20 : trackKey === "future_trends" ? 20 : 25;

  return {
    facultyId: trackKey,
    day,
    title,
    category,
    estimatedMinutes,
    learningGoal: learningGoalFor(trackKey, category),
    keywords: keywordsFor(category, topic),
    recommendedSourceTypes: recommendedSourceTypesFor(trackKey)
  };
}

function learningGoalFor(track, category) {
  const goals = {
    ai_automation: `Build practical understanding of ${category} and turn it into a useful workflow.`,
    crypto_macro: `Build investment education around ${category} without treating the roadmap as financial advice.`,
    longevity_health: `Understand ${category} as general health education, not personal medical advice.`,
    elite_b2b_sales: `Apply ${category} to premium B2B leather sales execution.`,
    psychology_decision: `Use ${category} to improve judgment, communication, and decision quality.`,
    future_trends: `Understand ${category} as a trend area and separate durable signal from hype.`,
    workout: `Use ${category} as recovery-aware movement guidance.`
  };
  return goals[track];
}

function keywordsFor(category, topic) {
  return Array.from(new Set([
    category,
    topic,
    ...topic.split(/\s+/).filter(word => word.length > 3)
  ])).slice(0, 6);
}

function recommendedSourceTypesFor(track) {
  return {
    ai_automation: ["official product documentation", "model release notes", "developer documentation", "reputable technical analysis"],
    crypto_macro: ["official project blogs", "GitHub", "developer updates", "official documentation", "official announcements"],
    longevity_health: ["medical guidelines", "peer-reviewed research", "reputable health institutions", "clinical review articles"],
    elite_b2b_sales: ["sales books", "industry case studies", "CRM notes", "customer interviews"],
    psychology_decision: ["behavioral science books", "peer-reviewed research", "decision science articles", "case studies"],
    future_trends: ["official company announcements", "developer updates", "research papers", "reputable industry analysis"],
    workout: ["reputable health institutions", "exercise science guidelines", "physical therapy resources"]
  }[track];
}

function buildRoadmap(trackKey) {
  return {
    id: trackKey,
    label: tracks[trackKey].label,
    generatedAt: "2026-06-26",
    lessons: Array.from({ length: 365 }, (_, index) => makeLesson(trackKey, index + 1))
  };
}

fs.mkdirSync(roadmapDir, { recursive: true });
fs.mkdirSync(srcDir, { recursive: true });

for (const file of legacyRoadmapFiles) {
  const filePath = path.join(roadmapDir, file);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

const bundle = {};
for (const key of Object.keys(tracks)) {
  const roadmap = buildRoadmap(key);
  bundle[key] = roadmap;
  fs.writeFileSync(path.join(roadmapDir, `${key}.json`), `${JSON.stringify(roadmap, null, 2)}\n`);
}

const generated = `// Generated from tools/build-roadmaps.js.\n// Keep roadmaps/*.json as the source data; this mirror lets index.html run from file:// without fetch().\nwindow.LIFE_OS_ROADMAPS = ${JSON.stringify(bundle, null, 2)};\n`;
fs.writeFileSync(path.join(srcDir, "roadmaps.generated.js"), generated);

console.log(`Built ${Object.keys(tracks).length} roadmaps with 365 lessons each.`);
