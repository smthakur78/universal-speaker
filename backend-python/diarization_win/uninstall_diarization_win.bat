@echo off
setlocal

echo This will only remove local diarization_win artifacts, not the venv or shared deps.
echo Press Ctrl+C to cancel.
pause

rmdir /s /q pretrained_models

echo.
echo [OK] Local diarization_win model files removed.
endlocal
