const fetch = require("node-fetch");

async function main() {
  const url = "https://orcanime-api-edge.moehamadhkl.workers.dev/api/v2/home?v=4";
  const res = await fetch(url);
  const text = await res.text();
  const data = JSON.parse(text);
  console.log("Keys in data:", Object.keys(data));
  console.log("Keys in data.data:", data.data ? Object.keys(data.data) : "undefined");

  if (data.data) {
    const airing = data.data.airing || [];
    console.log("Airing length:", airing.length);
  }
}
main();
