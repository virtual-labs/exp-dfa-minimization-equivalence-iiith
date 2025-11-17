// DFA Minimization and Equivalence Experiment - Main Logic

// Global state
let currentExample = 0;
let currentPhase = 'dfa-a'; // 'dfa-a' or 'dfa-b'
let dfaAStep = 0;
let dfaBStep = 0;
let userScore = 0;
let selectedChoice = null;
let isSimulationRunning = false;
let dfaACompleted = false;
let dfaBCompleted = false;

// Initialize the experiment
document.addEventListener('DOMContentLoaded', function() {
    initializeExperiment();
    setupEventListeners();
});

function initializeExperiment() {
    currentExample = 0;
    currentPhase = 'dfa-a';
    dfaAStep = 0;
    dfaBStep = 0;
    userScore = 0;
    selectedChoice = null;
    isSimulationRunning = false;
    dfaACompleted = false;
    dfaBCompleted = false;
    
    // Load first example
    loadExample(currentExample);
    updateUI();
}

function setupEventListeners() {
    // Button event listeners
    document.getElementById('start-btn').addEventListener('click', startSimulation);
    document.getElementById('reset-btn').addEventListener('click', resetSimulation);
    document.getElementById('next-example-btn').addEventListener('click', nextExample);
    document.getElementById('prev-example-btn').addEventListener('click', previousExample);
    document.getElementById('submit-choice-btn').addEventListener('click', submitChoice);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    
    // Choice selection listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('action-choice')) {
            selectChoice(e.target);
        }
    });
}

function loadExample(exampleIndex) {
    if (exampleIndex < 0 || exampleIndex >= window.dfaExamples.length) {
        return;
    }
    
    const example = window.dfaExamples[exampleIndex];
    
    // Update display
    document.getElementById('example-title').textContent = example.title;
    document.getElementById('test-string').textContent = example.testString;
    
    // Reset progress
    dfaAStep = 0;
    dfaBStep = 0;
    currentPhase = 'dfa-a';
    selectedChoice = null;
    dfaACompleted = false;
    dfaBCompleted = false;
    
    // Visualize DFAs
    visualizeDFA('dfa-a-canvas', example.dfaA);
    visualizeDFA('dfa-b-canvas', example.dfaB);
    
    // Initialize trace containers
    initializeTraceContainers();
    
    // Update UI
    updateUI();
}

function initializeTraceContainers() {
    const dfaATrace = document.getElementById('dfa-a-trace');
    const dfaBTrace = document.getElementById('dfa-b-trace');
    
    dfaATrace.innerHTML = '<li>Click Start to begin DFA A minimization</li>';
    dfaBTrace.innerHTML = '<li>Waiting for DFA A to complete...</li>';
}

function startSimulation() {
    if (isSimulationRunning) {
        return;
    }
    
    isSimulationRunning = true;
    currentPhase = 'dfa-a';
    dfaAStep = 0;
    dfaBStep = 0;
    selectedChoice = null;
    dfaACompleted = false;
    dfaBCompleted = false;
    
    // Show first step
    showCurrentStep();
    updateUI();
}

function resetSimulation() {
    isSimulationRunning = false;
    currentPhase = 'dfa-a';
    dfaAStep = 0;
    dfaBStep = 0;
    selectedChoice = null;
    dfaACompleted = false;
    dfaBCompleted = false;
    
    // Clear traces and choices
    initializeTraceContainers();
    clearChoices();
    clearResult();
    updateUI();
}

function nextExample() {
    if (currentExample < window.dfaExamples.length - 1) {
        currentExample++;
        resetSimulation();
        loadExample(currentExample);
    }
}

function previousExample() {
    if (currentExample > 0) {
        currentExample--;
        resetSimulation();
        loadExample(currentExample);
    }
}

function showCurrentStep() {
    const example = window.dfaExamples[currentExample];
    
    if (currentPhase === 'dfa-a' && !dfaACompleted) {
        const step = example.dfaASteps[dfaAStep];
        if (!step) {
            completeDFAA();
            return;
        }
        showStepForDFA('A', step, dfaAStep);
    } else if (currentPhase === 'dfa-b' && !dfaBCompleted) {
        const step = example.dfaBSteps[dfaBStep];
        if (!step) {
            completeDFAB();
            return;
        }
        showStepForDFA('B', step, dfaBStep);
    } else {
        showEquivalenceResult();
    }
}

function showStepForDFA(dfaLabel, step, stepIndex) {
    // Update current derivation
    document.getElementById('current-step').textContent = 
        `Step ${stepIndex + 1}: ${step.description} (DFA ${dfaLabel})`;
    
    // Highlight active DFA panel
    updateDFAPanelHighlights(dfaLabel);
    
    // Show choices for current step
    showChoices(step.choices);
    
    // Update trace for current DFA
    updateTrace(dfaLabel, step, stepIndex, 'current');
}

function updateDFAPanelHighlights(activeDFA) {
    const dfaAPanel = document.querySelector('.panel.steps-panel:first-child');
    const dfaBPanel = document.querySelector('.panel.steps-panel:last-child');
    
    if (dfaAPanel) dfaAPanel.classList.toggle('active', activeDFA === 'A');
    if (dfaBPanel) dfaBPanel.classList.toggle('active', activeDFA === 'B');
}

function updateTrace(dfaLabel, step, stepIndex, status) {
    const traceId = dfaLabel === 'A' ? 'dfa-a-trace' : 'dfa-b-trace';
    const traceContainer = document.getElementById(traceId);
    
    if (!traceContainer) return;
    
    // Get or create trace item
    let traceItem = traceContainer.children[stepIndex];
    if (!traceItem) {
        traceItem = document.createElement('li');
        traceContainer.appendChild(traceItem);
    }
    
    // Update content and status
    traceItem.textContent = `${step.description}: ${step.result || 'In progress...'}`;
    traceItem.className = status; // 'current', 'completed', or ''
    
    // Scroll to current item
    if (status === 'current') {
        traceItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showChoices(choices) {
    const actionChoicesContainer = document.getElementById('action-choices');
    if (!actionChoicesContainer) return;
    
    actionChoicesContainer.innerHTML = '';
    
    choices.forEach((choice, index) => {
        const choiceElement = document.createElement('button');
        choiceElement.className = 'action-choice';
        choiceElement.textContent = choice.text;
        choiceElement.dataset.index = index;
        choiceElement.addEventListener('click', () => selectChoice(choiceElement));
        actionChoicesContainer.appendChild(choiceElement);
    });
}

function selectChoice(choiceElement) {
    // Remove previous selection
    document.querySelectorAll('.action-choice').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Select current choice
    choiceElement.classList.add('selected');
    selectedChoice = parseInt(choiceElement.dataset.index);
    
    // Enable submit button
    const submitBtn = document.getElementById('submit-choice-btn');
    if (submitBtn) submitBtn.disabled = false;
}

function submitChoice() {
    if (selectedChoice === null) {
        return;
    }
    
    const example = window.dfaExamples[currentExample];
    let step, stepIndex;
    
    if (currentPhase === 'dfa-a') {
        step = example.dfaASteps[dfaAStep];
        stepIndex = dfaAStep;
    } else {
        step = example.dfaBSteps[dfaBStep];
        stepIndex = dfaBStep;
    }
    
    const choice = step.choices[selectedChoice];
    const isCorrect = choice.correct;
    
    // Update score
    if (isCorrect) {
        userScore++;
    }
    
    // Update step result
    step.result = choice.text;
    
    // Update trace
    const dfaLabel = currentPhase === 'dfa-a' ? 'A' : 'B';
    updateTrace(dfaLabel, step, stepIndex, 'completed');
    
    // Show feedback
    showFeedback(isCorrect, choice.explanation);
    
    // Move to next step after delay
    setTimeout(() => {
        nextStep();
    }, 1500);
}

function nextStep() {
    if (currentPhase === 'dfa-a' && !dfaACompleted) {
        dfaAStep++;
        if (dfaAStep >= window.dfaExamples[currentExample].dfaASteps.length) {
            completeDFAA();
        } else {
            selectedChoice = null;
            showCurrentStep();
            updateUI();
        }
    } else if (currentPhase === 'dfa-b' && !dfaBCompleted) {
        dfaBStep++;
        if (dfaBStep >= window.dfaExamples[currentExample].dfaBSteps.length) {
            completeDFAB();
        } else {
            selectedChoice = null;
            showCurrentStep();
            updateUI();
        }
    }
}

function completeDFAA() {
    dfaACompleted = true;
    currentPhase = 'dfa-b';
    selectedChoice = null;
    
    // Update DFA B trace to show it's ready
    const dfaBTrace = document.getElementById('dfa-b-trace');
    if (dfaBTrace) {
        dfaBTrace.innerHTML = '<li>Ready to begin DFA B minimization...</li>';
    }
    
    showCurrentStep();
    updateUI();
}

function completeDFAB() {
    dfaBCompleted = true;
    updateUI();
}

function showFeedback(isCorrect, explanation) {
    // Show feedback in current step area temporarily
    const currentStepElement = document.getElementById('current-step');
    if (!currentStepElement) return;
    
    const originalText = currentStepElement.textContent;
    
    currentStepElement.innerHTML = `
        <span style="color: ${isCorrect ? '#10b981' : '#ef4444'}">
            ${isCorrect ? '✓ Correct!' : '✗ Incorrect'} ${explanation}
        </span>
    `;
    
    // Update choice visual feedback
    document.querySelectorAll('.action-choice').forEach((el, index) => {
        if (index === selectedChoice) {
            el.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        el.disabled = true;
    });
    
    // Restore original text after delay
    setTimeout(() => {
        currentStepElement.textContent = originalText;
    }, 1500);
}

function showEquivalenceResult() {
    const example = window.dfaExamples[currentExample];
    const currentStepElement = document.getElementById('current-step');
    
    if (!currentStepElement) return;
    
    // Update current step to show result
    currentStepElement.innerHTML = `
        <div class="equivalence-result ${example.equivalent ? 'equivalent' : 'not-equivalent'}">
            <div class="result-icon">${example.equivalent ? '✓' : '✗'}</div>
            <div class="result-text">
                DFAs are ${example.equivalent ? 'Equivalent' : 'Not Equivalent'}
            </div>
            <div class="result-detail">
                ${example.explanation}
            </div>
        </div>
    `;
    
    // Clear choices
    clearChoices();
    
    // Stop simulation
    isSimulationRunning = false;
    updateUI();
}

function showHint() {
    const example = window.dfaExamples[currentExample];
    let step;
    
    if (currentPhase === 'dfa-a' && !dfaACompleted) {
        step = example.dfaASteps[dfaAStep];
    } else if (currentPhase === 'dfa-b' && !dfaBCompleted) {
        step = example.dfaBSteps[dfaBStep];
    }
    
    if (step && step.hint) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Hint',
                text: step.hint,
                icon: 'info',
                confirmButtonText: 'Got it!'
            });
        } else {
            alert(step.hint);
        }
    }
}

function clearChoices() {
    const actionChoicesContainer = document.getElementById('action-choices');
    if (actionChoicesContainer) {
        actionChoicesContainer.innerHTML = '';
    }
    
    const submitBtn = document.getElementById('submit-choice-btn');
    if (submitBtn) submitBtn.disabled = true;
}

function clearResult() {
    const currentStepElement = document.getElementById('current-step');
    if (currentStepElement) {
        currentStepElement.textContent = 'Click Start to begin minimization';
    }
}

function updateUI() {
    const isRunning = isSimulationRunning;
    const hasExample = currentExample >= 0 && currentExample < window.dfaExamples.length;
    
    // Update button states
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-choice-btn');
    const hintBtn = document.getElementById('hint-btn');
    const prevBtn = document.getElementById('prev-example-btn');
    const nextBtn = document.getElementById('next-example-btn');
    
    if (startBtn) startBtn.disabled = isRunning || !hasExample;
    if (resetBtn) resetBtn.disabled = !isRunning;
    if (submitBtn) submitBtn.disabled = selectedChoice === null;
    if (hintBtn) hintBtn.disabled = !isRunning;
    if (prevBtn) prevBtn.disabled = currentExample <= 0;
    if (nextBtn) nextBtn.disabled = currentExample >= window.dfaExamples.length - 1;
    
    // Update example counter
    const exampleCounter = document.getElementById('example-counter');
    if (exampleCounter) {
        exampleCounter.textContent = `Example ${currentExample + 1} of ${window.dfaExamples.length}`;
    }
    
    // Update score
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${userScore}`;
    }
    
    // Update progress indicators
    updateProgressIndicators();
}

function updateProgressIndicators() {
    const example = window.dfaExamples[currentExample];
    if (!example) return;
    
    // Update DFA A progress
    const dfaAProgress = dfaACompleted ? 100 : (dfaAStep / example.dfaASteps.length) * 100;
    const dfaAProgressBar = document.getElementById('dfa-a-progress');
    if (dfaAProgressBar) {
        dfaAProgressBar.style.width = `${dfaAProgress}%`;
    }
    
    // Update DFA B progress
    const dfaBProgress = dfaBCompleted ? 100 : (dfaBStep / example.dfaBSteps.length) * 100;
    const dfaBProgressBar = document.getElementById('dfa-b-progress');
    if (dfaBProgressBar) {
        dfaBProgressBar.style.width = `${dfaBProgress}%`;
    }
    
    // Update overall progress
    const totalSteps = example.dfaASteps.length + example.dfaBSteps.length;
    const completedSteps = dfaAStep + dfaBStep;
    const overallProgress = (completedSteps / totalSteps) * 100;
    
    const overallProgressBar = document.getElementById('overall-progress');
    if (overallProgressBar) {
        overallProgressBar.style.width = `${overallProgress}%`;
    }
}
