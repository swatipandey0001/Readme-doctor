// ============================================
// README Doctor - Test Suite
// ============================================

// Copy of the scoring checks from script.js
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
            let text = readme
                .replace(/```[\s\S]*?```/g, '')
                .replace(/`[^`]*`/g, '')
                .replace(/^#+\s+.*/gm, '')
                .replace(/^!?\[.*?\].*$/gm, '')
                .replace(/^\s*[-*•]\s+.*/gm, '')
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
        test: (readme) => /^#+\s+(usage|how\s+to\s+use|quick\s+start|example)/mi.test(readme)
    },
    {
        id: 'screenshots',
        name: 'Screenshots',
        points: 15,
        test: (readme) => /!\[[\s\S]*?\]\(/.test(readme) || /<img[^>]*>/i.test(readme)
    },
    {
        id: 'license',
        name: 'License',
        points: 10,
        test: (readme) => /^#+\s+.*license|license\s*badge|mit\s+license|apache\s+license|gpl|bsd\s+license/mi.test(readme)
    },
    {
        id: 'contributing',
        name: 'Contributing',
        points: 10,
        test: (readme) => /^#+\s+.*contribut/mi.test(readme)
    }
];

/**
 * Score a README text
 */
function scoreReadme(readme) {
    if (!readme || typeof readme !== 'string') {
        return { score: 0, results: [] };
    }

    const results = scoringChecks.map(check => {
        const found = check.test(readme);
        return {
            id: check.id,
            name: check.name,
            points: check.points,
            found: found
        };
    });

    const score = results.reduce((sum, r) => sum + (r.found ? r.points : 0), 0);

    return { score, results };
}

// ============================================
// TEST CASES
// ============================================

const tests = [
    {
        name: 'Test 1: Empty/Minimal README',
        readme: 'hello',
        expectedScore: 0,
        description: 'A README with just "hello" should have almost no score'
    },
    {
        name: 'Test 2: Medium README (Title, Description, Installation, Usage)',
        readme: `# My Project

This is a detailed description of my project. It should have more than 100 characters so that it passes the description check.

## Installation

Run this command to install the project:

\`\`\`bash
npm install
\`\`\`

## Usage

Here's how to use this project:

\`\`\`bash
npm start
\`\`\``,
        expectedScore: 65,
        description: 'Has Title (10) + Description (15) + Installation (20) + Usage (20) = 65'
    },
    {
        name: 'Test 3: Complete README (All sections)',
        readme: `# Complete Project

This is a very detailed description of my complete project. It's designed to showcase all the features you need. I'm including lots of text here to make sure it exceeds 100 characters for the description check. This description will definitely pass the test.

## Installation

To install this project, follow these steps:

\`\`\`bash
git clone https://github.com/user/project.git
cd project
npm install
\`\`\`

## Usage

Here's how to use the project:

\`\`\`bash
npm start
\`\`\`

## Screenshots

![Screenshot 1](./screenshots/main.png)
![Screenshot 2](./screenshots/feature.png)

## License

MIT License - see LICENSE file

## Contributing

Contributions are welcome! Please follow the guidelines in CONTRIBUTING.md`,
        expectedScore: 100,
        description: 'Has all 7 sections = 10 + 15 + 20 + 20 + 15 + 10 + 10 = 100'
    },
    {
        name: 'Test 4: HTML Title Test',
        readme: `<h1 align="center">My App</h1>

This is a detailed description of my application. It has more than 100 characters to pass the description check. The HTML title should be detected and counted in the score.`,
        expectedScore: 25,
        description: 'Has HTML h1 title (10) + Description (15) = 25'
    },
    {
        name: 'Test 5: Quick Start Installation Test',
        readme: `# My Project

This is a detailed description of my project. It should have more than 100 characters so that it passes the description check. The Quick Start section should count as Installation.

## Quick Start

Get started in 3 steps:

\`\`\`bash
npm install
npm run dev
\`\`\``,
        expectedScore: 45,
        description: 'Has Title (10) + Description (15) + Quick Start as Installation (20) = 45'
    }
];

// ============================================
// RUN TESTS
// ============================================

console.log('🧪 README Doctor Test Suite\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
    console.log(`\n${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log('-'.repeat(60));

    const { score, results } = scoreReadme(test.readme);

    console.log(`Input: ${test.readme.length} characters`);
    console.log(`Expected Score: ${test.expectedScore}`);
    console.log(`Actual Score: ${score}`);
    
    console.log('\nDetailed Results:');
    results.forEach(r => {
        const status = r.found ? '✓' : '✗';
        const points = r.found ? `+${r.points}` : '0';
        console.log(`  ${status} ${r.name.padEnd(15)} ${points.padStart(3)} points`);
    });

    // Verify score
    if (score === test.expectedScore) {
        console.log(`\n✅ PASSED: Score is ${score}/100 (expected ${test.expectedScore})`);
        passed++;
    } else {
        console.log(`\n❌ FAILED: Score is ${score}/100 (expected ${test.expectedScore})`);
        failed++;
    }

    console.log('='.repeat(60));
});

// ============================================
// TEST SUMMARY
// ============================================

console.log(`\n📊 TEST SUMMARY`);
console.log(`✅ Passed: ${passed}/${tests.length}`);
console.log(`❌ Failed: ${failed}/${tests.length}`);

if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
} else {
    console.log(`\n⚠️  ${failed} test(s) failed. Review the results above.`);
}
