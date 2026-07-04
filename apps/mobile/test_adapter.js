const fetch = require("node-fetch");
const { mapHomeData } = require("./lib/adapters/homeAdapter");

async function main() {
  const res = await fetch("https://orcanime-api-edge.moehamadhkl.workers.dev/api/v2/home?v=4");
  const data = await res.json();
  const mapped = mapHomeData(data.data, "anime");
  console.log("Ongoing:", mapped.ongoing.length);
  console.log("Trending:", mapped.trending.length);
  console.log("vRow1:", mapped.vRow1.items.length);
}
main();
