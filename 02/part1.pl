my $twos = 0;
my $threes = 0;
while (<>) {
  my %count;
  foreach $char (split //, $_) {
    $count{$char} = 0 if not exists $count{$char};
    $count{$char} += 1;
  }
  my @counts = values %count;
  $twos++ if grep(/^2$/, @counts);
  $threes++ if grep(/^3$/, @counts);
}
print $twos . "\n";
print $threes . "\n";
print ($twos * $threes);
