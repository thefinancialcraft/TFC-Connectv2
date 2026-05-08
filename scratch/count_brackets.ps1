$path = "e:\Clone Repo From Git\TFC-Connectv2-5\pages\portal\organization\[id].tsx"
$content = Get-Content -LiteralPath $path -Raw
$openBrace = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$closeBrace = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$openParen = ($content.ToCharArray() | Where-Object { $_ -eq '(' }).Count
$closeParen = ($content.ToCharArray() | Where-Object { $_ -eq ')' }).Count
$openAngle = ($content.ToCharArray() | Where-Object { $_ -eq '<' }).Count
$closeAngle = ($content.ToCharArray() | Where-Object { $_ -eq '>' }).Count

Write-Host "Braces: { $openBrace, } $closeBrace"
Write-Host "Parens: ( $openParen, ) $closeParen"
Write-Host "Angles: < $openAngle, > $closeAngle"
