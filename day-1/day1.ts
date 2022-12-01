import input from "./day1-input";

function v2(input: string) {
  const lines = input.trim().split("\n");
  const groups: Record<number, number[]> = {};
  const sums: Record<number, number> = {};
  let group = 0;
  let sum = 0;

  lines.forEach((line) => {
    if (line.trim() === "") {
      sums[group] = groups[group].reduce((a, i) => a + i, 0);
      group++;
      return;
    }

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(Number(line.trim()));
  });

  const top3 = Object.entries(sums)
    .sort((a, b) => (a[1] < b[1] ? 1 : -1))
    .map((a) => a[1])
    .slice(0, 3);

  console.log(top3, top3[0] + top3[1] + top3[2]);
}

function v1(input: string) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => (line.trim() !== "" ? Number(line) : ""));
  let largest = 0;
  let largestId = 0;
  let currentId = 0;
  let current = 0;

  lines.forEach((line) => {
    if (line === "") {
      current = 0;
      currentId++;
      return;
    }

    current += line;
    if (largest < current) {
      largest = current;
      largestId = currentId;
    }
  });

  console.log(largest, largestId);
}

v1(input);
v2(input);
