#include <stdio.h>
#include <stdlib.h>
#include <string.h>

const int NUM = 55;
//const int MAXTOTAL = 32;
const int MAXTOTAL = 10000;

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

int inRegion(int x, int y, int count, unsigned long pts[NUM]) {
  int k, ld, d = 0;
  int px, py;
  for (k = 1; k <= count; k++) {
    dxy(pts[k], &px, &py);
    ld = tcd(x, y, px, py);
    d = d + ld;
    if (d >= MAXTOTAL) {
      return 0;
    }
  }
  return 1;
}

int main() {
  char line[30];
  char *b = line;
  size_t bufsize = 30;
  ssize_t chars;
  int c = 0;
  int x, y;
  int minx = 1000, miny = 1000, maxx = 0, maxy = 0;
  int i, j;
  unsigned long pts[NUM];
  unsigned long region = 0;

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
      if (inRegion(i, j, c, pts)) {
        region++;
      }
    }
  }
  printf("Size of region = %lu\n", region);
}