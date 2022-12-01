function v1(input) {
  const lines = input.trim().split('\n');
  const groups = {};
  const sums = {};
  let group = 0;
  let largestCount = 0;
  let largestCountGroup = 0;

  lines.forEach(line => {
    if (line.trim() === '') {
      sums[group] = groups[group].reduce((a, i) => a + i, 0);
      group++;
      return;
    }

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(Number(line.trim()));
  });

  while(group) {
    if (sums[group] > largestCount) {
      largestCount = sums[group];
      largestCountGroup = group;
    }

    group--;
  }

  console.log(largestCount, largestCountGroup);
}