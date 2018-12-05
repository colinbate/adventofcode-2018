#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
  char initial[50005];
  char line[50005];
  char next[50005];
  char *b = initial;
  size_t bufsize = 50005;
  ssize_t chars;
  ssize_t initialChars;
  int p = 0;
  ssize_t n = 0;
  int changes = 0;
  ssize_t best = 50005;
  char unit;

  while ((chars = getline(&b, &bufsize, stdin)) >= 0) {
    initialChars = chars;
    //printf("Initial: %s\n", initial);
    for (unit = 'A'; unit <= 'Z'; unit += 1) {
      chars = initialChars;
      strcpy(line, initial);
      //printf("Strip  : %c\n", unit);
      changes = 0;
      p = 0;
      n = 0;
      next[0] = 0;
      while (p <= chars) {
        //printf("%c - %c = %d\n", line[p], line[p+1], (line[p] - line[p+1]));
        if (line[p] != unit && line[p] != (unit + 32)) {
          next[n] = line[p];
          p += 1;
          n += 1;
        } else {
          changes += 1;
          p += 1;
        }
      }
      //printf("Removed: %s\n", next);
      strcpy(line, next);
      chars = n - 1;
      if (changes == 0) {
        break;
      }
      while (changes > 0) {
        p = 0;
        n = 0;
        changes = 0;
        next[0] = 0;
        while (p <= chars) {
          //printf("%c - %c = %d\n", line[p], line[p+1], (line[p] - line[p+1]));
          if (abs(line[p] - line[p+1]) != 32) {
            next[n] = line[p];
            p += 1;
            n += 1;
          } else {
            changes += 1;
            p += 2;
          }
        }
        //printf("Next   : %s\n", next);
        strcpy(line, next);
        chars = n - 1;
      }
      //printf("Remaining length: %zd\n", chars);
      if (chars < best) {
        best = chars;
        //printf("Best so far: %zd\n", best);
      }
    }
    printf("Best overall: %zd\n", best);
  }
}