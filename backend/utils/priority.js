// Innovation: auto-prioritize complaints.
// Score = category weight + keyword urgency + upvotes (people affected).
const CATEGORY_WEIGHT = {
  water_leakage: 8,
  damaged_road: 7,
  pothole: 5,
  street_light: 4,
  garbage_overflow: 3,
  other: 2,
};

const URGENT_KEYWORDS = [
  'danger', 'dangerous', 'emergency', 'urgent', 'accident', 'injury',
  'fire', 'child', 'children', 'school', 'hospital', 'flood', 'leak',
  'broken', 'collapse', 'live wire', 'electric',
];

function calcPriority({ category, description = '', upvotes = 0 }) {
  const base = CATEGORY_WEIGHT[category] ?? 2;
  const desc = description.toLowerCase();
  const keywordHits = URGENT_KEYWORDS.reduce(
    (n, k) => (desc.includes(k) ? n + 1 : n),
    0
  );
  return base + keywordHits * 3 + Number(upvotes) * 2;
}

module.exports = { calcPriority };
