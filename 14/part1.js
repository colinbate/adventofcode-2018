const goal = process.argv[2] && parseInt(process.argv[2], 10);

const scoreboard = [3, 7];
let elf1 = 0;
let elf2 = 1;

while (scoreboard.length < goal + 10) {
  const sum = scoreboard[elf1] + scoreboard[elf2];
  if (sum < 10) {
    scoreboard.push(sum);
  } else {
    scoreboard.push(Math.floor(sum / 10));
    scoreboard.push(sum % 10);
  }
  elf1 = (elf1 + 1 + scoreboard[elf1]) % scoreboard.length;
  elf2 = (elf2 + 1 + scoreboard[elf2]) % scoreboard.length;
}

const result = scoreboard.slice(goal, goal + 10).join('');
console.log(result);