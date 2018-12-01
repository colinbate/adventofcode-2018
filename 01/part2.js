const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const deltas = [];
const recorded = new Set();
let current = 0;

function changeFreq(delta) {
  current += delta;
  if (recorded.has(current)) {
    console.log(`Seen twice: ${current}`);
    process.exit();
  } else {
    recorded.add(current);
  }
}

rl.on('line', input => {
  const delta = parseInt(input, 10);
  changeFreq(delta);
  deltas.push(delta);
});

rl.on('close', () => {
  while (true) {
    console.log('Trying again...');
    for (let delta of deltas) {
      changeFreq(delta);
    }
  }
});
