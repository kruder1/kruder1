@echo off
echo ============================================
echo   KRUDER 1 — Build
echo ============================================
echo.

:: Run from the Software directory
cd /d "%~dp0"

:: Clean previous build
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

echo [1/2] Building with PyInstaller...
pyinstaller kruder1.spec --clean --noconfirm

if errorlevel 1 (
    echo.
    echo BUILD FAILED — check errors above.
    pause
    exit /b 1
)

echo.
echo [2/2] Build complete!
echo Output: dist\Kruder1\Kruder1.exe
echo.
echo To test: dist\Kruder1\Kruder1.exe
echo To create installer: open installer.iss with Inno Setup
echo.
pause
