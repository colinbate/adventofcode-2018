const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let total = 0;
rl.on('line', input => {
  total += parseInt(input, 10);
});

rl.on('close', () => {
  console.log(`Total: ${total}`);
});