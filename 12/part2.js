let current = '.....##...#......##......#.####.##.#..#..####.#.######.##..#.####...##....#.#.####.####.#..#.######.##.....';
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
let start = -5;
let prev = '';
while (current !== prev) {
  sum = 0;
  const nextGen = [];
  const len = current.length;
  prev = current;
  current = `..${current}..`;
  for (let i = 2; i < len + 2; i += 1) {
    const slice = current.substr(i - 2, 5);
    const potNum = i + start - 2;
    if (transitions.has(slice)) {
      sum += potNum;
      nextGen.push('#');
    } else {
      nextGen.push('.');
    }
  }
  const ngStr = nextGen.join('');
  gen++;
  const firstPlant = ngStr.indexOf('#');
  current = ngStr;
  if (firstPlant < 5) {
    current = '.'.repeat(5 - firstPlant) + current;
  } else {
    current = current.substr(firstPlant - 5);
  }
  start = start - 5 + firstPlant;
  const lastPlant = current.lastIndexOf('#');
  if (lastPlant > current.length - 6) {
    current = current + '.'.repeat(6 - (current.length - lastPlant))
  } else {
    current = current.substring(0, lastPlant + 6);
  }
  //console.log(`${gen}: ${start}: ${current}`);
}

start = 50000000000 - 51;
sum = 0;
for (let i = 0; i < current.length; i += 1) {
  if (current[i] === '#') {
    sum += start + i;
  }
}

console.log(`Total on Gen 50,000,000,000: ${sum}`);
