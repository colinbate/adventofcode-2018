Imports System

Module Program
  Sub Main(args As String())
    If args.Length < 1 Then
      Return
    End If
    If args(0).Equals("1") Then
      Dim part As New Part1()
      part.Run()
    ElseIf args(0).Equals("2") Then
      Dim part As New Part2()
      part.Run()
    End If
  End Sub
End Module
