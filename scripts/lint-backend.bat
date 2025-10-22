@echo off
cd backend
call ..\.venv\Scripts\activate.bat
flake8 %*