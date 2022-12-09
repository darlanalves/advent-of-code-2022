import { readFile } from "fs/promises";

type Crate = { crate: string };
type CrateMap = Array<Array<Crate>>;

const empty = "---";

async function main() {
  const input = await readFile(process.argv[2] || "./input.txt", "utf8");
  const lines = input.split("\n");
  const divider = lines.indexOf("");
  const crates = lines.slice(0, divider - 1);
  const instructions = lines.slice(divider + 1);
  const map = createMap(crates);

  viewMap(map);
  followInstructions(instructions, map);
  viewMap(map);
}

function followInstructions(instructions: string[], map: CrateMap) {
  const matcher = /move (\d+) from (\d+) to (\d+)/;
  const locate = locateInMap(map);
  const locateEmpty = locateEmptyLayerInMap(map);

  for (const instruction of instructions) {
    const matches = Array.from(instruction.match(matcher));
    const [_, __, from, to] = matches;
    let amount = Number(matches[1]);

    while (amount) {
      const crate = locate(Number(from));
      const emptyLayer = locateEmpty(Number(to));

      moveCrate(crate, emptyLayer);
      amount--;
    }
  }
}

function createMap(crates: string[]): CrateMap {
  const crateMatcher = /(\s{3}|\[\S])\s?/g;
  const rows = crates.map((line: string) =>
    Array.from(line.match(crateMatcher))
  );

  const width = rows.reduce((max, row) => Math.max(row.length, max), 0);
  const padding = Array(width).fill(empty);

  const matrix = rows.map((row) => {
    const newRow = [...row, ...padding].slice(0, width);
    return newRow.map((cell) => ({ crate: cell.trim() || empty }));
  });

  return matrix;
}

function viewMap(map: CrateMap) {
  console.log("");
  console.log(map.map((row) => row.map((o) => o.crate).join(" ")).join("\n"));
}

function moveCrate(from: Crate, to: Crate) {
  to.crate = from.crate;
  from.crate = empty;
}

function locateInMap(map: CrateMap) {
  return (column: number) => {
    column--;
    for (const row of map) {
      if (row[column].crate !== empty) {
        return row[column];
      }
    }
  };
}

function locateEmptyLayerInMap(map: CrateMap) {
  return (column: number) => {
    column--;

    for (const [layer, row] of map.entries()) {
      const cellIsEmpty = row[column].crate === empty;
      const isLastRow = layer === map.length - 1;

      if (cellIsEmpty && isLastRow) {
        return map[map.length - 1][column];
      }

      if (cellIsEmpty) {
        continue;
      }

      const isOutOfBounds = layer === 0;

      if (isOutOfBounds) {
        const emptyRow = Array(map[0].length)
          .fill(null)
          .map(() => ({
            crate: empty,
          }));

        map.unshift(emptyRow);
        return map[0][column];
      }

      return map[layer - 1][column];
    }
  };
}

main();
