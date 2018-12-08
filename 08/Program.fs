// Learn more about F# at http://fsharp.org
module Day08
  open System
  open Part1
  open Part2

  [<EntryPoint>]
  let main argv =
    if argv.[0] = "1" then
      Part1.run
    elif argv.[0] = "2" then
      Part2.run
    0 // return an integer exit code
