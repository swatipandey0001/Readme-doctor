# 📋 README Doctor

Analyze any GitHub README in seconds. Get a score out of 100, a green/red checklist, and ready-made templates for missing sections.

**🔗 Live Demo:** https://swatipandey0001.github.io/Readme-doctor/

## ❗ Problem Statement
A good README is the first thing people see in a project, but many developers, especially students and beginners, don't know what it should contain. Missing sections like Installation, Usage or License make projects hard to understand, use and contribute to. Checking this manually takes time, and there is no quick, simple feedback tool.

## ✅ Solution
README Doctor takes a GitHub repository URL, fetches its README using the GitHub API and scores it out of 100. It shows what is present and what is missing, and gives a copy-ready markdown template for every missing section.

## ✨ Features
- Analyze any public repo with a URL or `owner/repo`
- Animated score circle (out of 100)
- Green/red checklist with points per section
- Ready-made templates with a Copy button
- Clear errors for invalid URL, repo not found and API rate limit
- Dark, responsive UI

| Section | Points |
|---|---|
| Title | 10 |
| Description | 15 |
| Installation | 20 |
| Usage | 20 |
| Screenshots | 15 |
| License | 10 |
| Contributing | 10 |

## 🛠️ Tech Stack
HTML, CSS, JavaScript (no frameworks) and the GitHub REST API.

## ⚙️ Installation
1. Clone the repository:
   ```
   git clone https://github.com/swatipandey0001/readme-doctor.git
   ```
2. Open the folder:
   ```
   cd readme-doctor
   ```
3. Open `index.html` in your browser. No build step or server needed.

## 🚀 Usage
1. Open the app (live link or `index.html`).
2. Enter a repo URL, for example `https://github.com/twbs/bootstrap`.
3. Click **Analyze**.
4. Check the score and checklist, then copy templates for the missing sections.

> Note: GitHub allows 60 API requests per hour without login. If you see a rate limit error, try again later.

## 📸 Screenshots


![README Doctor](https://img.shields.io/badge/README-Doctor-14b8a6)



## 🤝 Contributing
Contributions are welcome! Fork the repo, create a branch, make your changes and open a pull request.

## 🤖 Built With
Built during GitHub Copilot Dev Days using GitHub Copilot.

## 📄 License
This project is licensed under the MIT License.
```
