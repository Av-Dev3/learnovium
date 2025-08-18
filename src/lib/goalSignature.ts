export type GoalSignatureInput = {
  topic: string;
  focus?: string | null;
  level?: string | null;            // profile.level
  minutes_per_day?: number | null;  // profile.minutes_per_day
  locale?: string | null;           // profile.tz or 'en'
  version?: number | null;          // plan_version default 1
};

export function canonicalizeSignature(i: GoalSignatureInput) {
  const topic = (i.topic ?? "").trim().toLowerCase();
  const focus = (i.focus ?? "").trim().toLowerCase();
  const level = (i.level ?? "").trim().toLowerCase();
  const minutes = String(i.minutes_per_day ?? 0);
  const locale = (i.locale ?? "en").trim().toLowerCase();
  const version = String(i.version ?? 1);
  const raw = [topic, focus, level, minutes, locale, version].join("|");
  // Simple SHA-256 (node crypto)
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(raw).digest("hex");
}
