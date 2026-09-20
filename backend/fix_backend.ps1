Write-Host "--- Fix Backend Script Starting ---"

# Stop any lingering Node processes that might lock files
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process pnpm -ErrorAction SilentlyContinue | Stop-Process -Force

# Delete node_modules folder with retries
$maxAttempts = 3
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        if (Test-Path -Path "./node_modules") {
            Remove-Item -Recurse -Force -ErrorAction Stop "./node_modules"
            Write-Host "✅ node_modules removed"
        } else {
            Write-Host "node_modules folder not found, skipping removal"
        }
        break
    } catch {
        Write-Warning "Attempt $i - Could not delete node_modules: $_"
        Start-Sleep -Seconds 2
    }
}

# Clean npm cache
npm cache clean --force

# Re‑install dependencies
npm install

# Apply Prisma migrations (creates the DB schema)
npx prisma migrate dev --name init

# Start the backend in development mode
npm run dev

Write-Host "--- Script completed ---"
