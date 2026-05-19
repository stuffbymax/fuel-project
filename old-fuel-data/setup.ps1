# name: setup_task.ps1
# description: Creates a Windows Task Scheduler job that runs the fuel
#              pipeline twice a day (6am + 6pm) on your dev machine.
# author: MartinP
# usage: Right-click → Run as Administrator

# ---------------------------------------------------------------------------
# Config — adjust these to match your machine
# ---------------------------------------------------------------------------
$ProjectDir = "$PSScriptRoot"   # folder this script lives in
$Python     = "python"          # or full path e.g. "C:\Python312\python.exe"
$TaskName   = "FuelPipelineUpdate"

# ---------------------------------------------------------------------------
# Build the action: cd into project dir, run update + pipeline
# ---------------------------------------------------------------------------
$Command   = "cmd.exe"
$Arguments = "/c `"cd /d `"$ProjectDir`" && $Python pipeline.py`""

$Action  = New-ScheduledTaskAction -Execute $Command -Argument $Arguments

# Two triggers: 6am and 6pm daily
$Trigger1 = New-ScheduledTaskTrigger -Daily -At "06:00"
$Trigger2 = New-ScheduledTaskTrigger -Daily -At "18:00"

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -StartWhenAvailable `   # catches up if machine was off
    -RunOnlyIfNetworkAvailable

# ---------------------------------------------------------------------------
# Register (or update if it already exists)
# ---------------------------------------------------------------------------
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Existing task removed."
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger1, $Trigger2 `
    -Settings $Settings `
    -RunLevel Highest `
    -Description "Downloads latest UK fuel prices and runs processing pipeline twice daily."

Write-Host ""
Write-Host "Task '$TaskName' created successfully."
Write-Host "Runs at 06:00 and 18:00 every day."
Write-Host "To check: Open Task Scheduler and look for '$TaskName'"