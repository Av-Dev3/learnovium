export type GoalSignatureInput = {
  topic: string;
  focus?: string | null;
  level?: string | null;            // profile.level
  minutes_per_day?: number | null;  // profile.minutes_per_day
  locale?: string | null;           // profile.tz or 'en'
  version?: number | null;          // plan_version default 1
};

export async function canonicalizeSignature(i: GoalSignatureInput): Promise<string> {
  const topic = (i.topic ?? "").trim().toLowerCase();
  const focus = (i.focus ?? "").trim().toLowerCase();
  const level = (i.level ?? "").trim().toLowerCase();
  const minutes = String(i.minutes_per_day ?? 0);
  const locale = (i.locale ?? "en").trim().toLowerCase();
  const version = String(i.version ?? 1);
  const raw = [topic, focus, level, minutes, locale, version].join("|");
  
  // Use Web Crypto API for browser compatibility, fallback to Node.js crypto
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Node.js environment - use dynamic import
    const crypto = await import('crypto');
    return crypto.createHash("sha256").update(raw).digest("hex");
  }
}
