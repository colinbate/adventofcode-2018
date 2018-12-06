$c = 0
$minX = 1000
$minY = 1000
$maxX = 0
$maxY = 0
[int32[]]$pts = @(0..55)
[int32[]]$count = @(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)
[int32[]]$finite = @(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)

function tcd($ax, $ay, $bx, $by) {
  [math]::abs($ax - $bx) + [math]::abs($ay - $by)
}

function xy([int32]$x, [int32]$y) {
  [int32](($x -shl 10) -bor $y)
}

function dxy([int32]$e) {
  $x = ($e -shr 10) -band 511
  $y = $e -band 511
  $x, $y
}

function getClosest($x, $y) {
  $mintc = 3000
  $minpt = 0
  $tie = $false
  for ($k = 1; $k -le $c; $k += 1) {
    $px, $py = dxy($pts[$k])
    $d = tcd $x $y $px $py
    if ($d -eq 0) {
      return $k
    }
    if ($d -eq $mintc) {
      $tie = $true
    } elseif ($d -lt $mintc) {
      $mintc = $d
      $tie = $false
      $minpt = $k
    }
  }
  if ($tie) { 0 } else { $minpt }
}

while (($line = Read-Host -pv out).Length -gt 0) {
  $c++
  $pt= $line -split ", "
  $pts[$c] = xy $pt[0] $pt[1]
  #$pts.Add($line, $c)
  if ($minX -gt $pt[0]) { $minX = [int]$pt[0] }
  if ($maxX -lt $pt[0]) { $maxX = [int]$pt[0] }
  if ($minY -gt $pt[1]) { $minY = [int]$pt[1] }
  if ($maxY -lt $pt[1]) { $maxY = [int]$pt[1] }
}
Write-Host "`nFound $c points"
Write-Host "Bounding box = ($minX, $minY) -> ($maxX, $maxY)"

for ($j = $minY; $j -le $maxY; $j += 1) {
  for ($i = $minX; $i -le $maxX; $i += 1) {
    $best = getClosest $i $j
    if ($best -gt 0) {
      $count[$best] += 1;
    }
    if ($i -eq $minX -or $i -eq $maxX -or $j -eq $minY -or $j -eq $maxY) {
      $finite[$best] = -1
    }
  }
}

Write-Host "Done"
$biggest = 0
for ($k = 1; $k -le $c; $k++) {
  if (($count[$k] -gt $biggest) -and ($finite[$k] -eq 0)) {
    $biggest = $count[$k]
  }
  Write-Host "$k => $($count[$k]) ($($finite[$k]))"
}
Write-Host "Maybe biggest = $biggest"
