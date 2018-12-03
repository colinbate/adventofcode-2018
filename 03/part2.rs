use std::collections::HashMap;
use std::collections::HashSet;
use std::io;
use std::io::prelude::*;

fn parse(line: &str) -> (u32, u32, u32, u32, u32) {
  let tight = line.replace(" ", "").replace("#","");
  let parts: Vec<&str> = tight.split(|c| c == '@' || c == ',' || c == 'x' || c == ':').collect();
  (
    parts[1].parse::<u32>().unwrap(),
    parts[2].parse::<u32>().unwrap(),
    parts[3].parse::<u32>().unwrap(),
    parts[4].parse::<u32>().unwrap(),
    parts[0].parse::<u32>().unwrap()
  )
}

fn count_claim(claims: &mut Claims, x: u32, y: u32, id: u32) -> i32 {
  let mut c = 0;
  let next: i32;
  if let Some(clm) = claims.get(&(x, y)) {
    c = *clm;
    next = -1;
  } else {
    next = id as i32;
  }
  claims.insert((x, y), next);
  c
}
type Claims = HashMap<(u32,u32), i32>;
fn main() {
  //let list = vec!["#1 @ 1,3: 4x4", "#2 @ 3,1: 4x4", "#3 @ 5,5: 2x2"];
  let mut claims: Claims = HashMap::new();
  let mut candidates: HashSet<u32> = HashSet::new();
  let stdin = io::stdin();
  for line in stdin.lock().lines() {
    let (x, y, w, h, id) = parse(&line.unwrap());
    candidates.insert(id);
    for i in x..x+w {
      for j in y..y+h {
        let claim = count_claim(&mut claims, i, j, id);
        match claim {
          0 => false,
          -1 => candidates.remove(&id),
          x if x > 0 => {
            let rem = x as u32;
            candidates.remove(&rem);
            candidates.remove(&id)
          },
          _ => false,
        };
      }
    }
  }
  for candidate in candidates.iter() {
    println!("Candidate: {}", candidate);
  }
}