// State management
let problems = [];
let currentIndex = 0;
let showingAnswer = false;

// DOM elements
const flashcard = document.getElementById('flashcard');
const questionView = document.getElementById('questionView');
const answerView = document.getElementById('answerView');
const gridContainer = document.getElementById('gridContainer');
const equation = document.getElementById('equation');

// Initialize the application
function init() {
    generateProblems();
    shuffleProblems();
    showQuestion();
    setupEventListeners();
}

// Generate all 81 multiplication problems (1×1 to 9×9)
function generateProblems() {
    problems = [];
    for (let multiplicand = 1; multiplicand <= 9; multiplicand++) {
        for (let multiplier = 1; multiplier <= 9; multiplier++) {
            problems.push({
                multiplicand: multiplicand,  // 被乗数 (vertical)
                multiplier: multiplier,      // 乗数 (horizontal)
                answer: multiplicand * multiplier
            });
        }
    }
}

// Shuffle problems using Fisher-Yates algorithm
function shuffleProblems() {
    for (let i = problems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [problems[i], problems[j]] = [problems[j], problems[i]];
    }
}

// Show question (grid visualization)
function showQuestion() {
    showingAnswer = false;
    questionView.classList.add('active');
    answerView.classList.remove('active');

    const problem = problems[currentIndex];
    renderGrid(problem);
}

// Render grid based on multiplicand (rows) and multiplier (columns)
// Fixed 9x9 grid, Origin at Bottom-Left
function renderGrid(problem) {
    gridContainer.innerHTML = '';
    // Ensure container handles absolute positioning
    gridContainer.style.position = 'relative';

    // 1. Create the Cell Grid (Content Layer)
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(9, 1fr)`;
    grid.style.gridTemplateRows = `repeat(9, 1fr)`;

    const startRow = 9 - problem.multiplicand; // Top row of the block
    const endRow = 9;                          // Bottom row
    const startCol = 0;                        // Left col
    const endCol = problem.multiplier;         // Right col (exclusive)

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // Highlight condition:
            if (row >= startRow && col < endCol) {
                cell.classList.add('highlighted');

                // Add internal vertical lines ONLY. 
                // We do NOT add borders to the edges of the block here.
                // We only add a right border if it's NOT the rightmost column of the block.
                if (col < endCol - 1) {
                    cell.classList.add('inner-line');
                }

                // If this is the TOP-RIGHT cell of the highlighted block, add the answer
                if (row === startRow && col === endCol - 1) {
                    const answerLabel = document.createElement('div');
                    answerLabel.className = 'answer-label';
                    answerLabel.textContent = problem.answer;
                    cell.appendChild(answerLabel);
                    cell.style.position = 'relative';
                }
            }

            grid.appendChild(cell);
        }
    }
    gridContainer.appendChild(grid);

    // 2. Create Absolute Outlines (Border Layer)

    // A. 9x9 Grid Outline (Fixed)
    const gridOutline = document.createElement('div');
    gridOutline.className = 'grid-outline';
    gridContainer.appendChild(gridOutline);

    // B. Problem Block Outline (Dynamic)
    const blockOutline = document.createElement('div');
    blockOutline.className = 'block-outline';

    // Calculate geometry
    // Add 20px offset to account for grid-container padding
    const blockTop = 20 + (startRow * 60);
    const blockLeft = 20 + 0;
    const blockWidth = problem.multiplier * 60;
    const blockHeight = problem.multiplicand * 60;

    blockOutline.style.top = `${blockTop}px`;
    blockOutline.style.left = `${blockLeft}px`;
    blockOutline.style.width = `${blockWidth}px`;
    blockOutline.style.height = `${blockHeight}px`;

    gridContainer.appendChild(blockOutline);
}

// Show answer (equation)
function showAnswer() {
    showingAnswer = true;
    questionView.classList.remove('active');
    answerView.classList.add('active');

    const problem = problems[currentIndex];
    equation.textContent = `${problem.multiplicand}×${problem.multiplier}=${problem.answer}`;
}

// Move to next problem
function nextProblem() {
    currentIndex++;

    // If we've completed all 81 problems, reshuffle and restart
    if (currentIndex >= problems.length) {
        currentIndex = 0;
        shuffleProblems();
    }

    showQuestion();
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            if (!showingAnswer) {
                showAnswer();
            } else {
                nextProblem();
            }
        }
    });

    // Click on flashcard to advance
    flashcard.addEventListener('click', () => {
        if (!showingAnswer) {
            showAnswer();
        } else {
            nextProblem();
        }
    });
}

// Start the application
init();
