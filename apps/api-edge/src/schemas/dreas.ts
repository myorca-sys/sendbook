export interface DREASRuleField {
  selector: string;
  action: "text" | "attr" | "html";
  target?: string;
  regex?: string;
  regex_group?: number;
}

export interface DREASRuleEndpoint {
  container?: string;
  limit?: number;
  fields: Record<string, DREASRuleField | string>;
}

export interface DREASExecutionConfig {
  anti_bot_strategy: "http" | "webview_headless";
  wait_for_element?: string;
  timeout_ms?: number;
  user_agent_spoof?: boolean;
}

export interface DREASManifest {
  provider_id: string;
  rule_version: string;
  min_core_version: string;
  execution_config: DREASExecutionConfig;
  rules: Record<string, DREASRuleEndpoint>;
}
