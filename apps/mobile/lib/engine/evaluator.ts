import {
  executeFetchHtml,
  executeFetchApi,
  executeMapApiCalls,
} from "./steps/networkSteps";
import {
  executeExtractRegex,
  executeExtractRegexArray,
  executeDomIterate,
} from "./steps/parsingSteps";
import { executeDecryptAes } from "./steps/cryptoSteps";
import { executeMapSources, executeFilterSources } from "./steps/sourceSteps";

export interface PipelineStep {
  step: string;
  [key: string]: any;
}
export interface RuleConfig {
  domain: string;
  pipeline: PipelineStep[];
}

export class RuleEvaluator {
  private state: Record<string, any> = {};
  constructor(private initialVars: Record<string, any> = {}) {
    this.state = { ...initialVars };
  }

  async execute(pipeline: PipelineStep[]): Promise<any> {
    for (const stepConfig of pipeline) {
      const step = stepConfig.step;
      const outputKey = stepConfig.output;
      try {
        let result: any = null;
        switch (step) {
          case "fetch_html":
            result = await executeFetchHtml(stepConfig, this.state);
            break;
          case "fetch_api":
            result = await executeFetchApi(stepConfig, this.state);
            break;
          case "extract_regex":
            result = executeExtractRegex(stepConfig, this.state);
            break;
          case "decrypt_aes":
            result = executeDecryptAes(stepConfig, this.state);
            break;
          case "map_sources":
            return executeMapSources(stepConfig, this.state);
          case "dom_iterate":
            result = executeDomIterate(stepConfig, this.state);
            break;
          case "map_api_calls":
            result = await executeMapApiCalls(stepConfig, this.state);
            break;
          case "extract_regex_array":
            result = executeExtractRegexArray(stepConfig, this.state);
            break;
          case "filter_sources":
            return executeFilterSources(stepConfig, this.state);
          default:
            console.warn(`[RuleEvaluator] Unknown step type: ${step}`);
        }
        if (outputKey && result !== undefined) this.state[outputKey] = result;
      } catch (error) {
        console.error(`[RuleEvaluator] Error at step '${step}':`, error);
        throw error;
      }
    }
    return this.state;
  }
}
