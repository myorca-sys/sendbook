import * as cheerio from "cheerio";
import { dreas } from "../../schemas/dreas_pb";

export class DreasEdgeEngine {
  static async execute(
    manifest: dreas.DREASManifest,
    endpointKey: string,
    html: string,
  ): Promise<any[]> {
    if (!manifest || !manifest.rules) {
      throw new Error("Invalid manifest");
    }

    const rule = manifest.rules[endpointKey];
    if (!rule) {
      throw new Error(
        `Rule for endpoint '${endpointKey}' not found in manifest`,
      );
    }

    const $ = cheerio.load(html);
    const results: any[] = [];

    // Find containers
    const containerSelector = rule.container || "";
    const container = containerSelector ? $(containerSelector) : $.root();

    let count = 0;
    const limit = rule.limit || 0;

    container.each((_, el) => {
      if (limit > 0 && count >= limit) return;

      const item: Record<string, string> = {};
      let isValid = false;

      for (const [key, field] of Object.entries(rule.fields || {})) {
        if (!field) continue;

        const targetEl = field.selector ? $(el).find(field.selector) : $(el);
        let val = "";

        if (field.action === "attr" && field.target) {
          val = targetEl.attr(field.target) || "";
        } else if (field.action === "html") {
          val = targetEl.html() || "";
        } else {
          val = targetEl.text() || "";
        }

        // Apply regex if present
        if (field.regex) {
          try {
            const match = val.match(new RegExp(field.regex, "s"));
            if (match) {
              const group = field.regexGroup || 1;
              val = match[group] || val;
            } else {
              val = ""; // Failed regex means empty
            }
          } catch (e) {
            val = "";
          }
        }

        const finalVal = val.trim().replace(/\s+/g, " ");
        item[key] = finalVal;

        if (finalVal !== "") {
          isValid = true;
        }
      }

      if (isValid) {
        results.push(item);
        count++;
      }
    });

    return results;
  }
}
