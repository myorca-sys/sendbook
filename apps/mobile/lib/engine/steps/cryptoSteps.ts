import crypto from "react-native-quick-crypto";
import { resolveValue } from "./resolver";

function evpBytesToKey(
  password: string,
  salt: Buffer,
  keyLen: number,
  ivLen: number,
) {
  let d = Buffer.alloc(0);
  let d_i = Buffer.alloc(0);
  const passBuf = Buffer.from(password, "utf8");
  while (d.length < keyLen + ivLen) {
    const hash = crypto.createHash("md5");
    hash.update(d_i);
    hash.update(passBuf);
    hash.update(salt);
    d_i = hash.digest() as any;
    d = Buffer.concat([d, d_i]);
  }
  return {
    key: d.subarray(0, keyLen),
    iv: d.subarray(keyLen, keyLen + ivLen),
  };
}

export function executeDecryptAes(config: any, state: any): any {
  const input = resolveValue(config.input, state);
  const keyStr = resolveValue(config.key, state);
  if (!input || !keyStr) return null;

  try {
    let dataStr = input;
    if (!input.includes("{")) {
      dataStr = Buffer.from(input, "base64").toString("utf8");
    }
    const data = JSON.parse(dataStr);

    const ct = data.ct;
    const salt = Buffer.from(data.s, "hex");

    // CryptoJS keySize: 8 (words, 8*4=32 bytes for AES-256), ivSize: 4 (words, 4*4=16 bytes)
    const { key, iv } = evpBytesToKey(keyStr, salt, 32, 16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(ct, "base64", "utf8");
    decrypted += decipher.final("utf8");

    if (decrypted.startsWith("{") || decrypted.startsWith("[")) {
      return JSON.parse(decrypted);
    }
    return decrypted;
  } catch (e) {
    console.warn("[RuleEvaluator] AES Decryption failed", e);
    return null;
  }
}
