#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
  char line[50005];
  char next[50005];
  char *b = line;
  size_t bufsize = 50005;
  ssize_t chars;
  int p = 0;
  ssize_t n = 0;
  int changes = 1;

  while ((chars = getline(&b, &bufsize, stdin)) >= 0) {
    //printf("Initial: %s\n", line);
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
    printf("Remaining length: %zd", chars);
  }
}