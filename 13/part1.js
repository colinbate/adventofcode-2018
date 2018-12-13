const readline = require('readline');
const LEFT = 0;
const STRAIGHT = 1;
const RIGHT = 2;
const rl = readline.createInterface({
  input: process.stdin
});
const map = [];
const carts = [];
let row = 0;

const replaceRegex = {
  '<': new RegExp('<', 'g'),
  '>': new RegExp('>', 'g'),
  '^': new RegExp('\\^', 'g'),
  'v': new RegExp('v', 'g'),
}

const replaceMap = {
  '<': '-',
  '>': '-',
  '^': '|',
  'v': '|',
}

function compareCart(a, b) {
  return a.y - b.y || a.x - b.x;
}

function sortCarts() {
  return carts.sort(compareCart).slice();
}

const curveMap = {
  '/': {
    '^': '>',
    '<': 'v',
    '>': '^',
    'v': '<'
  },
  '\\': {
    '^': '<',
    '<': '^',
    '>': 'v',
    'v': '>'
  }
};

const intersectionMap = {
  '^': ['<', '^', '>'],
  '<': ['v', '<', '^'],
  '>': ['^', '>', 'v'],
  'v': ['>', 'v', '<']
};

const deltas = {
  '^': [0, -1],
  '<': [-1, 0],
  '>': [1, 0],
  'v': [0, 1]
}

class Cart {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.nextTurn = 0;
  }

  move() {
    const [dx, dy] = deltas[this.dir];
    this.x += dx;
    this.y += dy;
    const track = map[this.y][this.x];
    if (track === '+') {
      this.dir = intersectionMap[this.dir][this.nextTurn];
      this.nextTurn = (this.nextTurn + 1) % 3;
    } else if (track in curveMap) {
      this.dir = curveMap[track][this.dir];
    } else if (track === ' ') {
      console.log(`Derailed! :(${this.x}, ${this.y}) ${this.dir}`);
    }
  }

  get location() {
    return `${this.x},${this.y}`;
  }
}

function addCartType(index, line, type) {
  let pos = line.indexOf(type);
  let found = false;
  while (pos !== -1) {
    found = true;
    carts.push(new Cart(pos, index, type));
    pos = line.indexOf(type, pos + 1);
  }
  return found ? line.replace(replaceRegex[type], replaceMap[type]) : line;
}

function addCarts(index, line) {
  line = addCartType(index, line, '>');
  line = addCartType(index, line, 'v');
  line = addCartType(index, line, '<');
  line = addCartType(index, line, '^');
  return line;
}

rl.on('line', input => {
  map.push(addCarts(row, input));
  row += 1;
});

function run() {
  console.log(`Found ${carts.length} carts`);
  // for (let r of map) {
  //   console.log(r);
  // }
  //console.log(map[101]);
  let iter = 0;
  let crashed = '';
  let plot;
  while (!crashed) {
    iter++;
    //if (iter > 160) console.log(`Iteration ${iter}`);
    const iterCarts = sortCarts();
    plot = new Set(iterCarts.map(c => c.location));
    while (iterCarts.length) {
      const cart = iterCarts.shift();
      //if (iter > 160) console.log('  ' + cart.location);
      plot.delete(cart.location);
      cart.move();
      if (plot.has(cart.location)) {
        crashed = cart.location;
        break;
      } else {
        plot.add(cart.location);
      }
    }
  }
  console.log(`Crashed on iteration ${iter} at ${crashed}`);
}

rl.on('close', run);