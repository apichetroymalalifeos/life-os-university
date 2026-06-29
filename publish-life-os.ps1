param(
  [switch]$CheckOnly,
  [switch]$UpdateVersionOnly,
  [switch]$UpdateVersion,
  [switch]$NoPrompt,
  [switch]$OpenActions,
  [string]$DefaultMessage = "Life OS Update",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -LiteralPath $PSScriptRoot

$DefaultRemoteUrl = "https://github.com/apichetroymalalifeos/life-os-university.git"
$ActionsUrl = "https://github.com/apichetroymalalifeos/life-os-university/actions"

function Write-Title {
  Write-Host ""
  Write-Host "==============================" -ForegroundColor Cyan
  Write-Host " Life OS University Publisher " -ForegroundColor Cyan
  Write-Host "==============================" -ForegroundColor Cyan
}

function Stop-Thai {
  param([string]$Message)
  Write-Host ""
  Write-Host "หยุดทำงาน: $Message" -ForegroundColor Red
  exit 1
}

function Test-GitInstalled {
  return [bool](Get-Command git -ErrorAction SilentlyContinue)
}

function Invoke-GitText {
  param([string[]]$Arguments)
  $previousErrorPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = & git @Arguments 2>$null
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorPreference
  }
  if ($exitCode -ne 0) {
    return $null
  }
  return (($output | Out-String).Trim())
}

function Invoke-GitCommand {
  param([string[]]$Arguments)
  $previousErrorPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & git @Arguments
    return $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorPreference
  }
}

function Test-LifeOsRepository {
  $inside = Invoke-GitText -Arguments @("rev-parse", "--is-inside-work-tree")
  return $inside -eq "true"
}

function Ensure-LifeOsRepository {
  param([string]$TargetBranch)

  if (!(Test-LifeOsRepository)) {
    $gitPath = Join-Path $PSScriptRoot ".git"
    if (Test-Path -LiteralPath $gitPath) {
      $backupName = ".git.broken-{0}" -f (Get-Date -Format "yyyyMMdd-HHmmss")
      $backupPath = Join-Path $PSScriptRoot $backupName
      Write-Host "พบโฟลเดอร์ .git ที่ใช้งานไม่ได้ ระบบจะย้ายไปเก็บเป็น $backupName" -ForegroundColor Yellow
      Move-Item -LiteralPath $gitPath -Destination $backupPath -Force
    }

    Write-Host "ยังไม่พบ Git repository ระบบจะตั้งค่าให้โดยอัตโนมัติ..." -ForegroundColor Yellow
    $initExitCode = Invoke-GitCommand -Arguments @("init", "-b", $TargetBranch)
    if ($initExitCode -ne 0) {
      $fallbackInitExitCode = Invoke-GitCommand -Arguments @("init")
      if ($fallbackInitExitCode -ne 0) {
        Stop-Thai "ตั้งค่า Git repository ไม่สำเร็จ"
      }
      $branchExitCode = Invoke-GitCommand -Arguments @("branch", "-M", $TargetBranch)
      if ($branchExitCode -ne 0) {
        Stop-Thai "ตั้งค่า branch $TargetBranch ไม่สำเร็จ"
      }
    }
  }

  $remoteUrl = Get-RemoteUrl
  if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "ยังไม่มี remote origin ระบบจะเพิ่ม GitHub remote ให้อัตโนมัติ..."
    $remoteExitCode = Invoke-GitCommand -Arguments @("remote", "add", "origin", $DefaultRemoteUrl)
    if ($remoteExitCode -ne 0) {
      Stop-Thai "เพิ่ม remote origin ไม่สำเร็จ"
    }
  }
}

function Ensure-GitIdentity {
  $name = Invoke-GitText -Arguments @("config", "--get", "user.name")
  $email = Invoke-GitText -Arguments @("config", "--get", "user.email")

  if ([string]::IsNullOrWhiteSpace($name)) {
    $null = Invoke-GitCommand -Arguments @("config", "user.name", "Life OS Publisher")
  }

  if ([string]::IsNullOrWhiteSpace($email)) {
    $null = Invoke-GitCommand -Arguments @("config", "user.email", "life-os@local")
  }
}

function Get-RemoteUrl {
  return Invoke-GitText -Arguments @("config", "--get", "remote.origin.url")
}

function Get-CurrentBranch {
  $branch = Invoke-GitText -Arguments @("branch", "--show-current")
  if ([string]::IsNullOrWhiteSpace($branch)) {
    return "ไม่ทราบ"
  }
  return $branch
}

function Get-PagesUrl {
  param([string]$RemoteUrl)
  if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
    return "ยังไม่มี Remote URL"
  }

  $owner = $null
  $repo = $null

  if ($RemoteUrl -match "github\.com[:/](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$") {
    $owner = $Matches.owner
    $repo = $Matches.repo
  }

  if ($owner -and $repo) {
    return "https://$owner.github.io/$repo/"
  }

  return "ตรวจ URL อัตโนมัติไม่ได้: $RemoteUrl"
}

function Get-VersionInfo {
  if (!(Test-Path -LiteralPath "version.json")) {
    return "ไม่พบ version.json"
  }
  $json = Get-Content -LiteralPath "version.json" -Raw -Encoding UTF8 | ConvertFrom-Json
  return "v$($json.version) build $($json.build)"
}

function Assert-RequiredFiles {
  $required = @("index.html", "version.json", "manifest.webmanifest", "fresh.html")
  $missing = $required | Where-Object { !(Test-Path -LiteralPath $_) }
  if ($missing.Count -gt 0) {
    Stop-Thai "ไฟล์สำคัญหายไป: $($missing -join ', ')"
  }
}

function Show-GitMissingHelp {
  Write-Host "ไม่พบ Git ในเครื่องนี้" -ForegroundColor Yellow
  Write-Host "วิธีแก้:"
  Write-Host "1. ติดตั้ง Git for Windows จาก https://git-scm.com/download/win"
  Write-Host "2. ปิดหน้าต่างนี้"
  Write-Host "3. เปิดไฟล์ Publish Life OS ใหม่อีกครั้ง"
}

function Show-RepoMissingHelp {
  Write-Host "Repository not configured / ยังไม่ได้ตั้งค่า Repository" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "โปรเจกต์นี้ยังไม่พร้อมสำหรับ git push"
  Write-Host "ให้ตั้งค่า GitHub repository ครั้งแรกก่อน แล้วค่อยใช้ปุ่ม Publish Life OS"
  Write-Host ""
  Write-Host "ข้อมูลที่ควรเช็ก:"
  Write-Host "- โฟลเดอร์นี้ต้องเป็น Git repository"
  Write-Host "- ต้องมี remote ชื่อ origin"
  Write-Host "- remote ควรชี้ไปที่ GitHub repository ของ Life OS"
}

function Show-Check {
  Write-Title
  Assert-RequiredFiles

  if (!(Test-GitInstalled)) {
    Show-GitMissingHelp
    return
  }

  Write-Host "เวอร์ชัน Git: $(Invoke-GitText -Arguments @('--version'))"
  Write-Host "เวอร์ชัน Life OS ล่าสุด: $(Get-VersionInfo)"

  if (!(Test-LifeOsRepository)) {
    Show-RepoMissingHelp
    return
  }

  $branchName = Get-CurrentBranch
  $remoteUrl = Get-RemoteUrl
  $pagesUrl = Get-PagesUrl -RemoteUrl $remoteUrl
  $status = Invoke-GitText -Arguments @("status", "--short")

  Write-Host ""
  Write-Host "เชื่อมต่อ Repository แล้ว" -ForegroundColor Green
  Write-Host "Repository: Life OS University"
  Write-Host "Branch ปัจจุบัน: $branchName"
  Write-Host "Remote URL: $remoteUrl"
  Write-Host "GitHub Pages URL: $pagesUrl"
  Write-Host ""
  Write-Host "สถานะ Git:"
  if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ไม่มีไฟล์ที่เปลี่ยนแปลง" -ForegroundColor Green
  } else {
    Write-Host $status
  }
}

function Update-LifeOsVersion {
  Assert-RequiredFiles
  $path = Join-Path $PSScriptRoot "version.json"
  $json = Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
  $today = Get-Date -Format "yyyy-MM-dd"
  $nextNumber = 1

  if ($json.build -match "^$([regex]::Escape($today))-(\d+)$") {
    $nextNumber = [int]$Matches[1] + 1
  }

  $json.build = "{0}-{1:000}" -f $today, $nextNumber
  $json.updatedAt = [DateTimeOffset]::Now.ToString("yyyy-MM-ddTHH:mm:sszzz")
  if ([string]::IsNullOrWhiteSpace($json.notes)) {
    $json.notes = "Life OS update"
  }

  $jsonText = $json | ConvertTo-Json -Depth 10
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $jsonText + [Environment]::NewLine, $utf8NoBom)
  Write-Host "อัปเดต version.json แล้ว: v$($json.version) build $($json.build)" -ForegroundColor Green
}

function Publish-LifeOs {
  Write-Title
  Assert-RequiredFiles

  if ($UpdateVersion) {
    Update-LifeOsVersion
  }

  if (!(Test-GitInstalled)) {
    Show-GitMissingHelp
    exit 1
  }

  Ensure-LifeOsRepository -TargetBranch $Branch
  Ensure-GitIdentity

  $branchName = Get-CurrentBranch
  $remoteUrl = Get-RemoteUrl
  if ([string]::IsNullOrWhiteSpace($remoteUrl)) {
    Write-Host "Repository not configured / ยังไม่มี remote origin" -ForegroundColor Yellow
    Write-Host "กรุณาตั้งค่า remote GitHub ก่อนใช้งาน Publish Life OS"
    exit 1
  }

  Write-Host "Current Version: $(Get-VersionInfo)"
  Write-Host "Current Branch: $branchName"
  Write-Host "Remote URL: $remoteUrl"
  Write-Host ""
  Write-Host "Modified Files:"
  $status = Invoke-GitText -Arguments @("status", "--short")
  if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ไม่มีไฟล์ที่เปลี่ยนแปลง" -ForegroundColor Green
  } else {
    Write-Host $status
  }
  Write-Host ""

  $message = $DefaultMessage
  if (!$NoPrompt) {
    $inputMessage = Read-Host "Commit message (กด Enter เพื่อใช้ '$DefaultMessage')"
    if (![string]::IsNullOrWhiteSpace($inputMessage)) {
      $message = $inputMessage
    }
  }

  Write-Host "กำลังเตรียมไฟล์ทั้งหมด..."
  $addExitCode = Invoke-GitCommand -Arguments @("add", ".")
  if ($addExitCode -ne 0) {
    Stop-Thai "git add ไม่สำเร็จ"
  }

  $diffExitCode = Invoke-GitCommand -Arguments @("diff", "--cached", "--quiet")
  if ($diffExitCode -eq 0) {
    Write-Host "ไม่มีไฟล์ที่เปลี่ยนแปลง" -ForegroundColor Green
    return
  }

  Write-Host "กำลัง commit..."
  $commitExitCode = Invoke-GitCommand -Arguments @("commit", "-m", $message)
  if ($commitExitCode -ne 0) {
    Stop-Thai "git commit ไม่สำเร็จ"
  }

  Write-Host "กำลัง push ไป GitHub: origin $Branch"
  $pushExitCode = Invoke-GitCommand -Arguments @("push", "-u", "origin", $Branch)
  if ($pushExitCode -ne 0) {
    Write-Host "push แบบปกติไม่สำเร็จ อาจเป็นเพราะ GitHub มีประวัติ commit เก่า ระบบจะ publish โปรเจกต์ Life OS ปัจจุบันเป็น source of truth..." -ForegroundColor Yellow
    $pushExitCode = Invoke-GitCommand -Arguments @("push", "--force-with-lease", "-u", "origin", $Branch)
  }
  if ($pushExitCode -ne 0) {
    Stop-Thai "git push ไม่สำเร็จ กรุณาตรวจ remote, branch, และสิทธิ์ GitHub"
  }

  Write-Host ""
  Write-Host "Publish สำเร็จ GitHub Pages จะ deploy อัตโนมัติ" -ForegroundColor Green
  Write-Host "หลัง GitHub Actions เป็นสีเขียว ให้เปิดบนมือถือ:" -ForegroundColor Green
  Write-Host "https://apichetroymalalifeos.github.io/life-os-university/index.html?fresh=1"
  Write-Host "ถ้า fresh.html ยัง 404 ให้ใช้ index.html?fresh=1 ก่อน เพราะหน้านี้อยู่ในไฟล์หลัก"
  if ($OpenActions) {
    Start-Process $ActionsUrl
  }
}

if ($CheckOnly) {
  Show-Check
  exit 0
}

if ($UpdateVersionOnly) {
  Write-Title
  Update-LifeOsVersion
  exit 0
}

Publish-LifeOs
