Imports System.Collections.Generic
Imports System.Text
Imports System.Linq

Public Class Node
  Public Name as String
  Public Complete As Boolean = false
  Public After As New HashSet(Of String)
  Public Deps As New HashSet(Of Node)

  Public Sub New(name as String)
    Name = name
  End Sub

  Public Function HasDependencies()
    Return Deps.Count > 0 And Deps.Any(Function(d) Not d.Complete)
  End Function
End Class

Public Class Part1
  Private nodes As New Dictionary(Of String, Node)
  Private available As New SortedSet(Of String)
  Private result As New StringBuilder()

  Public Sub Crawl()
    While available.Count > 0
      Dim current as String = available.Min
      nodes(current).Complete = true
      result.Append(current)
      For Each following as String in nodes(current).After
        If Not nodes(following).HasDependencies() Then
          available.Add(following)
        End If
      Next
      available.Remove(current)
    End While
    Console.WriteLine("Result: " + result.ToString())
  End Sub


  Public Sub Run()
    Dim line as String = Console.ReadLine()
    While line IsNot Nothing
      Dim dependency As String = line.Substring(5, 1)
      Dim dependent As String = line.Substring(36, 1)
      Console.WriteLine(dependency + " -> " + dependent)
      If Not nodes.ContainsKey(dependent) Then
        nodes.Add(dependent, New Node(dependent))
      End If
      If Not nodes.ContainsKey(dependency) Then
        nodes.Add(dependency, New Node(dependency))
      End If
      nodes(dependency).After.Add(dependent)
      nodes(dependent).Deps.Add(nodes(dependency))
      available.Remove(dependent)
      If nodes(dependency).Deps.Count = 0 Then
        available.Add(dependency)
      End If
      line = Console.ReadLine()
    End While
    Crawl()
  End Sub
End Class