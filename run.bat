@echo off

echo Loading...
ping localhost -n 2 >nul

color 0a

echo Loading library...

title Download ok
ping localhost -n 2 >nul

echo Loading...

ping localhost -n 2 >nul

echo.

set NodePackagesPath=E:\Projects\OpenShift\Materials\Node.jsPackageManager // This is my path, you can edit them

set Path=%NodePackagesPath%\node_modules\.bin;%PATH%
set Path=%NodePackagesPath%;%PATH%

set NODE_PATH=%NodePackagesPath%\node_modules;%NODE_PATH%

echo Environment variables are successfully added.
echo. 
echo. 
echo. 

node index.js