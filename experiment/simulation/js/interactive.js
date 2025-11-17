// Interactive functionality for DFA Minimization and Equivalence

class InteractiveController {
  constructor() {
    this.currentExample = 0;
    this.currentPhase = 'dfa1'; // 'dfa1', 'dfa2', 'comparison'
    this.currentStepA = 0; // Current step for DFA A
    this.currentStepB = 0; // Current step for DFA B
    this.currentDFA = 'A'; // Which DFA is currently active: 'A' or 'B'
    this.score = 0;
    this.mistakes = 0;
    this.hintsUsed = 0;
    
    this.completedDFAs = { A: false, B: false };
    
    this.canvas = null;
    this.canvasRight = null;
    this.canvasHelper = null;
    this.canvasHelperRight = null;
    
    this.initializeInterface();
    this.setupEventListeners();
    this.loadExample(0);
  }

  initializeInterface() {
    // Initialize canvas
    this.canvas = document.getElementById('dfa_canvas_left');
    this.canvasRight = document.getElementById('dfa_canvas_right');
    
    if (this.canvas) {
      this.canvasHelper = new CanvasHelper(this.canvas);
      // Set canvas size
      this.canvas.width = 600;
      this.canvas.height = 400;
    }
    
    if (this.canvasRight) {
      this.canvasHelperRight = new CanvasHelper(this.canvasRight);
      // Set canvas size
      this.canvasRight.width = 600;
      this.canvasRight.height = 400;
    }
    
    // Initialize UI elements
    this.updateStatus('Ready to start DFA minimization');
    this.updatePhaseDisplay();
    this.updateScoreDisplay();
  }

  setupEventListeners() {
    // Control buttons
    document.getElementById('change_dfas').addEventListener('click', () => this.changeDFAs());
    document.getElementById('reset_experiment').addEventListener('click', () => this.resetExperiment());
    document.getElementById('prev_step').addEventListener('click', () => this.previousStep());
    // Button event listeners - use existing button IDs from HTML
    const showHintBtn = document.getElementById('show_hint');
    if (showHintBtn) {
      showHintBtn.addEventListener('click', () => this.showHint());
    }
    document.getElementById('auto_step').addEventListener('click', () => this.autoStep());
    
    // Canvas click events for state selection
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  loadExample(index) {
    if (index >= dfaExamples.length) index = 0;
    
    this.currentExample = index;
    this.currentStepA = 0;
    this.currentStepB = 0;
    this.currentDFA = 'A';
    this.completedDFAs = { A: false, B: false };
    this.score = 0;
    this.mistakes = 0;
    this.hintsUsed = 0;
    
    const example = dfaExamples[this.currentExample];
    this.updateStatus(`Loaded: ${example.name} - Starting with DFA A`);
    
    // Print transition tables to console
    console.clear();
    console.log(`\n🔍 LOADED EXAMPLE ${index + 1}: ${example.name}`);
    console.log(`📝 Description: ${example.description}`);
    
    DFAAnalyzer.printTransitionTable(example.dfa1, `${example.dfa1.name || 'DFA A'}`);
    DFAAnalyzer.printTransitionTable(example.dfa2, `${example.dfa2.name || 'DFA B'}`);
    
    console.log(`\n🎯 Expected Result: ${example.isEquivalent ? 'EQUIVALENT' : 'NOT EQUIVALENT'}`);
    if (example.equivalenceExplanation) {
      console.log(`💡 Explanation: ${example.equivalenceExplanation}`);
    }
    
    // Draw both DFAs initially
    if (this.canvasHelper) {
      // For DFA A in Example 1, if we're past step 0, hide eliminated states
      if (this.currentExample === 0 && this.currentStepA > 0) {
        this.canvasHelper.drawDFA(example.dfa1, [], ["q3", "q4"]);
      } else {
        this.canvasHelper.drawDFA(example.dfa1);
      }
    }
    if (this.canvasHelperRight) {
      this.canvasHelperRight.drawDFA(example.dfa2);
    }
    
    this.updateUI();
    this.generateCurrentStepChoices();
  }

  resetProgress() {
    this.dfa1Progress = {
      completed: false,
      steps: [],
      currentPartitions: []
    };
    
    this.dfa2Progress = {
      completed: false,
      steps: [],
      currentPartitions: []
    };
    
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.currentStep = 0;
    
    this.updateScoreDisplay();
    this.updateResultsDisplay();
  }

  initializePartitioningSteps(dfa, phase) {
    const progress = phase === 'dfa1' ? this.dfa1Progress : this.dfa2Progress;
    
    // Get initial partition
    progress.currentPartitions = DFAAnalyzer.getInitialPartition(dfa);
    progress.steps = [{
      step: 1,
      description: "Initial partition: separate accepting and non-accepting states",
      partitions: [...progress.currentPartitions],
      explanation: "Start by dividing states into accepting and non-accepting groups"
    }];
    
    this.updatePartitioningDisplay();
  }

  generateCurrentStepChoices() {
    const choicesContainer = document.getElementById('action_choices_container');
    if (!choicesContainer) {
      console.error('Choices container not found');
      return;
    }
    choicesContainer.innerHTML = '';
    
    const example = dfaExamples[this.currentExample];
    if (!example) return;
    
    // Check if both DFAs are completed
    if (this.completedDFAs.A && this.completedDFAs.B) {
      this.generateEquivalenceChoices();
      return;
    }
    
    // Get current DFA and step
    const currentDFA = this.currentDFA === 'A' ? example.dfa1 : example.dfa2;
    const currentStepIndex = this.currentDFA === 'A' ? this.currentStepA : this.currentStepB;
    const minimizationSteps = currentDFA.minimizationSteps;
    
    if (currentStepIndex >= minimizationSteps.length) {
      // This DFA is completed, switch to the other or finish
      this.completeCurrentDFA();
      return;
    }
    
    const step = minimizationSteps[currentStepIndex];
    
    // Check if step exists
    if (!step) {
      this.showMessage(`No step data found for DFA ${this.currentDFA}. Completing automatically.`, 'info');
      this.completeCurrentDFA();
      return;
    }
    
    this.updateStatus(`DFA ${this.currentDFA} - Step ${currentStepIndex + 1}: ${step.description}`);
    // Visualization will be shown only after correct choice
    
    // Check if step has choices, if not, show a message and complete this DFA
    if (!step.choices || !Array.isArray(step.choices) || step.choices.length === 0) {
      this.showMessage(`No interactive choices available for this step. Completing DFA ${this.currentDFA}.`, 'info');
      this.completeCurrentDFA();
      return;
    }
    
    // Generate choices for this specific step
    step.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.textContent = choice.text;
      button.onclick = () => this.handleChoice(choice, step);
      choicesContainer.appendChild(button);
    });
    
    this.updateStepsDisplay();
    
    // Update highlighting to show which DFA is currently active
    this.updateActiveDFAHighlighting();
  }

  updateActiveDFAHighlighting() {
    // Remove highlighting from both DFA containers
    const leftContainer = document.querySelector('.derivation-column:first-child');
    const rightContainer = document.querySelector('.derivation-column:last-child');
    
    if (leftContainer) leftContainer.classList.remove('active-dfa');
    if (rightContainer) rightContainer.classList.remove('active-dfa');
    
    // Add highlighting to current active DFA
    if (this.currentDFA === 'A' && leftContainer) {
      leftContainer.classList.add('active-dfa');
    } else if (this.currentDFA === 'B' && rightContainer) {
      rightContainer.classList.add('active-dfa');
    }
  }

  showStepVisualization(step) {
    const example = dfaExamples[this.currentExample];
    const currentDFA = this.currentDFA === 'A' ? example.dfa1 : example.dfa2;
    const canvas = this.currentDFA === 'A' ? this.canvasHelper : this.canvasHelperRight;
    
    if (!canvas) return;
    
    // Check if step has visual state information, otherwise use basic rendering
    const visualState = step.visualState || {};
    let eliminatedStates = visualState.eliminatedStates || [];
    const highlightedPartitions = visualState.highlightedPartitions || [];
    
    // For DFA A in Example 1, always keep q3 and q4 eliminated after step 1
    if (this.currentDFA === 'A' && this.currentExample === 0 && this.currentStepA > 0) {
      eliminatedStates = ["q3", "q4"];
    }
    
    // If step has partitions, use them for visualization
    const partitions = step.partitions || [];
    
    // Check if this step has a final DFA to display instead
    if (visualState.finalDFA) {
      // Display the final minimized DFA with proper layout
      const finalDFA = {
        ...visualState.finalDFA,
        layout: {
          "E": { x: 200, y: 150 },
          "O": { x: 400, y: 150 }
        }
      };
      canvas.drawDFA(finalDFA, [], [], []);
    } else {
      canvas.drawDFA(
        currentDFA,
        [], // highlighted states
        eliminatedStates,
        partitions // Use step partitions if available
      );
    }
  }

  handleChoice(choice, step) {
    const choicesContainer = document.getElementById('action_choices_container');
    
    if (choice.correct) {
      this.score += 10;
      
      // Show visualization for this step immediately
      this.showStepVisualization(step);
      this.showMessage('Correct! ' + choice.explanation, 'success');
      
      // Advance to next step
      if (this.currentDFA === 'A') {
        this.currentStepA++;
      } else {
        this.currentStepB++;
      }
      
      // Check if this was the final step for the current DFA
      const example = dfaExamples[this.currentExample];
      const currentDFA = this.currentDFA === 'A' ? example.dfa1 : example.dfa2;
      const currentStepIndex = this.currentDFA === 'A' ? this.currentStepA : this.currentStepB;
      
      if (currentStepIndex >= currentDFA.minimizationSteps.length) {
        // This DFA is completed
        this.completedDFAs[this.currentDFA] = true;
        
        // If this is the final step with finalDFA visualization, don't switch immediately
        if (step.visualState && step.visualState.finalDFA) {
          // Keep the final visualization visible longer
          setTimeout(() => {
            this.completeCurrentDFA();
          }, 3000); // Give more time to see the final result
        } else {
          // Normal completion
          setTimeout(() => {
            this.completeCurrentDFA();
          }, 1500);
        }
      } else {
        // Switch to the other DFA (alternating control) only if current DFA has more steps
        this.switchToOtherDFA();
        
        // Generate next step after a brief delay
        setTimeout(() => {
          this.generateCurrentStepChoices();
        }, 1500);
      }
      
    } else {
      this.mistakes++;
      this.showMessage('Incorrect. ' + choice.explanation, 'error');
      
      // Disable all buttons and highlight the chosen one temporarily
      const buttons = choicesContainer.querySelectorAll('.choice-button');
      buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === choice.text) {
          button.classList.add('incorrect');
        }
      });
      
      // Re-enable the interface after showing the error
      setTimeout(() => {
        this.generateCurrentStepChoices();
      }, 2000);
      
      this.updateScoreDisplay();
      return; // Exit early for incorrect choices
    }
    
    this.updateScoreDisplay();
    
    // For correct choices only - disable all buttons and highlight the chosen one
    const buttons = choicesContainer.querySelectorAll('.choice-button');
    buttons.forEach(button => {
      button.disabled = true;
      if (button.textContent === choice.text) {
        button.classList.add('correct');
      }
    });
  }

  switchToOtherDFA() {
    // Only switch if the other DFA is not completed
    if (this.currentDFA === 'A' && !this.completedDFAs.B) {
      this.currentDFA = 'B';
    } else if (this.currentDFA === 'B' && !this.completedDFAs.A) {
      this.currentDFA = 'A';
    }
    // If both are completed or only one has remaining steps, 
    // we'll handle that in generateCurrentStepChoices
    
    // Update the highlighting to reflect the new active DFA
    this.updateActiveDFAHighlighting();
  }

  completeCurrentDFA() {
    // Mark as completed if not already done
    if (!this.completedDFAs[this.currentDFA]) {
      this.completedDFAs[this.currentDFA] = true;
      this.showMessage(`DFA ${this.currentDFA} minimization completed!`, 'success');
    }
    
    // After completion, keep eliminated states hidden for DFA A (Example 1)
    if (this.currentDFA === 'A' && this.currentExample === 0) {
      const example = dfaExamples[this.currentExample];
      if (this.canvasHelper) {
        this.canvasHelper.drawDFA(
          example.dfa1,
          [], // no highlighted states
          ["q3", "q4"], // keep q3 and q4 eliminated
          [["q0"], ["q1"], ["q2"]] // final partitions
        );
      }
    }
    
    // Switch to the other DFA if it's not completed
    if (this.currentDFA === 'A' && !this.completedDFAs.B) {
      this.currentDFA = 'B';
      setTimeout(() => {
        this.generateCurrentStepChoices();
      }, 2000);
    } else if (this.currentDFA === 'B' && !this.completedDFAs.A) {
      this.currentDFA = 'A';
      setTimeout(() => {
        this.generateCurrentStepChoices();
      }, 2000);
    } else {
      // Both completed, move to equivalence comparison
      setTimeout(() => {
        this.generateEquivalenceChoices();
      }, 2000);
    }
  }

  showMessage(message, type) {
    if (typeof UIHelper !== 'undefined' && UIHelper.showMessage) {
      UIHelper.showMessage(message, type);
    } else if (typeof swal !== 'undefined') {
      swal({
        title: type === 'success' ? "Correct!" : "Incorrect",
        text: message,
        icon: type === 'success' ? "success" : "error"
      });
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  updateStepsDisplay() {
    // Update the steps list for current DFA
    const example = dfaExamples[this.currentExample];
    const listId = this.currentDFA === 'A' ? 'minimization_steps_list_left' : 'minimization_steps_list_right';
    const container = document.getElementById(listId);
    
    if (!container) return;
    
    container.innerHTML = '';
    
    const currentDFA = this.currentDFA === 'A' ? example.dfa1 : example.dfa2;
    const currentStepIndex = this.currentDFA === 'A' ? this.currentStepA : this.currentStepB;
    
    currentDFA.minimizationSteps.forEach((step, index) => {
      const stepDiv = document.createElement('li');
      
      if (index < currentStepIndex) {
        stepDiv.className = 'completed';
        stepDiv.innerHTML = `<strong>✓ Step ${index + 1}:</strong> ${step.description}`;
      } else if (index === currentStepIndex) {
        stepDiv.className = 'current';
        stepDiv.innerHTML = `<strong>→ Step ${index + 1}:</strong> ${step.description}`;
      } else {
        stepDiv.className = 'pending';
        stepDiv.innerHTML = `<strong>Step ${index + 1}:</strong> ${step.description}`;
      }
      
      container.appendChild(stepDiv);
    });
  }

  generateInitialPartitionChoices() {
    const choicesContainer = document.getElementById('action_choices_container');
    if (!choicesContainer) return;
    
    const choices = minimizationChoices.initialPartition;
    
    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.textContent = choice.text;
      button.onclick = () => this.handleChoice(choice, index);
      choicesContainer.appendChild(button);
    });
  }

  generateReachabilityChoices(dfa) {
    const choicesContainer = document.getElementById('action_choices_container');
    if (!choicesContainer) return;
    
    const unreachableStates = DFAAnalyzer.findUnreachableStates(dfa);
    
    if (unreachableStates.length > 0) {
      const choices = minimizationChoices.reachabilityCheck;
      choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.onclick = () => this.handleReachabilityChoice(choice, index, unreachableStates);
        choicesContainer.appendChild(button);
      });
    } else {
      // No unreachable states, proceed to refinement
      this.currentStep = 2;
      this.generateRefinementChoices(dfa, this.currentPhase === 'dfa1' ? this.dfa1Progress : this.dfa2Progress);
    }
  }

  generateRefinementChoices(dfa, progress) {
    const choicesContainer = document.getElementById('action_choices_container');
    if (!choicesContainer) return;
    
    // Check if further refinement is needed
    const canRefine = this.canRefinePartitions(dfa, progress.currentPartitions);
    
    if (canRefine) {
      const choices = minimizationChoices.transitionRefinement;
      choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        button.onclick = () => this.handleRefinementChoice(choice, index, dfa, progress);
        choicesContainer.appendChild(button);
      });
    } else {
      // Minimization complete for this DFA
      this.completeCurrentDFA();
    }
  }

  generateEquivalenceChoices() {
    const choicesContainer = document.getElementById('action_choices_container');
    if (!choicesContainer) return;
    choicesContainer.innerHTML = '';
    
    // Clear highlighting since both DFAs are completed
    const leftContainer = document.querySelector('.derivation-column:first-child');
    const rightContainer = document.querySelector('.derivation-column:last-child');
    if (leftContainer) leftContainer.classList.remove('active-dfa');
    if (rightContainer) rightContainer.classList.remove('active-dfa');
    
    const example = dfaExamples[this.currentExample];
    
    // Automatically determine equivalence and show popup
    this.autoCheckEquivalence();
  }

  autoCheckEquivalence() {
    const example = dfaExamples[this.currentExample];
    
    // Maintain clean visualization for final comparison (remove unreachable states from DFA A in Example 1)
    if (this.currentExample === 0) {
      if (this.canvasHelper) {
        this.canvasHelper.drawDFA(
          example.dfa1,
          [], // no highlighted states
          ["q3", "q4"], // keep q3 and q4 eliminated
          [["q0"], ["q1"], ["q2"]] // final partitions
        );
      }
    }
    
    // Perform actual equivalence test using the algorithm
    const testStrings = window.testStrings || [
      "", "a", "b", "ab", "ba", "aa", "bb", "aba", "bab", "aab", "abb", "baa", "bba"
    ];
    
    console.log(`\n🧪 EQUIVALENCE TEST RESULTS:`);
    console.log(`Test strings used: [${testStrings.slice(0, 10).join(', ')}${testStrings.length > 10 ? '...' : ''}]`);
    
    const equivalenceResult = DFAAnalyzer.testEquivalence(example.dfa1, example.dfa2, testStrings);
    const actuallyEquivalent = equivalenceResult.equivalent;
    
    console.log(`Algorithm result: ${actuallyEquivalent ? 'EQUIVALENT' : 'NOT EQUIVALENT'}`);
    if (!actuallyEquivalent && equivalenceResult.counterexample !== undefined) {
      console.log(`Counterexample found: "${equivalenceResult.counterexample}"`);
      console.log(`  - DFA A result: ${equivalenceResult.dfa1Result}`);
      console.log(`  - DFA B result: ${equivalenceResult.dfa2Result}`);
    }
    
    // Update the status to show completion
    this.updateStatus("Both DFAs minimized! Checking equivalence automatically...");
    
    // Update equivalence status and show final results directly
    this.updateEquivalenceStatus(actuallyEquivalent ? 'Equivalent' : 'Not Equivalent');
    this.showFinalResults();
  }

  handleReachabilityChoice(choice, index, unreachableStates) {
    if (choice.correct) {
      // Remove unreachable states from visualization
      this.canvasHelper.drawDFA(
        this.currentPhase === 'dfa1' ? dfaExamples[this.currentExample].dfa1 : dfaExamples[this.currentExample].dfa2,
        [],
        unreachableStates
      );
      
      this.handleCorrectChoice(choice);
      this.currentStep++;
      this.generateStepChoices();
    } else {
      this.handleIncorrectChoice(choice);
    }
  }

  handleRefinementChoice(choice, index, dfa, progress) {
    if (choice.correct) {
      // Perform refinement
      const newPartitions = DFAAnalyzer.refinePartitions(dfa, progress.currentPartitions);
      
      if (newPartitions.length > progress.currentPartitions.length) {
        progress.currentPartitions = newPartitions;
        progress.steps.push({
          step: progress.steps.length + 1,
          description: "Refined partitions based on transition behavior",
          partitions: [...newPartitions],
          explanation: "Split partitions where states have different transition destinations"
        });
        
        this.updatePartitioningDisplay();
        this.handleCorrectChoice(choice);
      } else {
        // No refinement possible, complete this DFA
        this.completeCurrentDFA();
      }
    } else {
      this.handleIncorrectChoice(choice);
    }
  }

  handleEquivalenceChoice(isEquivalent) {
    const example = dfaExamples[this.currentExample];
    
    // Perform actual equivalence test using the algorithm
    const testStrings = window.testStrings || [
      "", "a", "b", "ab", "ba", "aa", "bb", "aba", "bab", "aab", "abb", "baa", "bba"
    ];
    
    console.log(`\n🧪 EQUIVALENCE TEST RESULTS:`);
    console.log(`Test strings used: [${testStrings.slice(0, 10).join(', ')}${testStrings.length > 10 ? '...' : ''}]`);
    
    const equivalenceResult = DFAAnalyzer.testEquivalence(example.dfa1, example.dfa2, testStrings);
    const actuallyEquivalent = equivalenceResult.equivalent;
    
    console.log(`Algorithm result: ${actuallyEquivalent ? 'EQUIVALENT' : 'NOT EQUIVALENT'}`);
    if (!actuallyEquivalent && equivalenceResult.counterexample !== undefined) {
      console.log(`Counterexample found: "${equivalenceResult.counterexample}"`);
      console.log(`  - DFA A result: ${equivalenceResult.dfa1Result}`);
      console.log(`  - DFA B result: ${equivalenceResult.dfa2Result}`);
    }
    console.log(`Your choice: ${isEquivalent ? 'EQUIVALENT' : 'NOT EQUIVALENT'}`);
    
    const correct = isEquivalent === actuallyEquivalent;
    
    if (correct) {
      this.score += 50;
      const message = actuallyEquivalent 
        ? `Correct! The DFAs are equivalent. ${example.equivalenceExplanation}`
        : `Correct! The DFAs are not equivalent. Counterexample: "${equivalenceResult.counterexample}" - DFA1: ${equivalenceResult.dfa1Result}, DFA2: ${equivalenceResult.dfa2Result}`;
      UIHelper.showMessage(message, 'success');
      this.updateEquivalenceStatus(actuallyEquivalent ? 'Equivalent' : 'Not Equivalent');
      console.log(`✅ CORRECT ANSWER!`);
    } else {
      this.mistakes++;
      const message = actuallyEquivalent 
        ? `Incorrect. The DFAs are actually equivalent. ${example.equivalenceExplanation}`
        : `Incorrect. The DFAs are not equivalent. Counterexample: "${equivalenceResult.counterexample}" - DFA1: ${equivalenceResult.dfa1Result}, DFA2: ${equivalenceResult.dfa2Result}`;
      UIHelper.showMessage(message, 'error');
      console.log(`❌ INCORRECT ANSWER!`);
    }
    
    this.updateScoreDisplay();
    this.showFinalResults();
  }

  showComparisonView() {
    const example = dfaExamples[this.currentExample];
    
    // Get minimized DFAs
    const minimal1 = DFAAnalyzer.minimizeDFA(example.dfa1);
    const minimal2 = DFAAnalyzer.minimizeDFA(example.dfa2);
    
    // Print minimized transition tables to console
    console.log(`\n🔬 MINIMIZED DFAs FOR COMPARISON:`);
    DFAAnalyzer.printTransitionTable(minimal1, `Minimized ${example.dfa1.name || 'DFA A'}`);
    DFAAnalyzer.printTransitionTable(minimal2, `Minimized ${example.dfa2.name || 'DFA B'}`);
    
    // Create layouts for minimized DFAs
    minimal1.layout = this.generateMinimalLayout(minimal1, 'left');
    minimal2.layout = this.generateMinimalLayout(minimal2, 'right');
    
    // Draw minimized DFAs
    if (this.canvasHelper) {
      this.canvasHelper.clear();
      this.canvasHelper.drawDFA(minimal1);
    }
    
    if (this.canvasHelperRight) {
      this.canvasHelperRight.clear();
      this.canvasHelperRight.drawDFA(minimal2);
    }
    
    // Update action text
    const actionText = document.getElementById('current_action_text');
    if (actionText) {
      actionText.textContent = `Compare minimized DFAs: ${minimal1.states.length} states vs ${minimal2.states.length} states`;
    }
  }

  generateMinimalLayout(minimalDFA, side) {
    const layout = {};
    const numStates = minimalDFA.states.length;
    const centerX = side === 'left' ? 300 : 300;
    const centerY = 200;
    const radius = Math.min(120, 200 / numStates);
    
    minimalDFA.states.forEach((state, index) => {
      if (numStates === 1) {
        layout[state] = { x: centerX, y: centerY };
      } else {
        const angle = (2 * Math.PI * index) / numStates;
        layout[state] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      }
    });
    
    return layout;
  }

  changeDFAs() {
    swal({
      title: "Choose DFA Example",
      text: "Select a different pair of DFAs to minimize:",
      icon: "info",
      buttons: {
        example1: {
          text: "Example 1: Simple Equivalent DFAs",
          value: 0
        },
        example2: {
          text: "Example 2: Non-Equivalent DFAs", 
          value: 1
        },
        example3: {
          text: "Example 3: Complex DFAs with Same Minimal Form",
          value: 2
        }
      }
    }).then((value) => {
      if (value !== null) {
        this.loadExample(value);
      }
    });
  }

  resetExperiment() {
    swal({
      title: "Reset Experiment",
      text: "This will restart the current example. Continue?",
      icon: "warning",
      buttons: ["Cancel", "Reset"],
      dangerMode: true
    }).then((willReset) => {
      if (willReset) {
        this.loadExample(this.currentExample);
      }
    });
  }

  showHint() {
    this.hintsUsed++;
    let hintText = '';
    
    if (this.currentStep === 0) {
      hintText = hints.initialPartition;
    } else if (this.currentStep === 1) {
      hintText = hints.reachability;
    } else if (this.currentPhase === 'comparison') {
      hintText = hints.finalCheck;
    } else {
      hintText = hints.refinement;
    }
    
    swal({
      title: "Hint",
      text: hintText,
      icon: "info"
    });
    
    // Deduct points for using hint
    this.score = Math.max(0, this.score - 5);
    this.updateScoreDisplay();
  }

  autoStep() {
    try {
      // Check if both DFAs are completed
      if (this.completedDFAs.A && this.completedDFAs.B) {
        // Move to equivalence comparison using actual algorithm
        const example = dfaExamples[this.currentExample];
        const testStrings = window.testStrings || ["", "a", "b", "ab", "ba"];
        const equivalenceResult = DFAAnalyzer.testEquivalence(example.dfa1, example.dfa2, testStrings);
        this.handleEquivalenceChoice(equivalenceResult.equivalent);
        return;
      }

      // Get current step choices
      const example = dfaExamples[this.currentExample];
      const currentDFA = this.currentDFA === 'A' ? example.dfa1 : example.dfa2;
      const minimizationSteps = currentDFA.minimizationSteps;
      
      // Determine current step for active DFA
      const currentStepIndex = this.currentDFA === 'A' ? this.currentStepA : this.currentStepB;
      
      if (currentStepIndex >= minimizationSteps.length) {
        this.showMessage('No more steps available for current DFA', 'info');
        return;
      }

      const currentStep = minimizationSteps[currentStepIndex];
      
      if (!currentStep || !currentStep.choices || currentStep.choices.length === 0) {
        this.showMessage(`No interactive choices for DFA ${this.currentDFA}. Completing automatically.`, 'info');
        this.completeCurrentDFA();
        return;
      }

      // Find the correct choice (first one marked as correct)
      const correctChoice = currentStep.choices.find(choice => choice.correct);
      
      if (correctChoice) {
        this.handleChoice(correctChoice, currentStep);
        
        // Deduct points for auto step
        this.score = Math.max(0, this.score - 10);
        this.updateScoreDisplay();
        this.showMessage('Auto step completed! Points deducted.', 'info');
      } else {
        this.showMessage('No correct choice found for auto step', 'error');
      }
    } catch (error) {
      console.error('Error in autoStep:', error);
      this.showMessage('Error in auto step: ' + error.message, 'error');
    }
  }

  previousStep() {
    try {
      // Check if we can go back
      const currentStepIndex = this.currentDFA === 'A' ? this.currentStepA : this.currentStepB;
      
      if (currentStepIndex <= 0) {
        // If current DFA is at step 0, try to switch to the other DFA's last step
        if (this.currentDFA === 'A' && this.currentStepB > 0) {
          this.currentDFA = 'B';
          this.currentStepB--;
        } else if (this.currentDFA === 'B' && this.currentStepA > 0) {
          this.currentDFA = 'A';
          this.currentStepA--;
        } else {
          this.showMessage('Already at the beginning!', 'info');
          return;
        }
      } else {
        // Go back one step in current DFA
        if (this.currentDFA === 'A') {
          this.currentStepA--;
        } else {
          this.currentStepB--;
        }
      }
      
      // Reset completion status if we go back
      this.completedDFAs[this.currentDFA] = false;
      
      // Regenerate choices for the new current step
      this.generateCurrentStepChoices();
      this.showMessage('Moved to previous step', 'info');
      
    } catch (error) {
      console.error('Error in previousStep:', error);
      this.showMessage('Error in previous step: ' + error.message, 'error');
    }
  }

  handleCanvasClick(event) {
    // Handle state selection if needed
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked state (if any)
    const example = dfaExamples[this.currentExample];
    const currentDFA = this.currentPhase === 'dfa1' ? example.dfa1 : example.dfa2;
    
    Object.keys(currentDFA.layout).forEach(state => {
      const pos = currentDFA.layout[state];
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      
      if (distance <= 25) {
        // State clicked
        this.highlightState(state);
      }
    });
  }

  highlightState(state) {
    const example = dfaExamples[this.currentExample];
    const currentDFA = this.currentPhase === 'dfa1' ? example.dfa1 : example.dfa2;
    
    // Check if we need to eliminate states for DFA A after step 1
    let eliminatedStates = [];
    if (this.currentExample === 0 && this.currentPhase === 'dfa1' && this.currentStepA > 0) {
      eliminatedStates = ["q3", "q4"];
    }
    
    this.canvasHelper.drawDFA(currentDFA, [state], eliminatedStates);
    
    setTimeout(() => {
      this.canvasHelper.drawDFA(currentDFA, [], eliminatedStates);
    }, 1000);
  }

  updateStatus(message) {
    const statusElement = document.getElementById('current_action_text');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  updateCurrentDFATitle(title) {
    // Update both DFA type displays
    const leftType = document.getElementById('dfa_type_left');
    const rightType = document.getElementById('dfa_type_right');
    
    if (this.currentPhase === 'dfa1' && leftType) {
      leftType.textContent = title;
    } else if (this.currentPhase === 'dfa2' && rightType) {
      rightType.textContent = title;
    }
  }

  updatePhaseDisplay() {
    const phaseElement = document.getElementById('phase_display');
    if (!phaseElement) return;
    
    let phaseText = '';
    
    switch (this.currentPhase) {
      case 'dfa1':
        phaseText = 'Minimizing DFA A';
        break;
      case 'dfa2':
        phaseText = 'Minimizing DFA B';
        break;
      case 'comparison':
        phaseText = 'Comparing Equivalence';
        break;
    }
    
    phaseElement.textContent = phaseText;
  }

  updateUI() {
    this.updateScoreDisplay();
    this.updatePhaseDisplay();
    this.updateCurrentDFAIndicator();
  }

  updateScoreDisplay() {
    const scoreElement = document.getElementById('score_display');
    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  updatePhaseDisplay() {
    const phaseElement = document.getElementById('phase_display');
    if (!phaseElement) return;
    
    if (this.completedDFAs.A && this.completedDFAs.B) {
      phaseElement.textContent = 'Comparing Equivalence';
    } else {
      phaseElement.textContent = 'Minimization in Progress';
    }
  }

  updateCurrentDFAIndicator() {
    const turnElement = document.getElementById('current_turn_display');
    if (turnElement) {
      if (this.completedDFAs.A && this.completedDFAs.B) {
        turnElement.textContent = 'Comparison Phase';
      } else {
        turnElement.textContent = `DFA ${this.currentDFA}`;
      }
    }
    
    // Highlight the active DFA canvas
    const leftType = document.getElementById('dfa_type_left');
    const rightType = document.getElementById('dfa_type_right');
    
    if (leftType && rightType) {
      if (this.currentDFA === 'A') {
        leftType.style.backgroundColor = '#E5F3FF';
        leftType.style.fontWeight = 'bold';
        rightType.style.backgroundColor = '';
        rightType.style.fontWeight = 'normal';
      } else {
        rightType.style.backgroundColor = '#E5F3FF';
        rightType.style.fontWeight = 'bold';
        leftType.style.backgroundColor = '';
        leftType.style.fontWeight = 'normal';
      }
    }
  }

  updateResultsDisplay() {
    // These elements may not exist in the current HTML structure
    // We'll just log the status for now
    console.log('DFA1 Status:', this.dfa1Progress.completed ? 'Completed' : 'In progress...');
    console.log('DFA2 Status:', this.dfa2Progress.completed ? 'Completed' : 'Waiting...');
  }

  updateDFA1Status(status) {
    console.log('DFA1 Status:', status);
  }

  updateDFA2Status(status) {
    console.log('DFA2 Status:', status);
  }

  updateEquivalenceStatus(status) {
    console.log('Equivalence Status:', status);
  }

  updatePartitioningDisplay() {
    const progress = this.currentPhase === 'dfa1' ? this.dfa1Progress : this.dfa2Progress;
    const containerSelector = this.currentPhase === 'dfa1' ? 'minimization_steps_list_left' : 'minimization_steps_list_right';
    const container = document.getElementById(containerSelector);
    
    if (!container) {
      console.error('Partitioning container not found:', containerSelector);
      return;
    }
    
    container.innerHTML = '';
    
    progress.steps.forEach((step, index) => {
      const stepDiv = document.createElement('li');
      stepDiv.className = 'partition-step';
      if (index === progress.steps.length - 1) {
        stepDiv.classList.add('current');
      } else {
        stepDiv.classList.add('completed');
      }
      
      const stepContent = document.createElement('div');
      stepContent.innerHTML = `
        <strong>Step ${step.step}:</strong> ${step.description}<br>
        <small>${step.explanation}</small><br>
        <em>Partitions: ${step.partitions.map(p => `{${p.join(', ')}}`).join(', ')}</em>
      `;
      
      stepDiv.appendChild(stepContent);
      container.appendChild(stepDiv);
    });
  }

  showFinalResults() {
    const example = dfaExamples[this.currentExample];
    const finalScore = Math.max(0, this.score - (this.mistakes * 5) - (this.hintsUsed * 5));
    const equivalenceStatus = example.isEquivalent ? "Equivalent" : "Not Equivalent";
    
    swal({
      title: "Experiment Complete!",
      content: {
        element: "div",
        attributes: {
          innerHTML: `<div style="text-align: center;">
                        <p><strong>Final Score:</strong> ${finalScore}</p>
                        <p style="margin: 20px 0;"><strong>Result: DFAs are <span style="font-weight: bold; color: ${example.isEquivalent ? '#28a745' : '#dc3545'}">${equivalenceStatus}</span></strong></p>
                        <p style="font-size: 14px; color: #666;">${example.equivalenceExplanation}</p>
                      </div>`
        }
      },
      icon: "success",
      buttons: {
        retry: {
          text: "Try Again",
          value: "retry"
        },
        next: {
          text: "Next Example", 
          value: "next"
        }
      }
    }).then((value) => {
      if (value === "retry") {
        this.loadExample(this.currentExample);
      } else if (value === "next") {
        this.loadExample((this.currentExample + 1) % dfaExamples.length);
      }
    });
  }
}

// Initialize the interactive controller when the page loads
let interactiveController;

// Don't auto-initialize - let main.js handle it
// document.addEventListener('DOMContentLoaded', () => {
//   interactiveController = new InteractiveController();
// });
