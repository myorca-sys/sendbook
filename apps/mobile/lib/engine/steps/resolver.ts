export function resolveValue(val: any, state: any): any {
  if (typeof val === "string") {
    return val.replace(/\{\{([\w.]+)\}\}/g, (_: string, path: string) => {
      const keys = path.split(".");
      let current = state;
      for (const k of keys) {
        if (current == null) return "";
        current = current[k];
      }
      return String(current !== undefined ? current : "");
    });
  }
  if (typeof val === "object" && val !== null) {
    const resolvedObj: any = Array.isArray(val) ? [] : {};
    for (const k in val) {
      resolvedObj[k] = resolveValue(val[k], state);
    }
    return resolvedObj;
  }
  return val;
}
