const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
});

class Node {
  constructor(data, next = undefined, prev = undefined) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

class Queue {
  constructor() {
    this.first = undefined;
    this.last = undefined;
  }
  add(data) {
    const nn = new Node(data, this.first);
    if (this.first) {
      this.first.prev = nn;
    }
    this.first = nn;
    if (!this.last) {
      this.last = this.first;
    }
  }
  remove() {
    if (!this.last) {
      return undefined;
    }
    const last = this.last.data;
    this.last = this.last.prev;
    if (this.last) {
      this.last.next = undefined;
    } else {
      this.first = undefined;
    }
    return last;
  }
  peek() {
    return this.last && this.last.data;
  }
  isEmpty() {
    return !this.first;
  }
}

const deltas = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1]
];

class Player {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = 200;
    this.attack = type === 'E' ? 16 : 3;
  }

  toString() {
    return this.type;
  }

  get location() {
    return `${this.x},${this.y}`;
  }

  isEnemy(other) {
    return this.type !== other.type;
  }

  toFullInfo() {
    return `${this.type}(${this.hp}) @ (${this.x}, ${this.y})`;
  }

  toShortInfo() {
    return `${this.type}(${this.hp})`;
  }

  getAttackTarget(others) {
    let minhp = 210;
    let target = false;
    for (let d = 0; d < deltas.length; d += 1) {
      for (let other of others) {
        if (this.isEnemy(other) && this.x + deltas[d][0] === other.x && this.y + deltas[d][1] === other.y && other.hp < minhp) {
          target = other;
          minhp = other.hp;
        }
      }
    }
    return target;
  }
}

const players = [];
const map = [];
let row = 0;

function printMap(label) {
  const mlen = map.length;
  label && console.log(label);
  for (let j = 0; j < mlen; j += 1) {
    const rlen = map[j].length;
    const rowPlayers = [];
    for (let i = 0; i < rlen; i += 1) {
      process.stdout.write(map[j][i].toString());
      if (typeof map[j][i] !== 'string') {
        rowPlayers.push(map[j][i]);
      }
    }
    process.stdout.write('   ');
    process.stdout.write(rowPlayers.map(p => p.toShortInfo()).join(', '));
    process.stdout.write('\n');
  }
  process.stdout.write('\n');
}

function movePlayer(player, to) {
  map[player.y][player.x] = '.';
  player.x = to.x;
  player.y = to.y;
  map[player.y][player.x] = player;
}

function readingOrder(a, b) {
  return a.y - b.y || a.x - b.x;
}

function sortPlayers() {
  return players.sort(readingOrder).slice();
}

function isValidLocation([x, y]) {
  return y > 0 && y < map.length && x > 0 && x < map[y].length && map[y][x] === '.';
}

function surroundings(x, y) {
  const ret = [];
  for (let d = 0; d < deltas.length; d += 1) {
    ret.push([x + deltas[d][0], y + deltas[d][1]]);
  }
  return ret;
}

function shortestPaths(from, goals) {
  const debug = false; //from.x === 2 && from.y === 1;
  debug && console.log('  Finding shortest paths');
  const queue = new Queue();
  const visited = new Set([from.location]);
  const paths = [];
  queue.add({ x: from.x, y: from.y, path: [] });
  while (!queue.isEmpty()) {
    const current = queue.remove();
    for (let d = 0; d < deltas.length; d += 1) {
      const pt = [current.x + deltas[d][0], current.y + deltas[d][1]];
      const pts = pt.join(',');
      debug && console.log('    [sp] Checking ' + pts);
      if (goals.has(pts)) {
        debug && console.log('      [sp] Is a goal!')
        const goalPath = current.path.slice();
        goalPath.push(pt);
        if (paths.length && goalPath.length > paths[0].length) {
          return paths;
        } else {
          paths.push(goalPath);
        }
      }
      if (isValidLocation(pt) && !visited.has(pts)) {
        debug && console.log('      [sp] Is valid unvisited.')
        visited.add(pts);
        const path = current.path.slice();
        path.push(pt);
        queue.add({ x: pt[0], y: pt[1], path });
      }
    }
  }
  return paths;
}

function killPlayer(which) {
  map[which.y][which.x] = '.';
  const pIndex = players.findIndex(x => x === which);
  players.splice(pIndex, 1);
}

function attack(attacker, attackee) {
  attackee.hp -= attacker.attack;
  if (attackee.hp <= 0) {
    killPlayer(attackee);
  }
}

function addRow(y, line) {
  const locations = line.split('').map((t, x) => {
    if (t === 'G' || t === 'E') {
      const newPlayer = new Player(x, y, t);
      players.push(newPlayer);
      return newPlayer;
    }
    return t;
  });
  return locations;
}

rl.on('line', input => {
  map.push(addRow(row, input));
  row += 1;
});

const prounds = new Set([
  1, 2, 23, 24, 25, 26, 27, 28, 47, 48
]);

function run() {
  let round = 0;
  let done = false;
  let goals;
  console.log(`Read map ${map[0].length}x${map.length} with ${players.length} players`);
  //printMap('Initial');
  while (round < 1000 && !done) {
    const remPlayers = sortPlayers();
    //console.log(`Round ${round}: ${remPlayers.length} players`);
    while (remPlayers.length) {
      const current = remPlayers.shift();
      if (current.hp <= 0) continue;
      //console.log(' ' + current.toFullInfo());
      // Find all remaining enemies.
      const targets = players.filter(x => current.isEnemy(x));
      if (!targets.length) {
        done = true;
        break;
      };
      //console.log('  Target count: ' + targets.length);
      // Am I within range of enemy?
      const attackTarget = current.getAttackTarget(targets);
      if (attackTarget) {
        // Yes - Attack
        //console.log('  Attack ' + attackTarget.toFullInfo());
        attack(current, attackTarget);
      } else {
        // No - Move
        // Identify potential goal positions around enemies
        const goalList = targets.reduce((p, c) => p.concat(surroundings(c.x, c.y).filter(isValidLocation)), []);
        goals = new Set(goalList.map(p => `${p[0]},${p[1]}`));
        // console.log('  Found ' + goals.size + ' goal locations');
        // for (let gl of goals.values()) {
        //   console.log('    ' + gl);
        // }
        // If no goals, end turn.
        if (goals.size > 0) {
          // 3. Start breadth first search until a goal is found
          const bestPaths = shortestPaths(current, goals);
          //console.log('  Found ' + bestPaths.length + ' shortest paths');
          // 4. Pick best first step
          if (bestPaths.length) {
            const sortedSteps = bestPaths.map(p => ({ x: p[0][0], y: p[0][1] })).sort(readingOrder);
            //console.log('    ' + sortedSteps.map(p => `${p.x},${p.y}`).join('; '));
            // Make move
            movePlayer(current, sortedSteps[0]);
            //console.log('  Moved to (' + current.x + ', ' + current.y + ')');
            // Check if can attack now.
            const postMoveAttackTarget = current.getAttackTarget(targets);
            if (postMoveAttackTarget) {
              //console.log('  And now I can attack: ' + postMoveAttackTarget.toFullInfo());
              attack(current, postMoveAttackTarget);
            }
          }
        }
        
      }
    }
    round++;
    // if (prounds.has(round)) {
    //   printMap(`After ${round} rounds`);
    // }
  }
  round--;
  printMap(`After ${round} rounds`);
  const finalPlayers = sortPlayers();
  let remainingHp = 0;
  for (let fp of finalPlayers) {
    remainingHp += fp.hp;
  }
  console.log(`rounds (${round}) X hp (${remainingHp}) = ${round * remainingHp}`);
}

rl.on('close', run);