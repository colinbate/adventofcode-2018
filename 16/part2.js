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

const allOpsSet = new Set(allOps);
const codes = [
  allOpsSet, allOpsSet, allOpsSet, allOpsSet,
  allOpsSet, allOpsSet, allOpsSet, allOpsSet,
  allOpsSet, allOpsSet, allOpsSet, allOpsSet,
  allOpsSet, allOpsSet, allOpsSet, allOpsSet,
];
const opCodes = Array(16).fill(false);

function intersection(setA, setB) {
  const _intersection = new Set();
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem);
      }
  }
  return _intersection;
}

function checkInstructions(pre, [code, a, b, c], post) {
  const matches = new Set();
  for (let op of allOps) {
    const reg = pre.slice();
    op(reg, a, b, c);
    if (regMatch(reg, post)) {
      matches.add(op);
    }
  }
  codes[code] = intersection(codes[code], matches);
}

function setCandidate(code, op) {
  for (let c = 0; c < codes.length; c++) {
    if (c !== code) {
      codes[c].delete(op);
    }
  }
  opCodes[code] = op;
}

let before;
let instruction;
let after;
let regmode = false;
const registers = [0, 0, 0, 0];
let testinst = 0;
rl.on('line', (input) => {
  if (input === '') {
    if (!before && !regmode) {
      while (opCodes.some(x => !x)) {
        for (let c = 0; c < codes.length; c++) {
          if (!opCodes[c]) {
            const ops = Array.from(codes[c].values());
            //console.log(`Code ${c} = ${ops.length} candidates: ${ops[0].name}`);
            if (ops.length === 1) {
              setCandidate(c, ops[0]);
            }
          }
        }
        //console.log('');
      }
      for (let c = 0; c < opCodes.length; c++) {
        console.log(`Code ${c} = ${opCodes[c].name}`);
      }
      regmode = true;
    }
    before = instruction = after = undefined;
  } else if (regmode) {
    const [opc, a, b, c] = input.split(' ').map(x => parseInt(x, 10));
    opCodes[opc](registers, a, b, c);
    testinst++;
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

rl.on('close', () => {
  console.log(`Registers: [${registers.join(', ')}] after ${testinst} instructions`);
});
