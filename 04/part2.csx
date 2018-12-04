#! "netcoreapp2.1"
using System;
using System.Collections.Generic;
using System.IO;

public class Data
{
    public int TopMinute;
    public int[] Minutes;
}
public class Part2
{
  public void Run()
  {
    using (var sr = new StreamReader(Console.OpenStandardInput()))
    {
      string bestGuard = "";
      string currentGuard = "";
      int sleepStart = 0;
      var sleep = new Dictionary<string, Data>();
      while (sr.Peek() > -1)
      {
        var line = sr.ReadLine();
        if (line.Contains("#"))
        {
          var pos = line.IndexOf('#');
          var id = line.Substring(pos + 1, line.IndexOf(' ', pos) - pos - 1);
          currentGuard = id;
          //Console.WriteLine("Guard " + id);
        }
        else if (line.Contains("asleep"))
        {
          sleepStart = int.Parse(line.Split(':', ']')[1]);
        }
        else
        {
          if (string.IsNullOrEmpty(currentGuard)) continue;
          if (!sleep.ContainsKey(currentGuard))
          {
            sleep.Add(currentGuard, new Data { TopMinute = 0, Minutes = new int[60] });
          }
          var data = sleep[currentGuard];
          var sleepEnd = int.Parse(line.Split(':', ']')[1]);
          //Console.WriteLine("Guard " + currentGuard + " slept from " + sleepStart + " to " + sleepEnd);
          for (var min = sleepStart; min < sleepEnd; min += 1)
          {
            data.Minutes[min] += 1;
            if (data.Minutes[min] > data.Minutes[data.TopMinute])
            {
              data.TopMinute = min;
            }
          }
          //Console.WriteLine("  Total: " + data.Total);
          if (string.IsNullOrEmpty(bestGuard))
          {
            bestGuard = currentGuard;
            //Console.WriteLine("  Now the best guard");
          }
          else
          {
            var best = sleep[bestGuard];
            if (data.Minutes[data.TopMinute] > best.Minutes[best.TopMinute])
            {
              bestGuard = currentGuard;
              //Console.WriteLine("  Now the best guard");
            }
          }
        }
      }
      var b = sleep[bestGuard];
      var intGuard = int.Parse(bestGuard);
      var bestMin = 0;
      for (var m = 0; m < b.Minutes.Length; m += 1)
      {
        if (b.Minutes[m] > b.Minutes[bestMin])
        {
          bestMin = m;
        }
      }
      Console.WriteLine("Guard " + bestGuard + " at " + bestMin + " = " + intGuard * bestMin);
    }
  }
}

var p1 = new Part2();
p1.Run();
