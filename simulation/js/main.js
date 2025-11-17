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
    document.getElementById('change_dfas').addEventListener('click', nextExample);
    document.getElementById('reset_experiment').addEventListener('click', resetSimulation);
    document.getElementById('prev_step').addEventListener('click', previousExample);
    document.getElementById('show_hint').addEventListener('click', showHint);
    document.getElementById('auto_step').addEventListener('click', startSimulation);
}

function validateDOM() {
    const requiredElements = [
      'dfa_canvas_left',
      'dfa_canvas_right',
      'minimization_steps_list_left',
      'minimization_steps_list_right',
      'score_display',
      'current_turn_display',
      'phase_display'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
      throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
    }
}

function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      showErrorMessage('An unexpected error occurred. Please try again.');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      showErrorMessage('An error occurred while processing your request.');
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Prevent shortcuts when typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            showHint();
          }
          break;
        
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetSimulation();
          }
          break;
        
        case 'n':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            nextExample();
          }
          break;
        
        case ' ':
          event.preventDefault();
          startSimulation();
          break;
        
        case 'escape':
          // Clear any active selections or modals
          clearSelections();
          break;
      }
    });
}

function setupResponsiveBehavior() {
    // Handle window resize
    window.addEventListener('resize', () => {
      handleResize();
    });

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => handleResize(), 100);
    });

    // Initial resize handling
    handleResize();
}

function handleResize() {
    const canvasLeft = document.getElementById('dfa_canvas_left');
    const canvasRight = document.getElementById('dfa_canvas_right');
    
    if (!canvasLeft || !canvasRight) return;

    const container = canvasLeft.parentElement;
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const maxWidth = Math.min(containerRect.width - 40, 400);
    const maxHeight = Math.min(containerRect.height - 40, 300);
    
    // Update canvas size if needed
    if (canvasLeft.width !== maxWidth || canvasLeft.height !== maxHeight) {
      canvasLeft.width = maxWidth;
      canvasLeft.height = maxHeight;
      canvasRight.width = maxWidth;
      canvasRight.height = maxHeight;
      
      // Trigger redraw if needed
      loadExample(currentExample);
    }
}

function clearSelections() {
    // Clear any highlighted elements
    document.querySelectorAll('.selected, .highlighted').forEach(element => {
      element.classList.remove('selected', 'highlighted');
    });
}

function showErrorMessage(message) {
    if (typeof swal !== 'undefined') {
      swal({
        title: "Error",
        text: message,
        icon: "error"
      });
    } else {
      alert(message);
    }
}

// Public API methods for external access
function getCurrentExample() {
    return dfaExamples[currentExample] || null;
}

function getCurrentPhase() {
    return currentPhase;
}

function getScore() {
    return userScore;
}

function isInitialized() {
    return true;
}

// Core simulation functions
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
    clearChoices();
    updateUI();
}

function nextExample() {
    if (window.dfaExamples && currentExample < window.dfaExamples.length - 1) {
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

function showHint() {
    if (typeof swal !== 'undefined') {
        swal({
            title: "Hint",
            text: "Look at the current step requirements and compare the available options carefully.",
            icon: "info"
        });
    } else {
        alert("Hint: Look at the current step requirements and compare the available options carefully.");
    }
}

function showCurrentStep() {
    // This function would need to be implemented based on the specific requirements
    console.log("Showing current step for phase:", currentPhase);
}

function updateUI() {
    // Update score display
    const scoreElement = document.getElementById('score_display');
    if (scoreElement) {
        scoreElement.textContent = userScore;
    }
    
    // Update current turn display
    const turnElement = document.getElementById('current_turn_display');
    if (turnElement) {
        turnElement.textContent = currentPhase === 'dfa-a' ? 'DFA A' : 'DFA B';
    }
    
    // Update phase display
    const phaseElement = document.getElementById('phase_display');
    if (phaseElement) {
        phaseElement.textContent = 'Minimization';
    }
}

function clearChoices() {
    const choicesContainer = document.getElementById('action_choices_container');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
    }
}

function loadExample(exampleIndex) {
    if (!window.dfaExamples || !window.dfaExamples[exampleIndex]) {
        console.error('Example not found:', exampleIndex);
        return;
    }
    
    const example = window.dfaExamples[exampleIndex];
    console.log('Loading example:', example);
    
    // Update UI with new example
    updateUI();
}

/**
 * Utility functions for the application
 */
const AppUtils = {
  // Format numbers with commas
  formatNumber: (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // Generate random ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // Debounce function calls
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if device is mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Get browser info
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    
    return {
      name: browser,
      userAgent: ua,
      isMobile: AppUtils.isMobile()
    };
  }
};

/**
 * Performance monitoring
 */
const PerformanceMonitor = {
  startTime: Date.now(),
  marks: new Map(),

  mark: (name) => {
    PerformanceMonitor.marks.set(name, Date.now());
  },

  measure: (name) => {
    const startTime = PerformanceMonitor.marks.get(name);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`Performance: ${name} took ${duration}ms`);
      return duration;
    }
    return null;
  },

  getInitTime: () => {
    return Date.now() - PerformanceMonitor.startTime;
  }
};

/**
 * Analytics and logging
 */
const Analytics = {
  events: [],
  
  logEvent: (eventName, data = {}) => {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      data: data,
      sessionId: Analytics.getSessionId()
    };
    
    Analytics.events.push(event);
    console.log('Analytics Event:', event);
    
    // In a real application, you might send this to an analytics service
  },

  logError: (error, context = {}) => {
    Analytics.logEvent('error', {
      message: error.message,
      stack: error.stack,
      context: context
    });
  },

  getSessionId: () => {
    let sessionId = sessionStorage.getItem('dfa_session_id');
    if (!sessionId) {
      sessionId = AppUtils.generateId();
      sessionStorage.setItem('dfa_session_id', sessionId);
    }
    return sessionId;
  },

  getEvents: () => {
    return [...Analytics.events];
  }
};

// Initialize the application
let boo;

document.addEventListener('DOMContentLoaded', function() {
    // Mark initialization start
    PerformanceMonitor.mark('app_init_start');
    
    // Log browser info
    console.log('Browser Info:', AppUtils.getBrowserInfo());
    
    // Initialize the experiment
    try {
        initializeExperiment();
        setupEventListeners();
        setupKeyboardShortcuts();
        setupResponsiveBehavior();
        setupErrorHandling();
        validateDOM();
        
        // Initialize the interactive controller
        if (typeof InteractiveController !== 'undefined') {
            boo = new InteractiveController();
        }
        
        Analytics.logEvent('app_initialized', {
            initTime: PerformanceMonitor.getInitTime(),
            browserInfo: AppUtils.getBrowserInfo()
        });
        
        console.log('DFA Minimization experiment initialized successfully');
    } catch (error) {
        console.error('Failed to initialize DFA Minimization experiment:', error);
        Analytics.logError(error, { phase: 'app_creation' });
        showErrorMessage('Failed to initialize the experiment. Please refresh the page.');
    }
    
    // Mark initialization end
    PerformanceMonitor.mark('app_init_end');
    PerformanceMonitor.measure('app_init_start');
});

// Export for external access
if (typeof window !== 'undefined') {
    window.AppUtils = AppUtils;
    window.PerformanceMonitor = PerformanceMonitor;
    window.Analytics = Analytics;
}
