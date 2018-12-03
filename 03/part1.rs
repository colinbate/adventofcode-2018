use std::collections::HashMap;
use std::io;
use std::io::prelude::*;

fn parse(line: &str) -> (u32, u32, u32, u32) {
  let tight = line.replace(" ", "").replace("#","");
  let parts: Vec<&str> = tight.split(|c| c == '@' || c == ',' || c == 'x' || c == ':').collect();
  (
    parts[1].parse::<u32>().unwrap(),
    parts[2].parse::<u32>().unwrap(),
    parts[3].parse::<u32>().unwrap(),
    parts[4].parse::<u32>().unwrap()
  )
}

fn count_claimed(claims: &mut Claims, x: u32, y: u32) -> bool {
  let mut c = 0;
  if let Some(cnt) = claims.get(&(x, y)) {
    c = *cnt;
  }
  claims.insert((x, y), c + 1);
  c == 1
}

type Claims = HashMap<(u32,u32), u32>;
fn main() {
  //let list = vec!["#1 @ 1,3: 4x4", "#2 @ 3,1: 4x4", "#3 @ 5,5: 2x2"];
  let mut count = 0;
  let mut claims: Claims = HashMap::new();
  let stdin = io::stdin();
  for line in stdin.lock().lines() {
    let (x, y, w, h) = parse(&line.unwrap());
    for i in x..x+w {
      for j in y..y+h {
        if count_claimed(&mut claims, i, j) {
          count += 1;
        }
      }
    }
  }
  println!("Multi-claimed: {}", count);
}