#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const int SIZE = 301;
const int EDGE = 299;

int powerLevel(int x, int y, int serial) {
  int rackId = x + 10;
  int power = rackId * y;
  power += serial;
  power *= rackId;
  power = (power % 1000) / 100;
  power -= 5;
  return power;
}

int squareTotal(int x, int y, int grid[SIZE][SIZE]) {
  int total = 0;
  int m, n;
  for (m = 0; m < 3; m++) {
    for (n = 0; n < 3; n++) {
      total += grid[m+x][n+y];
    }
  }
  return total;
}

int main(int argc, char* argv[]) {
  int serial;
  if (argc > 1) {
    sscanf(argv[1], "%d", &serial);
  }
  int grid[SIZE][SIZE];
  int i, j;
  for (i = 1; i < SIZE; i++) {
    for (j = 1; j < SIZE; j++) {
      grid[i][j] = powerLevel(i, j, serial);
    }
  }
  int maxScore = -100;
  int maxx, maxy;
  int score;
  for (i = 1; i < EDGE; i++) {
    for (j = 1; j < EDGE; j++) {
      score = squareTotal(i, j, grid);
      if (score > maxScore) {
        maxScore = score;
        maxx = i;
        maxy = j;
      }
    }
  }
  printf("Largest 3x3 at (%d, %d) with %d\n", maxx, maxy, maxScore);
  return 0;
}