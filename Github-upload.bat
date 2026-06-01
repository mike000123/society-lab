@echo off
title GitHub Full Repository Overwrite Tool

REM ============================================
REM CONFIGURATION
REM ============================================

REM === LOCAL PROJECT FOLDER ===
set PROJECT_DIR=C:\Users\dimzo\Documents\ENTERTAINMENT\Coding\new_society\Uploaded_on_github

REM === GITHUB REPOSITORY URL ===
set REPO_URL=https://github.com/mike000123/society-lab.git

REM === BRANCH NAME ===
set BRANCH=main

REM ============================================
REM SCRIPT START
REM ============================================

echo.
echo ============================================
echo GOING TO PROJECT DIRECTORY
echo ============================================
cd /d "%PROJECT_DIR%"

IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cannot access project directory.
    pause
    exit /b
)

echo.
echo ============================================
echo INITIALIZING GIT IF NEEDED
echo ============================================

IF NOT EXIST ".git" (
    git init
)

echo.
echo ============================================
echo REMOVING OLD REMOTE IF EXISTS
echo ============================================

git remote remove origin 2>nul

echo.
echo ============================================
echo ADDING NEW REMOTE
echo ============================================

git remote add origin %REPO_URL%

echo.
echo ============================================
echo STAGING FILES
echo ============================================

git add .

echo.
echo ============================================
echo COMMITTING
echo ============================================

git commit -m "Full repository overwrite"

echo.
echo ============================================
echo SETTING BRANCH
echo ============================================

git branch -M %BRANCH%

echo.
echo ============================================
echo FORCE PUSHING TO GITHUB
echo ============================================

git push -u origin %BRANCH% --force

echo.
echo ============================================
echo DONE
echo ============================================

pause