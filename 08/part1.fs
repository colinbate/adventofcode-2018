
module Part1
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

  let rec sumChildren nodes remaining =
    //printfn "  summing remaining %d" remaining
    let res = match remaining with
              | 0 -> 0
              | x -> 
                  let sum = sumMetadata nodes
                  let nextChildSum = sumChildren nodes (x - 1)
                  sum + nextChildSum
    //printfn "  sumChildren result: %d" res
    res
  and sumMetadata node =
    let kids = Seq.head node
    let meta = Seq.head node
    //printfn "Visiting node with %d kids and %d metadata" kids meta
    let kidSum = if kids = 0 then 0 else sumChildren node kids
    let metaSum = node |> (Seq.take meta) |> Seq.sum
    //printfn "  kid  sum: %d" kidSum
    //printfn "  meta sum: %d" metaSum
    let res = metaSum + kidSum
    //printfn "  sumMetadata result: %d" res
    res

  let run =
    let cc = readNums
    // printfn "Seq: %A" cc
    let total = cc |> sumMetadata
    printfn "Total: %d" total