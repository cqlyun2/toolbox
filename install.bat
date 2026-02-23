@echo off
cd frontend
call npm install
cd ..\backend
call npm install
cd ..
echo Done!
pause
