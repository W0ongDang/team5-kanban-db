$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$distPath = [IO.Path]::GetFullPath((Join-Path $projectRoot 'dist'))
$expectedDistPath = [IO.Path]::Combine($projectRoot, 'dist')

if ($distPath -ne $expectedDistPath) {
    throw "Unexpected build output path: $distPath"
}

if (Test-Path -LiteralPath $distPath) {
    Remove-Item -LiteralPath $distPath -Recurse -Force
}

New-Item -ItemType Directory -Path $distPath | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\cards') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\game') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'assets\audio') -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $distPath 'team') -Force | Out-Null

@('index.html', 'styles.css', 'script.js', 'profiles.mjs', 'tunnel.mjs', 'lobby-music.mjs', 'pack-audio.mjs', 'kanban.mjs') | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $projectRoot $_) -Destination (Join-Path $distPath $_)
}

Copy-Item -LiteralPath (Join-Path $projectRoot 'assets\audio\trimmed_32s_fadeout.mp3') -Destination (Join-Path $distPath 'assets\audio')

Get-ChildItem -LiteralPath (Join-Path $projectRoot 'assets\cards') -File |
    Copy-Item -Destination (Join-Path $distPath 'assets\cards')

@('cocone-school.svg', 'team5.svg', 'stadium-day-v1.png', 'stadium-tunnel-v1.png', 'member-pack-v1.png', 'team5-intro-bg-v1.png', 'team5-kanban-snapshot-v1.svg') | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $projectRoot "assets\game\$_") -Destination (Join-Path (Join-Path $distPath 'assets\game') $_)
}

Get-ChildItem -LiteralPath (Join-Path $projectRoot 'team') -Filter '*.md' -File |
    Copy-Item -Destination (Join-Path $distPath 'team')

Write-Output "Static site built at $distPath"
