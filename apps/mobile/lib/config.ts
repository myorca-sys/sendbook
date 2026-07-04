let _hfApiUrl = process.env.EXPO_PUBLIC_HF_API_URL || "https://orcanime-orcanime-api-rust.hf.space";
if (_hfApiUrl.includes("data-compute-v4")) {
  _hfApiUrl = "https://orcanime-orcanime-api-rust.hf.space";
}

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://orcanime-api-edge.moehamadhkl.workers.dev";

export const HF_API_URL = _hfApiUrl;
