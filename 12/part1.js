let current = '.....##...#......##......#.####.##.#..#..####.#.######.##..#.####...##....#.#.####.####.#..#.######.##............................';
const transitions = new Set([
  '#..##',
  '...##',
  '.#...',
  '.##.#',
  '###.#',
  '#####',
  '##..#',
  '#.###',
  '.#..#',
  '.##..',
  '##...',
  '.#.#.',
  '.###.',
  '.####',
  '#.##.',
  '#...#',
]);
let sum = 0;
let gen = 0;
console.log('0: ' + current);
while (gen < 20) {
  sum = 0;
  const nextGen = [];
  const len = current.length;
  current = `..${current}..`;
  for (let i = 2; i < len + 2; i += 1) {
    const slice = current.substr(i - 2, 5);
    const potNum = i - 7;
    if (transitions.has(slice)) {
      sum += potNum;
      nextGen.push('#');
    } else {
      nextGen.push('.');
    }
  }
  const ngStr = nextGen.join('');
  gen++;
  console.log(`${gen}: ${ngStr}`);
  current = ngStr;
}

console.log(`Total on Gen 20: ${sum}`);
