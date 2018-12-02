my @codes = <>;
foreach my $i (0 .. $#codes) {
  foreach my $j (($i + 1) .. $#codes) {
    my $diff = 0;
    my @a = split(//, $codes[$i]);
    my @b = split(//, $codes[$j]);
    foreach my $k (0 .. $#a) {
      $diff++ if $a[$k] ne $b[$k];
      last if $diff > 1;
    }
    if ($diff == 1) {
      print $codes[$i] . $codes[$j];
      foreach my $k (0 .. $#a) {
        print $a[$k] if $a[$k] eq $b[$k];
      }
      exit;
    }
  }
}
