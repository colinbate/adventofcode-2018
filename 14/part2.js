const goal = process.argv[2].split('').map(x => parseInt(x, 10));

const scoreboard = [3, 7];
let elf1 = 0;
let elf2 = 1;
let done = false;

function isDone() {
  if (scoreboard.length < goal.length) return false;
  const start = scoreboard.length - goal.length;
  for (let i = 0; i < goal.length; i += 1) {
    if (goal[i] !== scoreboard[start + i]) {
      return false;
    }
  }
  return scoreboard.length - goal.length;
}

while (!done) {
  const sum = scoreboard[elf1] + scoreboard[elf2];
  if (sum < 10) {
    scoreboard.push(sum);
  } else {
    scoreboard.push(Math.floor(sum / 10));
    done = isDone();
    scoreboard.push(sum % 10);
  }
  elf1 = (elf1 + 1 + scoreboard[elf1]) % scoreboard.length;
  elf2 = (elf2 + 1 + scoreboard[elf2]) % scoreboard.length;
  if (!done) done = isDone();
}

console.log(done);
