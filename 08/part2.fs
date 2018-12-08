
module Part2
  open System

  type BufferState =
    | Value of int
    | Partial of int
    | Empty

  let toNum x = x - 48

  let scanner state next =
    match next with
    | 32 | -1 -> match state with
                 | Value _ -> Empty
                 | Partial x -> Value x
                 | Empty -> Empty
    | x when x >= 48 && x <= 57 ->
            match state with
            | Value _ -> Partial (toNum x)
            | Partial y -> Partial (y * 10 + (toNum x))
            | Empty -> Partial (toNum x)
    | _ -> state

  let onlyValues state =
    match state with
    | Value x -> Some x
    | Partial _ -> None
    | Empty -> None

  let readNums =
    Seq.initInfinite (fun _ -> Console.Read())
    |> Seq.scan scanner Empty
    |> Seq.choose onlyValues

  let oneBasedValueOrZero arr i =
    if i > Array.length arr || i <= 0 then
      0
    else
      arr.[i-1]

  let rec getChildValues nodes remaining =
    let res = match remaining with
              | 0 -> Seq.empty
              | x -> 
                  let value = getValue nodes
                  let nextValue = getChildValues nodes (x - 1)
                  Seq.append value nextValue
    res
  and getValue node =
    let kids = Seq.head node
    let meta = Seq.head node
    if kids = 0 then
      let metaVals = node |> Seq.take meta
      metaVals |> Seq.sum
               |> Seq.singleton
    else
      let childValues = getChildValues node kids |> Seq.toArray
      let values = node 
                  |> Seq.take meta
                  |> Seq.map (oneBasedValueOrZero childValues)
      values |> Seq.sum
             |> Seq.singleton

  let run =
    let cc = readNums
    // printfn "Seq: %A" cc
    let total = cc |> getValue
    printfn "Total: %A" total