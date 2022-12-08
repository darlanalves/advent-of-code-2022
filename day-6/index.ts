import { readFile } from "fs/promises";

async function main() {
  let input = process.argv[2];

  if (!process.argv[2]) {
    input = await readFile("./input.txt", "utf8");
  }

  const startMarker = findMarker(input, 4);
  const startMessageMarker = findMarker(input, 14);

  printPosition("start marker", startMarker);
  printPosition("message marker", startMessageMarker);
}

function printPosition(name: string, position: number) {
  if (position >= 0) {
    console.log(`${name} found at`, position);
  } else {
    console.log(`${name} not found`);
  }
}

function findMarker(input: string, size: number) {
  let index = 0;

  while (1) {
    const chars = input.slice(index, index + size).split("");

    if (chars.length !== size) {
      return -1;
    }

    const set = new Set(chars);
    if (set.size === size) {
      return index + size;
    }

    index++;
  }
}

main();
