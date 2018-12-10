import sys
if len(sys.argv) < 3:
  print("Usage: part1.py <players> <marbles>")
  sys.exit(0)

players = int(sys.argv[1])
maxmarbles = int(sys.argv[2])

marbles = range(1, maxmarbles + 1)
circle = [0]
current = 0
scores = [0] * players
player = 0

for m in marbles:
  if m % 23 == 0:
    scores[player] += m
    less = (current - 7) % len(circle)
    scores[player] += circle.pop(less)
    current = less
  else:
    into = (current + 2) % len(circle)
    if into == 0:
      circle.append(m)
      current = len(circle) - 1
    else:
      circle.insert(into, m)
      current = into
  player = (player + 1) % players

maxscore = max(scores)

for idx, s in enumerate(scores):
  print("Player", idx, "scored", s)

print("Max score:", maxscore)