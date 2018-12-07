Imports System.Collections.Generic
Imports System.Linq
Imports Microsoft.VisualBasic

Public Class Stage
  Public Name as String
  Public Complete As Boolean = false
  Public Duration As Integer = 60
  Public After As New HashSet(Of String)
  Public Deps As New HashSet(Of Stage)

  Public Sub New(name as String)
    Me.Name = name
    Duration = Duration + (AscW(name) - 64)
  End Sub

  Public Function HasDependencies()
    Return Deps.Count > 0 And Deps.Any(Function(d) Not d.Complete)
  End Function
End Class

Public Class Part2
  Private Const WORKERMAX As Integer = 4
  Private nodes As New Dictionary(Of String, Stage)
  Private available As New SortedSet(Of String)
  Private remaining As Integer
  Private workers(WORKERMAX) As Stage

  Public Sub SetCompleted(completed As Stage)
    completed.Complete = true
    remaining = remaining - 1
    For Each following as String in completed.After
      If Not nodes(following).HasDependencies() Then
        available.Add(following)
      End If
    Next
  End Sub

  Public Function PopAvailable() As Stage
    If available.Count = 0 Then Return Nothing
    Dim current as String = available.Min
    available.Remove(current)
    Return nodes(current)
  End Function

  Public Sub Crawl()
    Dim second As Integer = 0
    While remaining > 0
      ' Console.Write(second.ToString() & ",")
      For w As Integer = 0 To WORKERMAX
        If workers(w) IsNot Nothing Then
          Dim stage = workers(w)
          stage.Duration = stage.Duration - 1
          If stage.Duration = 0 Then
            SetCompleted(stage)
            workers(w) = Nothing
          End If
        End If
      Next w
      For w As Integer = 0 To WORKERMAX
        If workers(w) Is Nothing Then
          workers(w) = PopAvailable()
        End If
      Next w
      ' For w As Integer = 0 To WORKERMAX
      '   If workers(w) Is Nothing Then
      '     Console.Write(".,")
      '   Else
      '     Console.Write(workers(w).Name & ",")
      '   End If
      ' Next w
      ' Console.WriteLine(remaining.ToString())
      second = second + 1
    End While
    Console.WriteLine("Result: " & (second - 1) & " seconds")
  End Sub


  Public Sub Run()
    Dim line as String = Console.ReadLine()
    While line IsNot Nothing
      Dim dependency As String = line.Substring(5, 1)
      Dim dependent As String = line.Substring(36, 1)
      If Not nodes.ContainsKey(dependent) Then
        nodes.Add(dependent, New Stage(dependent))
      End If
      If Not nodes.ContainsKey(dependency) Then
        nodes.Add(dependency, New Stage(dependency))
      End If
      nodes(dependency).After.Add(dependent)
      nodes(dependent).Deps.Add(nodes(dependency))
      available.Remove(dependent)
      If nodes(dependency).Deps.Count = 0 Then
        available.Add(dependency)
      End If
      line = Console.ReadLine()
    End While
    remaining = nodes.Count
    Crawl()
  End Sub
End Class