const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

function addr(reg, a, b, c) {
  reg[c] = reg[a] + reg[b];
}

function addi(reg, a, b, c) {
  reg[c] = reg[a] + b;
}

function mulr(reg, a, b, c) {
  reg[c] = reg[a] * reg[b];
}

function muli(reg, a, b, c) {
  reg[c] = reg[a] * b;
}

function banr(reg, a, b, c) {
  reg[c] = reg[a] & reg[b];
}

function bani(reg, a, b, c) {
  reg[c] = reg[a] & b;
}

function borr(reg, a, b, c) {
  reg[c] = reg[a] | reg[b];
}

function bori(reg, a, b, c) {
  reg[c] = reg[a] | b;
}

function setr(reg, a, b, c) {
  reg[c] = reg[a];
}

function seti(reg, a, b, c) {
  reg[c] = a;
}

function gtir(reg, a, b, c) {
  reg[c] = a > reg[b] ? 1 : 0;
}

function gtri(reg, a, b, c) {
  reg[c] = reg[a] > b ? 1 : 0;
}

function gtrr(reg, a, b, c) {
  reg[c] = reg[a] > reg[b] ? 1 : 0;
}

function eqir(reg, a, b, c) {
  reg[c] = a === reg[b] ? 1 : 0;
}

function eqri(reg, a, b, c) {
  reg[c] = reg[a] === b ? 1 : 0;
}

function eqrr(reg, a, b, c) {
  reg[c] = reg[a] === reg[b] ? 1 : 0;
}

function regMatch(rega, regb) {
  return rega[0] === regb[0] &&
         rega[1] === regb[1] &&
         rega[2] === regb[2] &&
         rega[3] === regb[3];
}

const allOps = [
  addr, addi,
  mulr, muli,
  banr, bani,
  borr, bori,
  setr, seti,
  gtir, gtri, gtrr,
  eqir, eqri, eqrr
]
let threeOrMore = 0;
function checkInstructions(pre, [, a, b, c], post) {
  let matches = 0;
  for (let op of allOps) {
    const reg = pre.slice();
    op(reg, a, b, c);
    if (regMatch(reg, post)) {
      matches++;
    }
  }
  if (matches >= 3) {
    threeOrMore++;
  }
}

let before;
let instruction;
let after;
rl.on('line', (input) => {
  if (input === '') {
    if (!before) {
      console.log(`Found ${threeOrMore} samples which match three or more opcodes`);
      process.exit(0);
    }
    before = instruction = after = undefined;
  } else if (!before) {
    const regstr = input.substr(9, 10);
    before = regstr.split(', ').map(x => parseInt(x, 10));
  } else if (!instruction) {
    instruction = input.split(' ').map(x => parseInt(x, 10));
  } else if (!after) {
    after = input.substr(9, 10).split(', ').map(x => parseInt(x, 10));
    checkInstructions(before, instruction, after);
  }
});
