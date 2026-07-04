import { resolveSamehadaku } from "./resolvers/samehadaku";
import { resolveKuronime } from "./resolvers/kuronime";

export class ClientResolver {
  static async resolve(provider: string, data: any[]): Promise<any[]> {
    if (!data || data.length === 0) return data;

    if (provider === "samehadaku") {
      return await resolveSamehadaku(data);
    }

    if (provider === "kuronime") {
      return await resolveKuronime(data);
    }

    return data;
  }
}
