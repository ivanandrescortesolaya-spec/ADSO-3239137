
$ErrorActionPreference = "Stop"

# Create the backup folder
$backupDirectory = Join-Path $PSScriptRoot "backups"

if (-not (Test-Path $backupDirectory)) {
    New-Item -ItemType Directory -Path $backupDirectory | Out-Null
}

# File name with date and time
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = Join-Path $backupDirectory "music_school_$timestamp.sql"

Write-Host "Iniciando respaldo de la base de datos..."

# Run mysqldump inside the MySQL container
$dump = docker compose exec -T mysql sh -c 'exec mysqldump --no-tablespaces -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"'

if ($LASTEXITCODE -ne 0) {
    throw "No se pudo generar el respaldo de MySQL."
}

if (-not $dump) {
    throw "El respaldo esta vacio."
}

# Save the SQL file without a BOM
$content = $dump -join [Environment]::NewLine
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($backupFile, $content, $encoding)

Write-Host "Respaldo generado correctamente:"
Write-Host $backupFile
