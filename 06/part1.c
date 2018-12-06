#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const int NUM = 55;

int tcd(int ax, int ay, int bx, int by) {
  return abs(ax - bx) + abs(ay - by);
}

unsigned long xy(int x, int y) {
  return (x<<10) | y;
}

void dxy(unsigned long e, int* x, int* y) {
  *x = (e >> 10) & 511;
  *y = e & 511;
}

int getClosest(int x, int y, int count, unsigned long pts[NUM]) {
  int mintc = 3000;
  int minid = 0;
  int tie = 0;
  int k, d;
  int px, py;
  for (k = 1; k <= count; k++) {
    dxy(pts[k], &px, &py);
    d = tcd(x, y, px, py);
    if (d == 0) {
      return k;
    }
    if (d == mintc) {
      tie = 1;
    } else if (d < mintc) {
      mintc = d;
      tie = 0;
      minid = k;
    }
  }
  return tie ? 0 : minid;
}

int main() {
  char line[30];
  char *b = line;
  size_t bufsize = 30;
  ssize_t chars;
  int c = 0;
  int x, y, best;
  int minx = 1000, miny = 1000, maxx = 0, maxy = 0;
  int i, j, k;
  unsigned long pts[NUM];
  unsigned long count[NUM];
  unsigned long biggest = 0;
  int finite[NUM];

  while ((chars = getline(&b, &bufsize, stdin)) >= 0) {
    c++;
    sscanf(line, "%d, %d", &x, &y);
    pts[c] = xy(x, y);
    if (minx > x) { minx = x; }
    if (maxx < x) { maxx = x; }
    if (miny > y) { miny = y; }
    if (maxy < y) { maxy = y; }
  }
  printf("Found %d points\n", c);
  printf("Bounding box: (%d, %d) -> (%d, %d)\n", minx, miny, maxx, maxy);

  for (j = miny; j <= maxy; j += 1) {
    for (i = minx; i <= maxx; i += 1) {
      best = getClosest(i, j, c, pts);
      if (best > 0) {
        count[best] += 1;
      }
      if (i == minx || i == maxx || j == miny || j == maxy) {
        // Edge
        finite[best] = -1;
      }
    }
  }

  for (k = 1; k <= c; k++) {
    if (count[k] > biggest && finite[k] == 0) {
      biggest = count[k];
    }
    printf("%d => %lu (%d)\n", k, count[k], finite[k]);
  }
  printf("Maybe biggest = %lu\n", biggest);
}