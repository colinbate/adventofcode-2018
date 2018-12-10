import sys
if len(sys.argv) < 3:
  print("Usage: part2.py <players> <marbles>")
  sys.exit(0)

players = int(sys.argv[1])
maxmarbles = int(sys.argv[2])

class Node:
  def __init__(self, data):
    "Constructor"
    self.data = data
    self.next = self
    self.prev = self
    return
  
  def insert_after(self, value):
    "Inserts a new node after the current one"
    newnode = Node(value)
    newnode.prev = self
    newnode.next = self.next
    self.next.prev = newnode
    self.next = newnode
    return newnode

  def move_back(self, num):
    "Iterate an arbitrary number of node backwards"
    i = 0
    ptr = self
    while i < num:
      ptr = ptr.prev
      i += 1
    return ptr

  def remove(self):
    "Remove self from the circle. Probably fails if too few nodes in circle."
    self.prev.next = self.next
    self.next.prev = self.prev
    return self.next

  def print_circle(self):
    print("{:>3d}".format(self.data), end='')
    ptr = self.next
    while ptr != self:
      print("{:>3d}".format(ptr.data), end='')
      ptr = ptr.next
    print()

circle = Node(0)
current = circle
scores = [0] * players
player = 0
m = 1

while m <= maxmarbles:
  if m % 23 == 0:
    scores[player] += m
    current = current.move_back(7)
    scores[player] += current.data
    current = current.remove()
  else:
    current = current.next
    current = current.insert_after(m)
  player = (player + 1) % players
  m += 1

maxscore = max(scores)
print("Max score:", maxscore)