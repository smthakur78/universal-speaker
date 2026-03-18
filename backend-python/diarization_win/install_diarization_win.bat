@echo off
setlocal

REM Use existing venv
cd /d %~dp0..
call venv\Scripts\activate.bat

pip install -r diarization_win\requirements_diarization_win.txt

echo.
echo [OK] Diarization (Windows) dependencies installed.
endlocal
