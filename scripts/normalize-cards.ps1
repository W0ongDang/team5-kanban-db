param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $ProjectRoot 'assets\cards'
[IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

$cards = @(
  @{
    SourceWidth = 1086
    SourceHeight = 1448
    Output = 'taewoong-card.jpg'
    Crop = [Drawing.Rectangle]::new(0, 0, 1086, 1448)
  },
  @{
    SourceWidth = 1672
    SourceHeight = 941
    Output = 'youngkwang-card.jpg'
    Crop = [Drawing.Rectangle]::new(562, 67, 548, 731)
  },
  @{
    SourceWidth = 1122
    SourceHeight = 1402
    Output = 'yejin-card.jpg'
    Crop = [Drawing.Rectangle]::new(94, 0, 935, 1246)
  }
)

$jpegEncoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' } |
  Select-Object -First 1
$encoderParameters = [Drawing.Imaging.EncoderParameters]::new(1)
$encoderParameters.Param[0] = [Drawing.Imaging.EncoderParameter]::new(
  [Drawing.Imaging.Encoder]::Quality,
  [long]93
)

$sourceAssets = Get-ChildItem -LiteralPath (Join-Path $ProjectRoot 'assets') -File |
  ForEach-Object {
    $probe = [Drawing.Image]::FromFile($_.FullName)
    try {
      [PSCustomObject]@{
        Path = $_.FullName
        Width = $probe.Width
        Height = $probe.Height
      }
    } finally {
      $probe.Dispose()
    }
  }

try {
  foreach ($card in $cards) {
    $sourcePath = $sourceAssets |
      Where-Object { $_.Width -eq $card.SourceWidth -and $_.Height -eq $card.SourceHeight } |
      Select-Object -ExpandProperty Path -First 1
    if (-not $sourcePath) {
      throw "Card source with dimensions $($card.SourceWidth)x$($card.SourceHeight) was not found."
    }
    $outputPath = [IO.Path]::GetFullPath((Join-Path $outputDirectory ([string]$card['Output'])))
    $sourceImage = [Drawing.Image]::FromFile($sourcePath)
    $canvas = [Drawing.Bitmap]::new(900, 1200, [Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [Drawing.Graphics]::FromImage($canvas)

    try {
      $graphics.Clear([Drawing.Color]::FromArgb(6, 8, 12))
      $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::HighQuality
      $destination = [Drawing.Rectangle]::new(0, 0, 900, 1200)
      $graphics.DrawImage($sourceImage, $destination, $card.Crop, [Drawing.GraphicsUnit]::Pixel)
      $canvas.Save($outputPath, $jpegEncoder, $encoderParameters)
      Write-Output $outputPath
    } finally {
      $graphics.Dispose()
      $canvas.Dispose()
      $sourceImage.Dispose()
    }
  }
} finally {
  $encoderParameters.Dispose()
}
