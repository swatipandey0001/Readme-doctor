# ============================================
# README Doctor - Test Suite Runner (Updated)
# ============================================

function Test-TitleCheck {
    param([string]$readme)
    
    # Check for markdown H1 (line starting with #)
    if ($readme -match "^#\s+" -or $readme -match "#\s+") { return $true }
    
    # Check for Setext heading (line followed by ===)
    if ($readme -match "^(.+)\n={3,}") { return $true }
    
    # Check for HTML h1 or h2 tags
    if ($readme -match "<h[12][^>]*>[^<]*<\/h[12]>") { return $true }
    
    # Check first 30 lines for img with alt text or bold/heading project name
    $firstLines = ($readme -split "`n")[0..29] -join "`n"
    if ($firstLines -match "<img[^>]*alt=[^>]*>") { return $true }
    if ($firstLines -match "<b>[^<]+<\/b>|<strong>[^<]+<\/strong>") { return $true }
    
    return $false
}

function Test-DescriptionCheck {
    param([string]$readme)
    
    $text = $readme -replace "```[^`]*```", "" `
                   -replace "[^`]*", "" `
                   -replace "^#{1,}[\s]+.*$", "" `
                   -replace "^!?\[.*?\].*$", "" `
                   -replace "^\s*[-*•]\s+.*", ""
    $text = $text.Trim()
    return $text.Length -ge 100
}

function Test-InstallationCheck {
    param([string]$readme)
    
    # Check for headings with install/setup/getting started/quick start/download keywords
    if ($readme -match "^#+\s+(install|installation|setup|getting\s+started|quick\s+start|download)" -or
        $readme -imatch "^#+\s+quick\s+start") {
        return $true
    }
    
    # Check for code blocks with package manager commands
    if ($readme -match "```[\s\S]*?(npm\s+install|yarn\s+add|pip\s+install|composer\s+require|git\s+clone)") {
        return $true
    }
    
    # Check for CDN includes (link or script tags)
    if ($readme -match "<link[^>]*href=[^>]*>|<script[^>]*src=[^>]*>") {
        return $true
    }
    
    return $false
}

function Test-UsageCheck {
    param([string]$readme)
    return $readme -match "^#+\s+(usage|how\s+to\s+use|quick\s+start|example)"
}

function Test-ScreenshotsCheck {
    param([string]$readme)
    return $readme -match "!\[[\s\S]*?\]\(" -or $readme -match "<img[^>]*>"
}

function Test-LicenseCheck {
    param([string]$readme)
    return $readme -match "^#+\s+.*license|license\s*badge|mit\s+license|apache\s+license|gpl|bsd\s+license"
}

function Test-ContributingCheck {
    param([string]$readme)
    return $readme -match "^#+\s+.*contribut"
}

function CalculateScore {
    param([string]$readme)
    
    $score = 0
    $results = @()
    
    $checks = @(
        @{ name = "Title"; points = 10; test = { Test-TitleCheck $readme } },
        @{ name = "Description"; points = 15; test = { Test-DescriptionCheck $readme } },
        @{ name = "Installation"; points = 20; test = { Test-InstallationCheck $readme } },
        @{ name = "Usage"; points = 20; test = { Test-UsageCheck $readme } },
        @{ name = "Screenshots"; points = 15; test = { Test-ScreenshotsCheck $readme } },
        @{ name = "License"; points = 10; test = { Test-LicenseCheck $readme } },
        @{ name = "Contributing"; points = 10; test = { Test-ContributingCheck $readme } }
    )
    
    foreach ($check in $checks) {
        $found = & $check.test
        if ($found) { $score += $check.points }
        $results += @{ name = $check.name; points = $check.points; found = $found }
    }
    
    return @{ score = $score; results = $results }
}

# ============================================
# TEST CASES
# ============================================

$tests = @(
    @{
        name = "Test 1: Empty/Minimal README"
        readme = "hello"
        expected = 0
        description = "A README with just 'hello' should have almost no score"
    },
    @{
        name = "Test 2: Medium README (Title, Description, Installation, Usage)"
        readme = @"
# My Project

This is a detailed description of my project. It should have more than 100 characters so that it passes the description check.

## Installation

Run this command to install the project:

```bash
npm install
```

## Usage

Here's how to use this project:

```bash
npm start
```
"@
        expected = 65
        description = "Has Title (10) + Description (15) + Installation (20) + Usage (20) = 65"
    },
    @{
        name = "Test 3: Complete README (All sections)"
        readme = @"
# Complete Project

This is a very detailed description of my complete project. It's designed to showcase all the features you need. I'm including lots of text here to make sure it exceeds 100 characters for the description check. This description will definitely pass the test.

## Installation

To install this project, follow these steps:

```bash
git clone https://github.com/user/project.git
cd project
npm install
```

## Usage

Here's how to use the project:

```bash
npm start
```

## Screenshots

![Screenshot 1](./screenshots/main.png)
![Screenshot 2](./screenshots/feature.png)

## License

MIT License - see LICENSE file

## Contributing

Contributions are welcome! Please follow the guidelines in CONTRIBUTING.md
"@
        expected = 100
        description = "Has all 7 sections = 10 + 15 + 20 + 20 + 15 + 10 + 10 = 100"
    },
    @{
        name = "Test 4: HTML Title Test"
        readme = @"
<h1 align="center">My App</h1>

This is a detailed description of my application. It has more than 100 characters to pass the description check. The HTML title should be detected and counted in the score.
"@
        expected = 25
        description = "Has HTML h1 title (10) + Description (15) = 25"
    },
    @{
        name = "Test 5: Quick Start Installation Test"
        readme = @"
# My Project

This is a detailed description of my project. It should have more than 100 characters so that it passes the description check. The Quick Start section should count as Installation.

## Quick Start

Get started in 3 steps:

```bash
npm install
npm run dev
```
"@
        expected = 45
        description = "Has Title (10) + Description (15) + Quick Start as Installation (20) = 45"
    }
)

# ============================================
# RUN TESTS
# ============================================

Write-Host "🧪 README Doctor Test Suite (Enhanced)" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

foreach ($test in $tests) {
    Write-Host "`n$($test.name)" -ForegroundColor Yellow
    Write-Host "Description: $($test.description)" -ForegroundColor Gray
    Write-Host "-" * 65
    
    $result = CalculateScore $test.readme
    $score = $result.score
    $results = $result.results
    
    Write-Host "Input: $($test.readme.Length) characters"
    Write-Host "Expected Score: $($test.expected)"
    Write-Host "Actual Score: $score"
    
    Write-Host "`nDetailed Results:"
    foreach ($r in $results) {
        $status = if ($r.found) { "[OK]" } else { "[NO]" }
        $points = if ($r.found) { "+$($r.points)" } else { "0" }
        Write-Host "  $status $($r.name.PadEnd(15)) $($points.PadStart(3)) points"
    }
    
    # Verify score
    if ($score -eq $test.expected) {
        Write-Host "`n✅ PASSED: Score is $score/100 (expected $($test.expected))" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "`n❌ FAILED: Score is $score/100 (expected $($test.expected))" -ForegroundColor Red
        $failed++
    }
    
    Write-Host "=====================================================================" -ForegroundColor Cyan
}

# ============================================
# TEST SUMMARY
# ============================================

Write-Host "`n📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "✅ Passed: $passed/$($tests.Count)" -ForegroundColor Green
Write-Host "❌ Failed: $failed/$($tests.Count)" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  $failed test(s) failed. Review the results above." -ForegroundColor Red
}

Write-Host "=====================================================================" -ForegroundColor Cyan
