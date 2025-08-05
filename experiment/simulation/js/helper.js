// Helper functions for DFA Minimization and Equivalence

/**
 * Canvas drawing utilities
 */
class CanvasHelper {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawState(x, y, label, isStart = false, isAccept = false, isHighlighted = false, isEliminated = false) {
    const radius = 25;
    
    this.ctx.save();
    
    // Modern color scheme based on reference
    if (isEliminated) {
      this.ctx.strokeStyle = '#EF4444';
      this.ctx.fillStyle = '#FEE2E2';
      this.ctx.globalAlpha = 0.6;
    } else if (isHighlighted) {
      this.ctx.strokeStyle = '#F59E0B';
      this.ctx.fillStyle = '#FEF3C7';
    } else if (isStart) {
      this.ctx.strokeStyle = '#3B82F6';
      this.ctx.fillStyle = '#EFF6FF';
    } else {
      this.ctx.strokeStyle = '#6B7280';
      this.ctx.fillStyle = '#F9FAFB';
    }

    // Draw outer circle with modern styling
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Draw inner circle for accept states
    if (isAccept) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius - 5, 0, 2 * Math.PI);
      this.ctx.strokeStyle = '#10B981';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Draw start arrow with modern styling
    if (isStart) {
      this.ctx.strokeStyle = '#3B82F6';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(x - radius - 25, y);
      this.ctx.lineTo(x - radius - 5, y);
      this.ctx.stroke();
      
      // Modern arrow head
      this.ctx.beginPath();
      this.ctx.moveTo(x - radius - 5, y);
      this.ctx.lineTo(x - radius - 12, y - 5);
      this.ctx.moveTo(x - radius - 5, y);
      this.ctx.lineTo(x - radius - 12, y + 5);
      this.ctx.stroke();
    }

    // Draw label with modern typography
    this.ctx.fillStyle = '#111827';
    this.ctx.font = 'bold 16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x, y);

    this.ctx.restore();
  }

  drawTransition(fromX, fromY, toX, toY, label, isSelfLoop = false, isHighlighted = false) {
    this.ctx.save();
    
    // Modern transition styling
    if (isHighlighted) {
      this.ctx.strokeStyle = '#F59E0B';
      this.ctx.lineWidth = 3;
    } else {
      this.ctx.strokeStyle = '#4B5563';
      this.ctx.lineWidth = 2.5;
    }
    
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (isSelfLoop) {
      // Draw self loop as a small arc (semicircle) above the state, matching the reference image
      const stateRadius = 25;
      const arcRadius = 22; // Smaller arc radius for a tighter loop
      // Center the arc just above the state
      const arcCenterX = fromX;
      const arcCenterY = fromY - stateRadius - arcRadius + 2;

      // Arc angles: start at 200deg (1.11pi), end at -20deg (1.89pi), covers just over a semicircle
      const startAngle = Math.PI * 0.5;
      const endAngle = Math.PI * 2.35;

      // Calculate arc start/end points
      const arcStartX = arcCenterX + arcRadius * Math.cos(startAngle);
      const arcStartY = arcCenterY + arcRadius * Math.sin(startAngle);
      const arcEndX = arcCenterX + arcRadius * Math.cos(endAngle);
      const arcEndY = arcCenterY + arcRadius * Math.sin(endAngle);

      // Draw the arc (semicircle above the state)
      this.ctx.beginPath();
      this.ctx.arc(arcCenterX, arcCenterY, arcRadius, startAngle, endAngle, false);
      this.ctx.stroke();

      // Arrowhead at the end of the arc (right side, tangent to arc)
      // Calculate tangent angle at end
      const angle = endAngle + Math.PI / 2.2; // Slightly downward
      this.drawArrowHead(arcEndX, arcEndY, angle);

      // Label above the arc
      const labelX = arcCenterX;
      const labelY = arcCenterY - arcRadius - 12;
      this.ctx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const textWidth = this.ctx.measureText(label).width;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillRect(labelX - textWidth/2 - 4, labelY - 8, textWidth + 8, 16);
      this.ctx.fillStyle = '#111827';
      this.ctx.fillText(label, labelX, labelY);
    } else {
      // Calculate arrow positions
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const unitX = dx / distance;
      const unitY = dy / distance;
      
      const radius = 25;
      const startX = fromX + unitX * radius;
      const startY = fromY + unitY * radius;
      const endX = toX - unitX * radius;
      const endY = toY - unitY * radius;

      // Draw line
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Modern arrow head
      const angle = Math.atan2(dy, dx);
      this.drawArrowHead(endX, endY, angle);

      // Draw label with background for better readability
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Offset label slightly from line for better spacing (reduced further)
      const offsetX = -unitY * 8;  // Reduced from 12 to 8
      const offsetY = unitX * 8;   // Reduced from 12 to 8
      const labelX = midX + offsetX;
      const labelY = midY + offsetY;
      
      this.ctx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const textWidth = this.ctx.measureText(label).width;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillRect(labelX - textWidth/2 - 4, labelY - 8, textWidth + 8, 16);
      
      this.ctx.fillStyle = '#111827';
      this.ctx.fillText(label, labelX, labelY);
    }

    this.ctx.restore();
  }

  drawBidirectionalTransition(fromPos, toPos, fromState, toState, forwardSymbols, isHighlighted, transitions) {
    // Get symbols for both directions
    const reverseSymbols = [];
    if (transitions[toState]) {
      Object.keys(transitions[toState]).forEach(symbol => {
        if (transitions[toState][symbol] === fromState) {
          reverseSymbols.push(symbol);
        }
      });
    }
    
    // Draw two separate straight lines with slight offset for visibility
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Create perpendicular offset for line separation
    const offsetDistance = 8; // Small offset to separate the lines
    const perpX = -unitY * offsetDistance;
    const perpY = unitX * offsetDistance;
    
    // Forward line (slightly offset in one direction)
    const forwardFromX = fromPos.x + perpX;
    const forwardFromY = fromPos.y + perpY;
    const forwardToX = toPos.x + perpX;
    const forwardToY = toPos.y + perpY;
    
    // Reverse line (slightly offset in opposite direction)
    const reverseFromX = toPos.x - perpX;
    const reverseFromY = toPos.y - perpY;
    const reverseToX = fromPos.x - perpX;
    const reverseToY = fromPos.y - perpY;
    
    // Draw forward transition
    this.drawTransition(forwardFromX, forwardFromY, forwardToX, forwardToY, 
                       forwardSymbols.sort().join(', '), false, isHighlighted);
    
    // Draw reverse transition
    this.drawTransition(reverseFromX, reverseFromY, reverseToX, reverseToY, 
                       reverseSymbols.sort().join(', '), false, isHighlighted);
  }

  drawCurvedTransition(fromPos, toPos, label, isHighlighted, curveDirection) {
    this.ctx.save();
    
    // Modern transition styling
    if (isHighlighted) {
      this.ctx.strokeStyle = '#F59E0B';
      this.ctx.lineWidth = 3;
    } else {
      this.ctx.strokeStyle = '#4B5563';
      this.ctx.lineWidth = 2.5;
    }

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    const radius = 25;
    const startX = fromPos.x + unitX * radius;
    const startY = fromPos.y + unitY * radius;
    const endX = toPos.x - unitX * radius;
    const endY = toPos.y - unitY * radius;

    // Create curved path using quadratic Bezier curve (like reference)
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const curveFactor = 40 * curveDirection; // Reduced from 60 to 40 for more compact curves
    const controlX = midX - unitY * curveFactor;
    const controlY = midY + unitX * curveFactor;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    this.ctx.stroke();

    // Modern arrow head with proper angle calculation
    const angle = Math.atan2(endY - controlY, endX - controlX);
    this.drawArrowHead(endX, endY, angle);

    // Position label with better separation and modern styling (closer to line)
    const labelOffsetX = -unitY * curveFactor * 0.3; // Reduced from 0.5 to 0.3
    const labelOffsetY = unitX * curveFactor * 0.3;   // Reduced from 0.5 to 0.3
    const labelX = midX + labelOffsetX;
    const labelY = midY + labelOffsetY;
    
    // Add subtle background for better readability
    this.ctx.font = 'bold 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const textWidth = this.ctx.measureText(label).width;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(labelX - textWidth/2 - 4, labelY - 8, textWidth + 8, 16);
    
    this.ctx.fillStyle = '#111827';
    this.ctx.fillText(label, labelX, labelY);

    this.ctx.restore();
  }

  drawArrowHead(x, y, angle) {
    const headLength = 12;
    const headAngle = Math.PI / 6;
    
    this.ctx.save();
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - headLength * Math.cos(angle - headAngle), 
      y - headLength * Math.sin(angle - headAngle)
    );
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - headLength * Math.cos(angle + headAngle), 
      y - headLength * Math.sin(angle + headAngle)
    );
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawDFA(dfa, highlightedStates = [], eliminatedStates = [], partitions = []) {
    this.clear();
    
    // Draw partition groupings first (behind everything)
    partitions.forEach((partition, index) => {
      if (partition.length > 1) {
        this.drawPartitionGroup(partition, dfa.layout, index);
      }
    });
    
    // Draw transitions (so they appear behind states)
    // Handle transitions more carefully - draw separate lines for bidirectional transitions
    const transitionGroups = new Map();
    const bidirectionalPairs = new Set();
    
    // First pass: identify all transitions and bidirectional pairs
    Object.keys(dfa.transitions).forEach(fromState => {
      if (eliminatedStates.includes(fromState)) return;
      
      Object.keys(dfa.transitions[fromState]).forEach(symbol => {
        const toState = dfa.transitions[fromState][symbol];
        if (eliminatedStates.includes(toState)) return;
        
        // Check if there's a reverse transition
        const hasReverse = dfa.transitions[toState] && 
                          Object.values(dfa.transitions[toState]).includes(fromState);
        
        if (hasReverse && fromState !== toState) {
          bidirectionalPairs.add([fromState, toState].sort().join('-'));
        }
        
        const key = `${fromState}->${toState}`;
        if (!transitionGroups.has(key)) {
          transitionGroups.set(key, {
            fromState,
            toState,
            symbols: []
          });
        }
        transitionGroups.get(key).symbols.push(symbol);
      });
    });
    
    // Draw transitions with proper handling of bidirectional cases
    transitionGroups.forEach(({ fromState, toState, symbols }) => {
      const fromPos = dfa.layout[fromState];
      const toPos = dfa.layout[toState];
      const isSelfLoop = fromState === toState;
      const isHighlighted = highlightedStates.includes(fromState) || highlightedStates.includes(toState);
      
      const pairKey = [fromState, toState].sort().join('-');
      const isBidirectional = bidirectionalPairs.has(pairKey);
      
      if (isBidirectional && fromState < toState) {
        // For bidirectional transitions, draw two separate curved lines
        // Only draw once for the lexicographically smaller state pair
        this.drawBidirectionalTransition(fromPos, toPos, fromState, toState, symbols, isHighlighted, dfa.transitions);
      } else if (!isBidirectional) {
        // Regular single transition (including self-loops)
        const label = symbols.sort().join(', ');
        this.drawTransition(fromPos.x, fromPos.y, toPos.x, toPos.y, label, isSelfLoop, isHighlighted);
      }
      // Skip drawing the reverse direction for bidirectional pairs (already handled above)
    });

    // Draw states
    Object.keys(dfa.layout).forEach(state => {
      const pos = dfa.layout[state];
      const isStart = state === dfa.startState;
      const isAccept = dfa.acceptStates.includes(state);
      const isHighlighted = highlightedStates.includes(state);
      const isEliminated = eliminatedStates.includes(state);
      
      this.drawState(pos.x, pos.y, state, isStart, isAccept, isHighlighted, isEliminated);
    });
  }

  drawPartitionGroup(partition, layout, groupIndex) {
    if (partition.length <= 1) return;
    
    const colors = ['#E5F3FF', '#FFF2E5', '#E5FFE5', '#FFE5F3', '#F3E5FF'];
    const strokeColors = ['#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];
    const color = colors[groupIndex % colors.length];
    const strokeColor = strokeColors[groupIndex % strokeColors.length];
    
    // Calculate bounding box for the partition
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    partition.forEach(state => {
      const pos = layout[state];
      if (pos) {
        minX = Math.min(minX, pos.x - 30);
        minY = Math.min(minY, pos.y - 30);
        maxX = Math.max(maxX, pos.x + 30);
        maxY = Math.max(maxY, pos.y + 30);
      }
    });
    
    // Draw rounded rectangle around partition
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    
    const padding = 10;
    this.drawRoundedRect(
      minX - padding, minY - padding, 
      maxX - minX + 2 * padding, maxY - minY + 2 * padding, 
      10
    );
    
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    
    // Draw partition label
    this.ctx.save();
    this.ctx.fillStyle = strokeColor;
    this.ctx.font = 'bold 12px Inter';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`{${partition.join(',')}}`, minX - padding + 5, minY - padding - 5);
    this.ctx.restore();
  }

  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }
}

/**
 * DFA Analysis utilities
 */
class DFAAnalyzer {
  static findReachableStates(dfa) {
    const reachable = new Set();
    const queue = [dfa.startState];
    reachable.add(dfa.startState);

    while (queue.length > 0) {
      const current = queue.shift();
      if (dfa.transitions[current]) {
        Object.values(dfa.transitions[current]).forEach(nextState => {
          if (!reachable.has(nextState)) {
            reachable.add(nextState);
            queue.push(nextState);
          }
        });
      }
    }

    return Array.from(reachable);
  }

  static findUnreachableStates(dfa) {
    const reachable = this.findReachableStates(dfa);
    return dfa.states.filter(state => !reachable.includes(state));
  }

  static getInitialPartition(dfa) {
    const reachableStates = this.findReachableStates(dfa);
    const accepting = reachableStates.filter(state => dfa.acceptStates.includes(state));
    const nonAccepting = reachableStates.filter(state => !dfa.acceptStates.includes(state));
    
    const partitions = [];
    if (nonAccepting.length > 0) partitions.push(nonAccepting);
    if (accepting.length > 0) partitions.push(accepting);
    
    return partitions;
  }

  static refinePartitions(dfa, partitions) {
    let changed = true;
    let currentPartitions = partitions.map(p => [...p]);
    let iterations = 0;
    const maxIterations = 10; // Safety limit

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      const newPartitions = [];

      for (const partition of currentPartitions) {
        if (partition.length <= 1) {
          newPartitions.push(partition);
          continue;
        }

        // Create signature-based groups
        const groups = new Map();
        
        for (const state of partition) {
          const signature = this.getStateSignature(dfa, state, currentPartitions);
          if (!groups.has(signature)) {
            groups.set(signature, []);
          }
          groups.get(signature).push(state);
        }

        // Add all groups to new partitions
        const subPartitions = Array.from(groups.values());
        if (subPartitions.length > 1) {
          changed = true;
          newPartitions.push(...subPartitions);
        } else {
          newPartitions.push(partition);
        }
      }

      currentPartitions = newPartitions;
    }

    return currentPartitions;
  }

  static splitPartition(dfa, partition, allPartitions) {
    if (partition.length <= 1) return [partition];

    const groups = new Map();
    
    for (const state of partition) {
      const signature = this.getStateSignature(dfa, state, allPartitions);
      if (!groups.has(signature)) {
        groups.set(signature, []);
      }
      groups.get(signature).push(state);
    }

    return Array.from(groups.values());
  }

  static getStateSignature(dfa, state, allPartitions) {
    const signature = [];
    
    for (const symbol of dfa.alphabet) {
      const nextState = dfa.transitions[state] && dfa.transitions[state][symbol] 
        ? dfa.transitions[state][symbol] 
        : null;
      
      if (nextState === null) {
        signature.push(-1); // Dead state/no transition
      } else {
        const partitionIndex = allPartitions.findIndex(partition => 
          partition.includes(nextState)
        );
        signature.push(partitionIndex);
      }
    }
    
    return signature.join(',');
  }

  static minimizeDFA(dfa) {
    // Step 1: Find reachable states (remove unreachable first)
    const reachableStates = this.findReachableStates(dfa);
    
    // Create a new DFA with only reachable states
    const reachableDFA = {
      ...dfa,
      states: reachableStates,
      transitions: Object.fromEntries(
        Object.entries(dfa.transitions).filter(([state]) => reachableStates.includes(state))
      )
    };
    
    // Step 2: Initial partition (accepting vs non-accepting)
    const initialPartitions = this.getInitialPartition(reachableDFA);
    
    // Step 3: Refine partitions iteratively
    const finalPartitions = this.refinePartitions(reachableDFA, initialPartitions);
    
    // Step 4: Build minimal DFA
    return this.buildMinimalDFA(reachableDFA, finalPartitions);
  }

  static buildMinimalDFA(dfa, partitions) {
    const stateMap = new Map();
    const newStates = [];
    const newTransitions = {};
    const newAcceptStates = [];
    
    // Create state mapping
    partitions.forEach((partition, index) => {
      const newStateName = `q${index}`;
      newStates.push(newStateName);
      partition.forEach(oldState => {
        stateMap.set(oldState, newStateName);
      });
      
      // Check if this partition contains accept states
      if (partition.some(state => dfa.acceptStates.includes(state))) {
        newAcceptStates.push(newStateName);
      }
    });

    // Create transitions
    partitions.forEach((partition, index) => {
      const representative = partition[0];
      const newStateName = `q${index}`;
      newTransitions[newStateName] = {};
      
      dfa.alphabet.forEach(symbol => {
        if (dfa.transitions[representative] && dfa.transitions[representative][symbol]) {
          const targetState = dfa.transitions[representative][symbol];
          const newTargetState = stateMap.get(targetState);
          newTransitions[newStateName][symbol] = newTargetState;
        }
      });
    });

    return {
      states: newStates,
      alphabet: dfa.alphabet,
      startState: stateMap.get(dfa.startState),
      acceptStates: newAcceptStates,
      transitions: newTransitions,
      originalPartitions: partitions
    };
  }

  static testEquivalence(dfa1, dfa2, testStrings) {
    // First minimize both DFAs
    const minimal1 = this.minimizeDFA(dfa1);
    const minimal2 = this.minimizeDFA(dfa2);
    
    // Test if minimized DFAs have same structure
    if (minimal1.states.length !== minimal2.states.length) {
      return {
        equivalent: false,
        reason: "Different number of states in minimized DFAs",
        minimal1States: minimal1.states.length,
        minimal2States: minimal2.states.length
      };
    }
    
    // Test with provided test strings
    for (const testString of testStrings) {
      const result1 = this.testString(dfa1, testString);
      const result2 = this.testString(dfa2, testString);
      
      if (result1 !== result2) {
        return {
          equivalent: false,
          counterexample: testString,
          dfa1Result: result1,
          dfa2Result: result2
        };
      }
    }
    
    // Generate additional test strings systematically up to length 3
    const alphabet = dfa1.alphabet;
    const additionalTests = this.generateTestStrings(alphabet, 3);
    
    for (const testString of additionalTests) {
      const result1 = this.testString(dfa1, testString);
      const result2 = this.testString(dfa2, testString);
      
      if (result1 !== result2) {
        return {
          equivalent: false,
          counterexample: testString,
          dfa1Result: result1,
          dfa2Result: result2
        };
      }
    }
    
    return { equivalent: true };
  }

  static generateTestStrings(alphabet, maxLength) {
    const strings = [''];  // Include empty string
    
    for (let length = 1; length <= maxLength; length++) {
      const currentLevelStrings = [];
      for (const baseString of strings.filter(s => s.length === length - 1)) {
        for (const symbol of alphabet) {
          currentLevelStrings.push(baseString + symbol);
        }
      }
      strings.push(...currentLevelStrings);
    }
    
    return strings;
  }

  static testString(dfa, string) {
    let currentState = dfa.startState;
    
    for (const symbol of string) {
      if (dfa.transitions[currentState] && dfa.transitions[currentState][symbol]) {
        currentState = dfa.transitions[currentState][symbol];
      } else {
        return false; // No transition defined - reject
      }
    }
    
    return dfa.acceptStates.includes(currentState);
  }

  // Formal state distinguishability check according to Myhill-Nerode theorem
  static areStatesDistinguishable(dfa, state1, state2, alphabet, maxLength = 4) {
    // Two states are distinguishable if there exists a string w such that
    // exactly one of δ(state1, w) and δ(state2, w) is in F (accepting states)
    
    const testStrings = this.generateTestStrings(alphabet, maxLength);
    
    for (const testString of testStrings) {
      const result1 = this.simulateFromState(dfa, state1, testString);
      const result2 = this.simulateFromState(dfa, state2, testString);
      
      if (result1 !== result2) {
        return {
          distinguishable: true,
          witness: testString,
          state1Result: result1,
          state2Result: result2
        };
      }
    }
    
    return { distinguishable: false };
  }

  static simulateFromState(dfa, startState, string) {
    let currentState = startState;
    
    for (const symbol of string) {
      if (dfa.transitions[currentState] && dfa.transitions[currentState][symbol]) {
        currentState = dfa.transitions[currentState][symbol];
      } else {
        return false; // No transition - reject
      }
    }
    
    return dfa.acceptStates.includes(currentState);
  }

  // Print transition table to console for debugging/education
  static printTransitionTable(dfa, title = "DFA") {
    console.log(`\n=== ${title} Transition Table ===`);
    console.log(`States: [${dfa.states.join(', ')}]`);
    console.log(`Alphabet: [${dfa.alphabet.join(', ')}]`);
    console.log(`Start State: ${dfa.startState}`);
    console.log(`Accept States: [${dfa.acceptStates.join(', ')}]`);
    console.log("\nTransition Function:");
    
    // Create header
    let headerRow = "State    ";
    dfa.alphabet.forEach(symbol => {
      headerRow += `| ${symbol.padEnd(8)}`;
    });
    console.log(headerRow);
    console.log("-".repeat(headerRow.length));
    
    // Print each state's transitions
    dfa.states.forEach(state => {
      let row = `${state.padEnd(8)} `;
      dfa.alphabet.forEach(symbol => {
        const nextState = dfa.transitions[state] && dfa.transitions[state][symbol] 
          ? dfa.transitions[state][symbol] 
          : '∅';
        row += `| ${nextState.padEnd(8)}`;
      });
      
      // Mark accepting states
      if (dfa.acceptStates.includes(state)) {
        row += " (*)";
      }
      
      console.log(row);
    });
    
    console.log("(*) = Accepting state");
    console.log("∅ = No transition (dead state)");
    console.log("=".repeat(headerRow.length));
  }
}

/**
 * Animation utilities
 */
class AnimationHelper {
  static highlightStates(canvas, states, duration = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  static fadeInElement(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  }

  static slideInElement(element, direction = 'left', duration = 300) {
    const transform = direction === 'left' ? 'translateX(-20px)' : 'translateY(-20px)';
    
    element.style.transform = transform;
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    
    setTimeout(() => {
      element.style.transform = 'translateX(0) translateY(0)';
      element.style.opacity = '1';
    }, 10);
  }
}

/**
 * UI utilities
 */
class UIHelper {
  static showMessage(message, type = 'info', duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    AnimationHelper.fadeInElement(messageDiv);
    
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(messageDiv);
      }, 300);
    }, duration);
  }

  static createButton(text, className, onclick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onclick;
    return button;
  }

  static createPartitionDisplay(partitions) {
    const container = document.createElement('div');
    container.className = 'partition-visualization';
    
    partitions.forEach((partition, index) => {
      const partitionDiv = document.createElement('div');
      partitionDiv.className = 'partition-set';
      
      partition.forEach(state => {
        const stateSpan = document.createElement('span');
        stateSpan.className = 'state-in-partition';
        stateSpan.textContent = state;
        partitionDiv.appendChild(stateSpan);
      });
      
      container.appendChild(partitionDiv);
    });
    
    return container;
  }

  static updateTransitionTable(table, dfa) {
    table.innerHTML = '';
    
    // Create header
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'State';
    dfa.alphabet.forEach(symbol => {
      headerRow.insertCell().textContent = symbol;
    });
    
    // Create rows for each state
    Object.keys(dfa.transitions).forEach(state => {
      const row = table.insertRow();
      const stateCell = row.insertCell();
      stateCell.textContent = state;
      
      if (dfa.acceptStates.includes(state)) {
        stateCell.style.fontWeight = 'bold';
        stateCell.style.color = '#10B981';
      }
      
      if (state === dfa.startState) {
        stateCell.style.background = '#EFF6FF';
      }
      
      dfa.alphabet.forEach(symbol => {
        const transitionCell = row.insertCell();
        const nextState = dfa.transitions[state][symbol];
        transitionCell.textContent = nextState || '-';
      });
    });
  }
}

// Export utilities
if (typeof window !== 'undefined') {
  window.CanvasHelper = CanvasHelper;
  window.DFAAnalyzer = DFAAnalyzer;
  window.AnimationHelper = AnimationHelper;
  window.UIHelper = UIHelper;
}
