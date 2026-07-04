import OrcaNativeCore from "../../../modules/orca-native-core/src";

// We drop HTMLElement completely and rely on Native Parser

export function getTextAdvanced(htmlInput: string, selector: string): string {
  if (!selector) return "";
  return OrcaNativeCore?.parseDomTextAdvanced(htmlInput, selector) ?? "";
}

export function getText(htmlInput: string, selector: string): string {
  if (!selector) return "";
  // getText is largely identical to getTextAdvanced in our Native Module which combines both logic
  return OrcaNativeCore?.parseDomTextAdvanced(htmlInput, selector) ?? "";
}

export function generateId(sourceId: string, url: string): string {
  return `${sourceId}|${encodeURIComponent(url)}`;
}

export function getHighResImageUrl(url: string): string {
  if (!url) return url;
  return url.replace(/-\d+x\d+(\.[a-zA-Z0-9]+(?:\?.*)?)$/i, "$1");
}

export function stringSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase(),
    b = s2.toLowerCase();
  if (a === b) return 1.0;
  if (a.includes(b) || b.includes(a)) return 0.8;
  const wordsA = a.split(/\s+/),
    wordsB = b.split(/\s+/);
  const intersection = wordsA.filter((w) => wordsB.includes(w));
  return intersection.length / Math.max(wordsA.length, wordsB.length);
}
