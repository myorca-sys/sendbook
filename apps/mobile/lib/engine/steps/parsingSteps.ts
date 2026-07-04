import OrcaNativeCore from "../../../modules/orca-native-core/src";
import { resolveValue } from "./resolver";

export function executeExtractRegex(
  config: any,
  state: any,
): string | string[] | null {
  const input = resolveValue(config.input, state);
  const patternStr = resolveValue(config.pattern, state);
  if (!input || !patternStr) return null;

  const flagsMatch = patternStr.match(/^\/(.*)\/([gimsuy]*)$/);
  const regex = flagsMatch
    ? new RegExp(flagsMatch[1], flagsMatch[2])
    : new RegExp(patternStr);

  const match = input.match(regex);
  if (match) {
    if (regex.global) return match;
    return match.length > 1 ? match[1] : match[0];
  }
  return null;
}

export function executeExtractRegexArray(config: any, state: any): string[] {
  const inputs = resolveValue(config.input, state);
  const patternStr = resolveValue(config.pattern, state);
  if (!Array.isArray(inputs) || !patternStr) return [];

  const regex = new RegExp(patternStr);
  const results: string[] = [];

  inputs.forEach((input) => {
    if (typeof input !== "string") return;
    const match = input.match(regex);
    if (match && match[1]) results.push(match[1]);
  });
  return results;
}

export function executeDomIterate(config: any, state: any): any[] {
  const input = resolveValue(config.input, state);
  const selector = resolveValue(config.selector, state);
  const limit = resolveValue(config.limit, state) || 10;
  const extract = config.extract;

  if (!input || !selector || !extract) return [];

  try {
    // 🔥 Delegasikan beban ekstraksi Array ke C++ / Kotlin JSI (0ms Overhead, No GC Pause)
    return OrcaNativeCore?.parseDomList(input, selector, extract, limit) ?? [];
  } catch (e) {
    console.warn("[Native DOM Iterate] Failed:", e);
    return [];
  }
}
