import { readFile } from "fs/promises";

const sizeLimit = 100_000;
const requiredSpace = 30_000_000;
const diskSize = 70_000_000;

async function readInput() {
  const text = await readFile(process.argv[2] || "./input.txt", "utf8");
  return text.split("\n");
}

const root = { name: "ROOT", size: 0, children: [] };

async function readDisk() {
  const lines = await readInput();
  const stack: any[] = [root];

  const changeDirectory = (next: string) => {
    switch (next) {
      case "..":
        stack.pop();
        break;
      case "/":
        stack.length = 1;
        break;
      default:
        const cwd = stack[stack.length - 1];
        const dir = { name: next, size: 0, children: [] };
        cwd.children.push(dir);
        stack.push(dir);
    }
  };

  const cd = "$ cd";
  const ls = "$ ls";

  for (const line of lines) {
    if (line.startsWith("dir ") || line === ls) {
      continue;
    }

    if (line.startsWith(cd)) {
      changeDirectory(line.slice(5));
      continue;
    }

    const size = Number(line.split(" ")[0]);
    stack[stack.length - 1].size += size;
  }
}

const addSizes = (node = root) => {
  if (node.children.length) {
    for (const child of node.children) {
      node.size += addSizes(child);
    }
  }

  return node.size;
};

const findSmallDirectories = (node = root, nodes = []) => {
  if (node.size < sizeLimit) {
    nodes.push({ name: node.name, size: node.size });
  }

  node.children.forEach((child) => findSmallDirectories(child, nodes));

  return nodes;
};

const findLargeDirectories = (minimumSize, node = root, nodes = []) => {
  if (node.size >= minimumSize) {
    nodes.push({ name: node.name, size: node.size });
  }

  node.children.forEach((child) =>
    findLargeDirectories(minimumSize, child, nodes)
  );

  return nodes;
};

readDisk().then(() => {
  addSizes();
  const smallDirectories = findSmallDirectories();
  const sum = smallDirectories.reduce((sum, next) => (next.size += sum), 0);
  console.log("sum of small dirs", sum);

  const unused = diskSize - root.size;
  console.log("root size", root.size);
  console.log("unused size", unused);
  console.log("required additional size", requiredSpace - unused);

  const candidates = findLargeDirectories(requiredSpace - unused);
  candidates.sort((a, b) => (a.size > b.size ? 1 : -1));

  console.log("we should remove", candidates[0]);
}, console.error);
