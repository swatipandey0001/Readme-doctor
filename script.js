// ============================================
// README Doctor - Main JavaScript Logic
// ============================================

// ============================================
// SCORING CHECKS - DATA-DRIVEN ARRAY
// Each check has: id, name, points, and a test function
// The ONLY source of truth for scoring!
// ============================================

const scoringChecks = [
    {
        id: 'title',
        name: 'Title',
        points: 10,
        test: (readme) => {
            // Check for markdown H1 (line starting with #)
            if (/^#\s+/m.test(readme)) return true;
            
            // Check for Setext heading (line followed by ===)
            if (/^(.+)\n={3,}$/m.test(readme)) return true;
            
            // Check for HTML h1 or h2 tags
            if (/<h[12][^>]*>[^<]*<\/h[12]>/i.test(readme)) return true;
            
            // Check first 30 lines for img with alt text or bold/heading project name
            const firstLines = readme.split('\n').slice(0, 30).join('\n');
            if (/<img[^>]*alt=[^>]*>/i.test(firstLines)) return true;
            if (/<b>[^<]+<\/b>|<strong>[^<]+<\/strong>/i.test(firstLines)) return true;
            
            return false;
        }
    },
    {
        id: 'description',
        name: 'Description',
        points: 15,
        test: (readme) => {
            // Remove code blocks, remove headings, then check if 100+ chars remain
            let text = readme
                .replace(/```[\s\S]*?```/g, '')          // Remove code blocks
                .replace(/`[^`]*`/g, '')                 // Remove inline code
                .replace(/^#+\s+.*/gm, '')              // Remove headings
                .replace(/^!?\[.*?\].*$/gm, '')         // Remove images and links
                .replace(/^\s*[-*•]\s+.*/gm, '')        // Remove bullet points
                .trim();
            return text.length >= 100;
        }
    },
    {
        id: 'installation',
        name: 'Installation',
        points: 20,
        test: (readme) => {
            // Check for headings with install/setup/getting started/quick start/download keywords
            if (/^#+\s+(install|installation|setup|getting\s+started|quick\s+start|download)/mi.test(readme)) {
                return true;
            }
            
            // Check for code blocks with package manager commands
            if (/```[\s\S]*?(npm\s+install|yarn\s+add|pip\s+install|composer\s+require|git\s+clone)/mi.test(readme)) {
                return true;
            }
            
            // Check for CDN includes (link or script tags)
            if (/<link[^>]*href=[^>]*>|<script[^>]*src=[^>]*>/i.test(readme)) {
                return true;
            }
            
            return false;
        }
    },
    {
        id: 'usage',
        name: 'Usage',
        points: 20,
        test: (readme) => {
            // Look for headings with usage/how to use/quick start/example keywords
            return /^#+\s+(usage|how\s+to\s+use|quick\s+start|example)/mi.test(readme);
        }
    },
    {
        id: 'screenshots',
        name: 'Screenshots',
        points: 15,
        test: (readme) => {
            // Look for markdown images or HTML img tags
            return /!\[[\s\S]*?\]\(/.test(readme) || /<img[^>]*>/i.test(readme);
        }
    },
    {
        id: 'license',
        name: 'License',
        points: 10,
        test: (readme) => {
            // Look for heading with license keyword, or common license badges/names
            return /^#+\s+.*license|license\s*badge|mit\s+license|apache\s+license|gpl|bsd\s+license/mi.test(readme);
        }
    },
    {
        id: 'contributing',
        name: 'Contributing',
        points: 10,
        test: (readme) => {
            // Look for heading with contribut keyword
            return /^#+\s+.*contribut/mi.test(readme);
        }
    }
];

// ============================================
// Score Calculation Function
// ============================================

/**
 * Score a README text
 * Returns { score, results } where results is array of {id, name, points, found}
 */
function scoreReadme(readme) {
    if (!readme || typeof readme !== 'string') {
        return { score: 0, results: [] };
    }

    // Run each check and collect results
    const results = scoringChecks.map(check => {
        const found = check.test(readme);
        return {
            id: check.id,
            name: check.name,
            points: check.points,
            found: found
        };
    });

    // Calculate total score as sum of found checks only
    const score = results.reduce((sum, r) => sum + (r.found ? r.points : 0), 0);

    return { score, results };
}

// ============================================
// Markdown Templates
// ============================================

const templates = {
    title: {
        name: 'Title',
        description: 'A clear, descriptive project title',
        template: `# Project Name

Brief one-liner description of what your project does.`
    },
    description: {
        name: 'Description',
        description: 'Detailed project overview and purpose',
        template: `## About This Project

This project aims to... [Describe your project's purpose and key features]

### Key Features
- Feature 1
- Feature 2
- Feature 3`
    },
    installation: {
        name: 'Installation',
        description: 'Step-by-step setup instructions',
        template: `## Installation

### Prerequisites
- Requirement 1
- Requirement 2

### Steps
1. Clone the repository
   \`\`\`bash
   git clone https://github.com/username/repo.git
   cd repo
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   # or
   pip install -r requirements.txt
   \`\`\`

3. Configure (if needed)
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your settings
   \`\`\``
    },
    usage: {
        name: 'Usage',
        description: 'How to use your project with examples',
        template: `## Usage

### Basic Example
\`\`\`bash
npm start
# or
python app.py
\`\`\`

### Advanced Examples
\`\`\`python
from mymodule import MyClass

obj = MyClass()
obj.do_something()
\`\`\`

For more examples, see the [examples](./examples) directory.`
    },
    screenshots: {
        name: 'Screenshots',
        description: 'Visual examples of your project',
        template: `## Screenshots

### Main Interface
![Main Interface](./screenshots/main.png)

### Feature Demo
![Feature Demo](./screenshots/feature.png)

### Additional Views
![Additional Views](./screenshots/additional.png)`
    },
    license: {
        name: 'License',
        description: 'Project license information',
        template: `## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`
    },
    contributing: {
        name: 'Contributing',
        description: 'Guidelines for contributing to the project',
        template: `## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

### Code Style
- Follow the existing code style
- Add tests for new features
- Update documentation as needed`
    }
};

// ============================================
// DOM Elements
// ============================================

const repoInput = document.getElementById('repoUrl');
const analyzeBtn = document.getElementById('analyzeBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const scoreValue = document.getElementById('scoreValue');
const scoreTitle = document.getElementById('scoreTitle');
const checklist = document.getElementById('checklist');
const templatesSection = document.getElementById('templatesSection');
const templates_container = document.getElementById('templates');
const repoInfo = document.getElementById('repoInfo');
const exampleLinks = document.querySelectorAll('.example-link');

// Comparison elements
const comparisonSection = document.getElementById('comparisonSection');
const improvedReadme = document.getElementById('improvedReadme');
const compareBtn = document.getElementById('compareBtn');
const comparisonResults = document.getElementById('comparisonResults');
const oldScoreDisplay = document.getElementById('oldScoreDisplay');
const newScoreDisplay = document.getElementById('newScoreDisplay');
const scoreImprovement = document.getElementById('scoreImprovement');
const newlySections = document.getElementById('newlySections');

// Store current analysis results for comparison
let currentAnalysisResults = null;
let currentScore = 0;

// Modal elements
const modal = document.getElementById('templateModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// ============================================
// Event Listeners
// ============================================

analyzeBtn.addEventListener('click', handleAnalyze);
repoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAnalyze();
});

compareBtn.addEventListener('click', handleCompare);

exampleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        repoInput.value = link.dataset.url;
        handleAnalyze();
    });
});

modalClose.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ============================================
// Main Analysis Function
// ============================================

async function handleAnalyze() {
    const url = repoInput.value.trim();

    // Validate input
    if (!url) {
        showError('Please enter a GitHub repository URL');
        return;
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
        showError('Invalid GitHub URL. Format: https://github.com/owner/repo or owner/repo');
        return;
    }

    const { owner, repo } = parsed;

    // IMPORTANT: Clear all old state before fetching new data
    resultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
    checklist.innerHTML = '';
    templates_container.innerHTML = '';
    templatesSection.classList.add('hidden');
    repoInfo.innerHTML = '';

    // Disable button and show loading state
    analyzeBtn.disabled = true;

    try {
        // Fetch README from GitHub API
        const readmeText = await fetchReadme(owner, repo);

        // Score the README using the data-driven array
        const { score, results } = scoreReadme(readmeText);

        // Console logging for debugging
        console.log(`📦 Repo: ${owner}/${repo}`);
        console.log(`📄 README length: ${readmeText.length} characters`);
        console.log(`📝 First 150 chars: ${readmeText.substring(0, 150)}`);
        console.log('🔍 Section Results:');
        results.forEach(r => {
            console.log(`  ${r.name}: ${r.found ? '✓ FOUND' : '✗ MISSING'} (${r.points} points)`);
        });
        console.log(`✅ TOTAL SCORE: ${score}/100`);

        // Display results
        displayResults(score, results, owner, repo, readmeText);

    } catch (error) {
        showError(error.message);
    } finally {
        analyzeBtn.disabled = false;
    }
}

// ============================================
// GitHub API Functions
// ============================================

/**
 * Parse GitHub URL into owner and repo
 * Accepts multiple formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/
 * - https://github.com/owner/repo.git
 * - https://github.com/owner/repo/tree/main
 * - owner/repo
 */
function parseGitHubUrl(url) {
    let match;

    // Try to match full GitHub URLs
    match = url.match(/github\.com\/([^\/]+)\/([^\/\s]+?)(?:\.git)?(?:\/.*)?$/i);
    if (match) {
        return { owner: match[1], repo: match[2] };
    }

    // Try to match short format (owner/repo)
    match = url.match(/^([^\/]+)\/([^\/\s]+)$/);
    if (match) {
        return { owner: match[1], repo: match[2] };
    }

    return null;
}

/**
 * Fetch README content from GitHub API
 * Uses raw content endpoint, never uses fallback/sample data
 * If fetch fails, throws error with clear message
 */
async function fetchReadme(owner, repo) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.raw'
            },
            cache: 'no-store'  // Always fetch fresh data
        });

        if (response.status === 404) {
            throw new Error('❌ Repository not found or has no README file');
        }

        if (response.status === 403) {
            throw new Error('❌ GitHub API rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
            throw new Error(`❌ GitHub API error: ${response.statusText}`);
        }

        const content = await response.text();
        if (!content || content.trim().length === 0) {
            throw new Error('❌ README file is empty');
        }

        return content;

    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('❌ Network error: Unable to reach GitHub API. Check your internet connection.');
        }
        throw error;
    }
}

// ============================================
// Display Functions
// ============================================

/**
 * Display analysis results
 * results = array of {id, name, points, found}
 */
function displayResults(score, results, owner, repo, readmeText) {
    // Update score circle
    updateScoreCircle(score);
    updateScoreTitle(score);

    // Update checklist with actual results
    updateChecklist(results);

    // Show templates for missing sections
    showMissingTemplates(results);

    // Show repo info with length and preview
    const readmePreview = readmeText.substring(0, 150).replace(/\n/g, ' ').trim();
    const repoInfoText = `
        <strong>Repository:</strong> ${owner}/${repo}<br/>
        <strong>README Length:</strong> ${readmeText.length.toLocaleString()} characters<br/>
        <strong>Preview:</strong> "${readmePreview}..."<br/>
        <strong>Score Breakdown:</strong> Total = ${results.reduce((sum, r) => sum + (r.found ? r.points : 0), 0)}/100
    `;
    repoInfo.innerHTML = repoInfoText;

    // Store current analysis for comparison
    currentAnalysisResults = results;
    currentScore = score;

    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Show comparison section
    comparisonSection.classList.remove('hidden');
    
    // Reset comparison input and hide previous results
    improvedReadme.value = '';
    comparisonResults.classList.add('hidden');

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Update the animated score circle
 */
function updateScoreCircle(score) {
    scoreValue.textContent = score;
    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    // Calculate offset based on score (out of 100)
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Change color based on score
    if (score >= 80) {
        circle.style.stroke = 'var(--success-color)';
    } else if (score >= 60) {
        circle.style.stroke = 'var(--primary-color)';
    } else if (score >= 40) {
        circle.style.stroke = 'var(--warning-color)';
    } else {
        circle.style.stroke = 'var(--danger-color)';
    }
}

/**
 * Update score title based on score
 */
function updateScoreTitle(score) {
    let rating, ratingClass;
    if (score >= 80) {
        rating = 'Excellent!';
        ratingClass = 'excellent';
    } else if (score >= 60) {
        rating = 'Good Work!';
        ratingClass = 'good';
    } else if (score >= 40) {
        rating = 'Fair. Keep Going!';
        ratingClass = 'fair';
    } else {
        rating = 'Needs Work';
        ratingClass = 'poor';
    }
    
    scoreTitle.textContent = rating;
    scoreTitle.className = `score-title ${ratingClass}`;
}

/**
 * Update checklist with actual results
 * results = array of {id, name, points, found}
 */
function updateChecklist(results) {
    checklist.innerHTML = '';

    // Calculate total for visual verification
    const totalScore = results.reduce((sum, r) => sum + (r.found ? r.points : 0), 0);

    results.forEach(r => {
        const item = document.createElement('div');
        item.className = 'checklist-item';
        item.innerHTML = `
            <div class="checklist-icon ${r.found ? 'present' : 'missing'}">
                ${r.found ? '✓' : '✕'}
            </div>
            <div class="checklist-item-content">
                <div class="checklist-item-title">${r.name}</div>
                <div class="checklist-item-score ${r.found ? 'present' : 'missing'}">
                    ${r.found ? `+${r.points} points` : 'Missing'}
                </div>
            </div>
        `;
        checklist.appendChild(item);
    });

    // Add total row
    const totalItem = document.createElement('div');
    totalItem.className = 'checklist-item';
    totalItem.style.borderTop = '2px solid var(--border-color)';
    totalItem.style.marginTop = '1rem';
    totalItem.style.paddingTop = '1rem';
    totalItem.innerHTML = `
        <div class="checklist-item-content">
            <div class="checklist-item-title">Total Score</div>
            <div class="checklist-item-score" style="font-weight: bold; color: var(--primary-color); font-size: 1.1rem;">
                ${totalScore}/100 points
            </div>
        </div>
    `;
    checklist.appendChild(totalItem);
}

/**
 * Show templates for missing sections
 */
function showMissingTemplates(results) {
    const missing = results.filter(r => !r.found);

    if (missing.length === 0) {
        templatesSection.classList.add('hidden');
        return;
    }

    templates_container.innerHTML = '';
    templatesSection.classList.remove('hidden');

    missing.forEach(r => {
        const template = templates[r.id];
        if (!template) return;

        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="template-card-title">${template.name}</div>
            <div class="template-card-description">${template.description}</div>
            <div class="template-card-buttons">
                <button class="btn btn-primary btn-small view-template" data-section="${r.id}">
                    View Template
                </button>
                <button class="btn btn-secondary btn-small copy-template" data-section="${r.id}">
                    Copy
                </button>
            </div>
        `;
        templates_container.appendChild(card);
    });

    // Add event listeners to template buttons
    document.querySelectorAll('.view-template').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = e.target.dataset.section;
            showTemplateModal(sectionId);
        });
    });

    document.querySelectorAll('.copy-template').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = e.target.dataset.section;
            copyToClipboard(templates[sectionId].template, `${templates[sectionId].name} copied!`);
        });
    });
}

// ============================================
// Modal Functions
// ============================================

function showTemplateModal(sectionId) {
    const template = templates[sectionId];
    modalTitle.textContent = `${template.name} Template`;
    modalBody.textContent = template.template;

    modalCopyBtn.onclick = () => {
        copyToClipboard(template.template, `${template.name} template copied!`);
    };

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// ============================================
// Utility Functions
// ============================================

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = event.target.textContent;
        event.target.textContent = '✓ Copied!';
        event.target.style.opacity = '0.7';

        setTimeout(() => {
            event.target.textContent = originalText;
            event.target.style.opacity = '1';
        }, 2000);
    }).catch(() => {
        showError('Failed to copy to clipboard');
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// ============================================
// Comparison Function
// ============================================

/**
 * Handle comparison of improved README with original
 */
function handleCompare() {
    const improvedText = improvedReadme.value.trim();
    
    if (!improvedText) {
        showError('Please paste an improved README to compare');
        return;
    }
    
    // Score the improved README
    const { score: newScore, results: newResults } = scoreReadme(improvedText);
    
    // Calculate improvement
    const improvement = newScore - currentScore;
    
    // Find newly added sections (sections that went from missing to found)
    const newlyAdded = newResults.filter(newResult => {
        const oldResult = currentAnalysisResults.find(r => r.id === newResult.id);
        return newResult.found && !oldResult.found;
    });
    
    // Display comparison results
    displayComparison(currentScore, newScore, improvement, newlyAdded);
}

/**
 * Display comparison results
 */
function displayComparison(oldScore, newScore, improvement, newlyAdded) {
    // Update display values
    oldScoreDisplay.textContent = `${oldScore}/100`;
    newScoreDisplay.textContent = `${newScore}/100`;
    
    // Update improvement display
    if (improvement > 0) {
        scoreImprovement.textContent = `+${improvement}`;
        scoreImprovement.style.color = 'var(--success-color)';
        scoreImprovement.style.borderColor = 'var(--success-color)';
    } else if (improvement === 0) {
        scoreImprovement.textContent = 'No change';
        scoreImprovement.style.color = 'var(--text-secondary)';
        scoreImprovement.style.borderColor = 'var(--text-secondary)';
    } else {
        scoreImprovement.textContent = `${improvement}`;
        scoreImprovement.style.color = 'var(--warning-color)';
        scoreImprovement.style.borderColor = 'var(--warning-color)';
    }
    
    // Display newly added sections
    if (newlyAdded.length > 0) {
        newlySections.innerHTML = '';
        newlyAdded.forEach(section => {
            const item = document.createElement('div');
            item.className = 'newly-section-item';
            item.innerHTML = `
                <span class="newly-section-name">${section.name}</span>
                <span class="newly-section-points">+${section.points}</span>
            `;
            newlySections.appendChild(item);
        });
    } else {
        newlySections.innerHTML = '<p class="no-changes">No new sections added</p>';
    }
    
    // Show results
    comparisonResults.classList.remove('hidden');
    
    // Scroll to comparison results
    setTimeout(() => {
        comparisonResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Focus input on page load
window.addEventListener('load', () => {
    repoInput.focus();
});
