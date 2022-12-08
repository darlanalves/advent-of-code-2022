import { readFile } from "fs/promises";

const crateMatcher = /(\s{3}|\[\S])\s?/g;

async function main() {
  const input = await readFile(process.argv[2] || "./input.txt", "utf8");
  const lines = input.split("\n");
  const divider = lines.indexOf("");

  const crateMap = createMap(lines.slice(0, divider - 1));
}

function createMap(lines) {
  const rows = lines.map((line) => line.match(crateMatcher));
  const map = [];

  console.log(map);

  return map;
}

main();
