#!/usr/bin/env pwsh
# Script para probar localmente todos los checks del CI

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA LOCAL DE CI - BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend
Write-Host "[1/4] Ejecutando ESLint en backend..." -ForegroundColor Yellow
Set-Location backend
npx eslint "{src,apps,libs,test}/**/*.ts" --max-warnings=0
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ ESLint pasó" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Verificando formato con Prettier en backend..." -ForegroundColor Yellow
npx prettier --check "src/**/*.ts" "test/**/*.ts"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prettier check falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Prettier check pasó" -ForegroundColor Green
Write-Host ""

Write-Host "[3/4] Verificando build de TypeScript en backend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Build pasó" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA LOCAL DE CI - FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Frontend
Write-Host "[4/4] Ejecutando ESLint en frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ ESLint pasó" -ForegroundColor Green
Write-Host ""

Write-Host "[5/5] Verificando tipos en frontend..." -ForegroundColor Yellow
npm run type-check:ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check falló" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Type check pasó" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ TODOS LOS CHECKS PASARON" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tu código está listo para push a GitHub!" -ForegroundColor Green
