<?php
class Point {
  public $x = 0;
  public $y = 0;
  private $vx = 0;
  private $vy = 0;

  public function __construct($x, $y, $vx, $vy) {
    $this->x = $x;
    $this->y = $y;
    $this->vx = $vx;
    $this->vy = $vy;
  }

  public function move() {
    $this->x += $this->vx;
    $this->y += $this->vy;
  }

  public function moveBack() {
    $this->x -= $this->vx;
    $this->y -= $this->vy;
  }
}

function getBoundingBox($pts, $s = false) {
  $minx = NULL;
  $maxx = NULL;
  $miny = NULL;
  $maxy = NULL;
  foreach ($pts as $pt) {
    if ($minx === NULL || ($pt->x) < $minx) {
      $minx = $pt->x;
    }
    if ($maxx === NULL || ($pt->x) > $maxx) {
      $maxx = $pt->x;
    }
    if ($miny === NULL || ($pt->y) < $miny) {
      $miny = $pt->y;
    }
    if ($maxy === NULL || ($pt->y) > $maxy) {
      $maxy = $pt->y;
    }
    if ($s) {
      $pt->move();
    }
  }
  return array($minx, $miny, $maxx, $maxy);
}

function getGrid($bounding, $pts) {
  $grid = array();
  for ($g = $bounding[0]; $g <= $bounding[2]; $g += 1) {
    $grid[$g] = array();
  }
  foreach ($pts as $pt) {
    $grid[$pt->x][$pt->y] = true;
  }
  return $grid;
}

function moveBack($pts) {
  foreach ($pts as $pt) {
    $pt->moveBack();
  }
}

$points = array();
while ($f = fgets(STDIN)) {
  $m = preg_match('/position=<([-\s\d]+), ([-\s\d]+)> velocity=<([-\s\d]+), ([-\s\d]+)>/', $f, $match);
  $px = (int)$match[1];
  $py = (int)$match[2];
  $vx = (int)$match[3];
  $vy = (int)$match[4];
  $points[] = new Point($px, $py, $vx, $vy);
}

$s = 0;
$stop = false;
$prev = NULL;
$prevBb = NULL;
while ($s < 50000 && !$stop) {
  $bb = getBoundingBox($points, true);
  $dx = $bb[2] - $bb[0];
  $dy = $bb[3] - $bb[1];
  $area = $dx * $dy;
  if ($prev === NULL || $prev > $area) {
    $prev = $area;
    $prevBb = $bb;
  } else {
    $win = $s - 1;
    echo "We may have a winner s = $win\n";
    $stop = true;
  }
  if ($stop) {
    moveBack($points);
    moveBack($points);
    $grid = getGrid($prevBb, $points);
    for ($j = $prevBb[1]; $j <= $prevBb[3]; $j += 1) {
      for ($i = $prevBb[0]; $i <= $prevBb[2]; $i += 1) {
        if ($grid[$i][$j]) {
          echo '#';
        } else {
          echo '.';
        }
      }
      echo "\n";
    }
  }
  $s += 1;
}
?>