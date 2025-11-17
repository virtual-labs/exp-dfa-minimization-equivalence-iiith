// DFA Minimization and Equivalence Data

// DFA examples for minimization and equivalence testing
const dfaExamples = [
  {
    id: 1,
    name: "Example 1: Simple Equivalent DFAs",
    description: "Two DFAs that accept strings ending with 'ab'",
    dfa1: {
      name: "DFA 1",
      states: ["q0", "q1", "q2", "q3", "q4"],
      alphabet: ["a", "b"],
      startState: "q0",
      acceptStates: ["q2"],
      transitions: {
        "q0": { "a": "q1", "b": "q0" },
        "q1": { "a": "q1", "b": "q2" },
        "q2": { "a": "q1", "b": "q0" },
        "q3": { "a": "q1", "b": "q0" }, // Unreachable state
        "q4": { "a": "q1", "b": "q0" }  // Unreachable state
      },
      layout: {
        "q0": { x: 120, y: 200 },
        "q1": { x: 300, y: 130 },
        "q2": { x: 480, y: 200 },
        "q3": { x: 170, y: 320 },
        "q4": { x: 420, y: 320 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Remove unreachable states",
          partitions: [["q0", "q1"], ["q2"]],
          explanation: "Remove unreachable states q3, q4Only q0, q1, q2 are reachable from q0",
          choices: [
            {
              text: "Keep all states as they might be useful",
              correct: false,
              explanation: "Unreachable states can be removed safely."
            },
            {
              text: "Remove q3 and q4 (unreachable from start state q0)",
              correct: true,
              explanation: "Correct! q3 and q4 cannot be reached from the start state q0."
            },
            {
              text: "Remove q1 and q2 instead",
              correct: false,
              explanation: "q1 and q2 are reachable from q0."
            },
            {
              text: "Remove only q4",
              correct: false,
              explanation: "Both q3 and q4 are unreachable."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["q0", "q1"], ["q2"]],
            eliminatedStates: ["q3", "q4"]
          }
        },
        {
          step: 2,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["q0", "q1"], ["q2"]],
          explanation: "Divide remaining reachable states into accepting {q2} and non-accepting {q0,q1}",
          choices: [
            {
              text: "Partition into {q0,q2} and {q1}",
              correct: false,
              explanation: "q0 and q2 have different accepting properties."
            },
            {
              text: "Keep all states separate: {q0},{q1},{q2}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "Partition into {q0,q1} and {q2}",
              correct: true,
              explanation: "Correct! Separate accepting states from non-accepting states."
            },
            {
              text: "All states in one partition: {q0,q1,q2}",
              correct: false,
              explanation: "Must separate accepting from non-accepting states."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["q0", "q1"], ["q2"]],
            eliminatedStates: ["q3", "q4"]
          }
        },
        {
          step: 3,
          description: "Refine partitions based on transition behavior",
          partitions: [["q0"], ["q1"], ["q2"]],
          explanation: "q0 and q1 have different behaviors: q0 goes to q0 on 'b', q1 goes to q2 on 'b'",
          choices: [
            {
              text: "Keep {q0,q1} together as they're both non-accepting",
              correct: false,
              explanation: "Being non-accepting isn't enough - they must have same transition behavior."
            },
            {
              text: "Merge q1 and q2 instead",
              correct: false,
              explanation: "q1 is non-accepting while q2 is accepting."
            },
            {
              text: "No further refinement needed",
              correct: false,
              explanation: "q0 and q1 have different transition behaviors."
            },
            {
              text: "Split {q0,q1} because they go to different states on 'b'",
              correct: true,
              explanation: "Correct! q0 goes to q0 on 'b', while q1 goes to q2 on 'b'."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["q0"], ["q1"], ["q2"]],
            eliminatedStates: ["q3", "q4"]
          }
        }
      ],
      minimalStates: ["q0", "q1", "q2"],
      equivalenceClasses: [["q0"], ["q1"], ["q2"]]
    },
    dfa2: {
      name: "DFA 2",
      states: ["p0", "p1", "p2"],
      alphabet: ["a", "b"],
      startState: "p0",
      acceptStates: ["p2"],
      transitions: {
        "p0": { "a": "p1", "b": "p0" },
        "p1": { "a": "p1", "b": "p2" },
        "p2": { "a": "p1", "b": "p0" }
      },
      layout: {
        "p0": { x: 120, y: 200 },
        "p1": { x: 300, y: 130 },
        "p2": { x: 480, y: 200 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["p0", "p1"], ["p2"]],
          explanation: "Divide states into accepting {p2} and non-accepting {p0,p1}",
          choices: [
            {
              text: "Partition into {p0,p2} and {p1}",
              correct: false,
              explanation: "p0 and p2 have different accepting properties."
            },
            {
              text: "Keep all states separate: {p0},{p1},{p2}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "Partition into {p0,p1} and {p2}",
              correct: true,
              explanation: "Correct! Separate accepting state p2 from non-accepting states p0,p1."
            },
            {
              text: "All states in one partition: {p0,p1,p2}",
              correct: false,
              explanation: "Must separate accepting from non-accepting states."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["p0", "p1"], ["p2"]],
            eliminatedStates: []
          }
        },
        {
          step: 2,
          description: "Refine non-accepting states based on transitions",
          partitions: [["p0"], ["p1"], ["p2"]],
          explanation: "p0 and p1 have different behaviors on input 'b'",
          choices: [
            {
              text: "Keep {p0,p1} together as they both go somewhere on 'b'",
              correct: false,
              explanation: "They go to different destinations: p0→p0, p1→p2."
            },
            {
              text: "Split {p0,p1} because p0→p0 on 'b' while p1→p2 on 'b'",
              correct: true,
              explanation: "Correct! p0 and p1 have different transition destinations on 'b'."
            },
            {
              text: "Merge p1 and p2 based on transitions",
              correct: false,
              explanation: "p1 and p2 have different accepting properties."
            },
            {
              text: "No refinement needed - all states are already minimal",
              correct: false,
              explanation: "p0 and p1 have different transition behaviors."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["p0"], ["p1"], ["p2"]],
            eliminatedStates: []
          }
        }
      ],
      minimalStates: ["p0", "p1", "p2"],
      equivalenceClasses: [["p0"], ["p1"], ["p2"]]
    },
    isEquivalent: true,
    equivalenceExplanation: "Both minimized DFAs accept exactly the strings ending with 'ab'"
  },
  
  {
    id: 2,
    name: "Example 2: Non-Equivalent DFAs",
    description: "Two DFAs with different languages",
    dfa1: {
      name: "DFA 1",
      states: ["q0", "q1", "q2", "q3"],
      alphabet: ["a", "b"],
      startState: "q0",
      acceptStates: ["q1", "q3"],
      transitions: {
        "q0": { "a": "q1", "b": "q2" },
        "q1": { "a": "q1", "b": "q1" },
        "q2": { "a": "q3", "b": "q2" },
        "q3": { "a": "q3", "b": "q3" }
      },
      layout: {
        "q0": { x: 120, y: 200 },
        "q1": { x: 300, y: 130 },
        "q2": { x: 300, y: 270 },
        "q3": { x: 520, y: 200 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["q0", "q2"], ["q1", "q3"]],
          explanation: "Divide into non-accepting {q0,q2} and accepting {q1,q3}",
          choices: [
            {
              text: "Partition into {q0,q1} and {q2,q3}",
              correct: false,
              explanation: "q0,q1 have different accepting properties."
            },
            {
              text: "Keep all states separate: {q0},{q1},{q2},{q3}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "Partition into {q0,q3} and {q1,q2}",
              correct: false,
              explanation: "q0 and q3 have different accepting properties."
            },
            {
              text: "Partition into {q0,q2} and {q1,q3}",
              correct: true,
              explanation: "Correct! Separate non-accepting states from accepting states."
            }
          ]
        },
        {
          step: 2,
          description: "Refine based on transition behavior",
          partitions: [["q0"], ["q2"], ["q1"], ["q3"]],
          explanation: "All states have different transition behaviors",
          choices: [
            {
              text: "Keep {q0,q2} together",
              correct: false,
              explanation: "q0 goes to q1 on 'a', q2 goes to q3 on 'a'."
            },
            {
              text: "All states are distinct: {q0},{q2},{q1},{q3}",
              correct: true,
              explanation: "Correct! Each state has unique transition behavior."
            },
            {
              text: "Keep {q1,q3} together",
              correct: false,
              explanation: "q1 stays in q1 on 'b', q3 stays in q3 on 'b', but they have different behaviors."
            },
            {
              text: "Partition into {q0,q1} and {q2,q3}",
              correct: false,
              explanation: "States should be separated by their transition patterns."
            }
          ]
        }
      ],
      minimalStates: ["q0", "q1", "q2", "q3"],
      equivalenceClasses: [["q0"], ["q1"], ["q2"], ["q3"]]
    },
    dfa2: {
      name: "DFA 2",
      states: ["p0", "p1", "p2"],
      alphabet: ["a", "b"],
      startState: "p0",
      acceptStates: ["p1"],
      transitions: {
        "p0": { "a": "p1", "b": "p0" },
        "p1": { "a": "p1", "b": "p2" },
        "p2": { "a": "p1", "b": "p0" }
      },
      layout: {
        "p0": { x: 120, y: 200 },
        "p1": { x: 300, y: 130 },
        "p2": { x: 520, y: 200 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["p0", "p2"], ["p1"]],
          explanation: "Divide into non-accepting {p0,p2} and accepting {p1}",
          choices: [
            {
              text: "Partition into {p0} and {p1,p2}",
              correct: false,
              explanation: "p1 is accepting while p2 is not."
            },
            {
              text: "Keep all states separate: {p0},{p1},{p2}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "Keep all states together: {p0,p1,p2}",
              correct: false,
              explanation: "Must separate accepting from non-accepting states."
            },
            {
              text: "Partition into {p0,p2} and {p1}",
              correct: true,
              explanation: "Correct! Separate non-accepting states from accepting states."
            }
          ]
        },
        {
          step: 2,
          description: "Refine non-accepting states",
          partitions: [["p0"], ["p2"], ["p1"]],
          explanation: "p0 and p2 have different transition behaviors",
          choices: [
            {
              text: "Keep {p0,p2} together",
              correct: false,
              explanation: "p0 and p2 behave differently on symbol 'b'."
            },
            {
              text: "Merge p1 with p0: {p0,p1},{p2}",
              correct: false,
              explanation: "p0 and p1 have different accepting properties."
            },
            {
              text: "Separate p0 and p2: {p0},{p2},{p1}",
              correct: true,
              explanation: "Correct! p0 loops on 'b', p2 goes to p0 on 'b'."
            },
            {
              text: "Merge p1 with p2: {p0},{p1,p2}",
              correct: false,
              explanation: "p1 and p2 have different accepting properties."
            }
          ]
        }
      ],
      minimalStates: ["p0", "p1", "p2"],
      equivalenceClasses: [["p0"], ["p1"], ["p2"]]
    },
    isEquivalent: false,
    equivalenceExplanation: "DFA1 accepts strings starting with 'a' or containing 'ba', while DFA2 accepts strings with odd number of 'a's"
  },

  {
    id: 3,
    name: "Example 3: Complex DFAs with Same Minimal Form",
    description: "Two DFAs with different structures that both minimize to the same 2-state DFA",
    dfa1: {
      name: "DFA 1",
      states: ["S", "A", "B", "C"],
      alphabet: ["0", "1"],
      startState: "S",
      acceptStates: ["S", "C"],
      transitions: {
        "S": { "0": "A", "1": "C" },
        "A": { "0": "S", "1": "B" },
        "B": { "0": "C", "1": "A" },
        "C": { "0": "B", "1": "S" }
      },
      layout: {
        "S": { x: 170, y: 100 },
        "A": { x: 450, y: 100 },
        "C": { x: 170, y: 250 },
        "B": { x: 450, y: 250 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["S", "C"], ["A", "B"]],
          explanation: "Divide states into accepting {S,C} and non-accepting {A,B}",
          choices: [
            {
              text: "Partition into {S,A} and {B,C}",
              correct: false,
              explanation: "S and A have different accepting properties."
            },
            {
              text: "Partition into {S,C} and {A,B}",
              correct: true,
              explanation: "Correct! Separate accepting states (S,C) from non-accepting states (A,B)."
            },
            {
              text: "Keep all states separate: {S},{A},{B},{C}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "All states in one partition: {S,A,B,C}",
              correct: false,
              explanation: "Must separate accepting from non-accepting states."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["S", "C"], ["A", "B"]],
            eliminatedStates: []
          }
        },
        {
          step: 2,
          description: "Check accepting states {S,C} for equivalent behavior",
          partitions: [["S", "C"], ["A", "B"]],
          explanation: "Both S and C: on '0' go to non-accepting, on '1' go to accepting - no split needed",
          choices: [
            {
              text: "Split {S,C} because S goes to A while C goes to B",
              correct: false,
              explanation: "What matters is the equivalence class of destination, not specific states."
            },
            {
              text: "Merge {S,C} with {A,B}",
              correct: false,
              explanation: "Accepting and non-accepting states cannot be merged."
            },
            {
              text: "Split S and C into separate partitions",
              correct: false,
              explanation: "S and C have equivalent transition behaviors."
            },
            {
              text: "Keep {S,C} together - both have same transition behavior",
              correct: true,
              explanation: "Correct! Both S and C transition to non-accepting states on '0' and accepting states on '1'."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["S", "C"], ["A", "B"]],
            eliminatedStates: []
          }
        },
        {
          step: 3,
          description: "Check non-accepting states {A,B} for equivalent behavior",
          partitions: [["S", "C"], ["A", "B"]],
          explanation: "Both A and B: on '0' go to accepting, on '1' go to non-accepting - no split needed",
          choices: [
            {
              text: "Split {A,B} because A goes to S while B goes to C",
              correct: false,
              explanation: "What matters is the equivalence class of destination, not specific states."
            },
            {
              text: "Keep {A,B} together - both have same transition behavior",
              correct: true,
              explanation: "Correct! Both A and B transition to accepting states on '0' and non-accepting states on '1'."
            },
            {
              text: "Merge {A,B} with {S,C}",
              correct: false,
              explanation: "Accepting and non-accepting states cannot be merged."
            },
            {
              text: "Split A and B into separate partitions",
              correct: false,
              explanation: "A and B have equivalent transition behaviors."
            }
          ],
          visualState: {
            mergedStates: [["S", "C"], ["A", "B"]],
            highlightedPartitions: [["S", "C"], ["A", "B"]],
            eliminatedStates: []
          }
        },
        {
          step: 4,
          description: "Finalize minimization - no further partitioning possible",
          partitions: [["S", "C"], ["A", "B"]],
          explanation: "All partitions are stableCreate minimal DFA: E = {S,C} (accepting), O = {A,B} (non-accepting)",
          choices: [
            {
              text: "Try to split partitions further",
              correct: false,
              explanation: "No further splitting is possible as all states in each partition have identical behavior."
            },
            {
              text: "Merge the two partitions together",
              correct: false,
              explanation: "Accepting and non-accepting partitions cannot be merged."
            },
            {
              text: "Since no more partitioning, partitioning done",
              correct: true,
              explanation: "Correct! The partitions are stable and minimization is completeFinal DFA has states E and O."
            },
            {
              text: "Create four separate states",
              correct: false,
              explanation: "The equivalent states should remain grouped in their partitions."
            }
          ],
          visualState: {
            mergedStates: [["S", "C"], ["A", "B"]],
            highlightedPartitions: [["S", "C"], ["A", "B"]],
            eliminatedStates: [],
            finalDFA: {
              states: ["E", "O"],
              transitions: {
                "E": { "0": "O", "1": "E" },
                "O": { "0": "E", "1": "O" }
              },
              acceptStates: ["E"],
              startState: "E"
            }
          }
        }
      ],
      minimalStates: ["E", "O"],
      equivalenceClasses: [["S", "C"], ["A", "B"]]
    },
    dfa2: {
      name: "DFA 2",
      states: ["q0", "q1", "q2", "q3", "q4"],
      alphabet: ["0", "1"],
      startState: "q0",
      acceptStates: ["q0", "q2"],
      transitions: {
        "q0": { "0": "q1", "1": "q2" },
        "q1": { "0": "q0", "1": "q3" },
        "q2": { "0": "q3", "1": "q0" },
        "q3": { "0": "q2", "1": "q4" },
        "q4": { "0": "q2", "1": "q1" }
      },
      layout: {
        "q0": { x: 120, y: 80 },
        "q1": { x: 250, y: 80 },
        "q2": { x: 120, y: 220 },
        "q3": { x: 380, y: 80 },
        "q4": { x: 380, y: 220 }
      },
      minimizationSteps: [
        {
          step: 1,
          description: "Initial partition: separate accepting and non-accepting states",
          partitions: [["q0", "q2"], ["q1", "q3", "q4"]],
          explanation: "Divide states into accepting {q0,q2} and non-accepting {q1,q3,q4}",
          choices: [
            {
              text: "Partition into {q0,q1} and {q2,q3,q4}",
              correct: false,
              explanation: "q0 and q1 have different accepting properties."
            },
            {
              text: "Keep all states separate: {q0},{q1},{q2},{q3},{q4}",
              correct: false,
              explanation: "Start by grouping states with same accepting property."
            },
            {
              text: "All states in one partition: {q0,q1,q2,q3,q4}",
              correct: false,
              explanation: "Must separate accepting from non-accepting states."
            },
            {
              text: "Partition into {q0,q2} and {q1,q3,q4}",
              correct: true,
              explanation: "Correct! Separate accepting states (q0,q2) from non-accepting states (q1,q3,q4)."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["q0", "q2"], ["q1", "q3", "q4"]],
            eliminatedStates: []
          }
        },
        {
          step: 2,
          description: "Check accepting states {q0,q2} for equivalent behavior",
          partitions: [["q0", "q2"], ["q1", "q3", "q4"]],
          explanation: "Both q0 and q2: on '0' go to non-accepting, on '1' go to accepting - no split needed",
          choices: [
            {
              text: "Split {q0,q2} because q0 goes to q1 while q2 goes to q3",
              correct: false,
              explanation: "What matters is the equivalence class of destination, not specific states."
            },
            {
              text: "Merge {q0,q2} with {q1,q3,q4}",
              correct: false,
              explanation: "Accepting and non-accepting states cannot be merged."
            },
            {
              text: "Keep {q0,q2} together - both have same transition behavior",
              correct: true,
              explanation: "Correct! Both q0 and q2 transition to non-accepting states on '0' and accepting states on '1'."
            },
            {
              text: "Split q0 and q2 into separate partitions",
              correct: false,
              explanation: "q0 and q2 have equivalent transition behaviors."
            }
          ],
          visualState: {
            mergedStates: [],
            highlightedPartitions: [["q0", "q2"], ["q1", "q3", "q4"]],
            eliminatedStates: []
          }
        },
        {
          step: 3,
          description: "Check non-accepting states {q1,q3,q4} for equivalent behavior",
          partitions: [["q0", "q2"], ["q1", "q3", "q4"]],
          explanation: "All q1, q3, q4: on '0' go to accepting, on '1' go to non-accepting - no split needed",
          choices: [
            {
              text: "Split because they go to different specific states",
              correct: false,
              explanation: "What matters is the equivalence class of destination, not specific states."
            },
            {
              text: "Merge {q1,q3,q4} with {q0,q2}",
              correct: false,
              explanation: "Accepting and non-accepting states cannot be merged."
            },
            {
              text: "Keep {q1,q3,q4} together - all have same transition behavior",
              correct: true,
              explanation: "Correct! All three states transition to accepting states on '0' and non-accepting states on '1'."
            },
            {
              text: "Split into separate partitions for each state",
              correct: false,
              explanation: "q1, q3, and q4 all have equivalent transition behaviors."
            }
          ],
          visualState: {
            mergedStates: [["q0", "q2"], ["q1", "q3", "q4"]],
            highlightedPartitions: [["q0", "q2"], ["q1", "q3", "q4"]],
            eliminatedStates: []
          }
        },
        {
          step: 4,
          description: "Finalize minimization - no further partitioning possible",
          partitions: [["q0", "q2"], ["q1", "q3", "q4"]],
          explanation: "All partitions are stableCreate minimal DFA: E = {q0,q2} (accepting), O = {q1,q3,q4} (non-accepting)",
          choices: [
            {
              text: "Try to split partitions further",
              correct: false,
              explanation: "No further splitting is possible as all states in each partition have identical behavior."
            },
            {
              text: "Since no more partitioning, partitioning done",
              correct: true,
              explanation: "Correct! The partitions are stable and minimization is completeFinal DFA has states E and O."
            },
            {
              text: "Merge the two partitions together",
              correct: false,
              explanation: "Accepting and non-accepting partitions cannot be merged."
            },
            {
              text: "Create five separate states",
              correct: false,
              explanation: "The equivalent states should remain grouped in their partitions."
            }
          ],
          visualState: {
            mergedStates: [["q0", "q2"], ["q1", "q3", "q4"]],
            highlightedPartitions: [["q0", "q2"], ["q1", "q3", "q4"]],
            eliminatedStates: [],
            finalDFA: {
              states: ["E", "O"],
              transitions: {
                "E": { "0": "O", "1": "E" },
                "O": { "0": "E", "1": "O" }
              },
              acceptStates: ["E"],
              startState: "E"
            }
          }
        }
      ],
      minimalStates: ["E", "O"],
      equivalenceClasses: [["q0", "q2"], ["q1", "q3", "q4"]]
    },
    isEquivalent: true,
    equivalenceExplanation: "Both DFAs minimize to the same 2-state DFA: accepting state E (on '0'→O, on '1'→E) and non-accepting state O (on '0'→E, on '1'→O)They recognize strings where the number of '1's has the same parity as the number of '0's."
  }
];

// Interactive choices for each step of the minimization process
const minimizationChoices = {
  initialPartition: [
    {
      text: "Separate accepting and non-accepting states",
      correct: true,
      explanation: "This is always the first step in DFA minimization"
    },
    {
      text: "Group states by number of transitions",
      correct: false,
      explanation: "The number of transitions doesn't determine equivalence"
    },
    {
      text: "Group states alphabetically",
      correct: false,
      explanation: "State names don't determine equivalence"
    }
  ],
  
  reachabilityCheck: [
    {
      text: "Remove unreachable states from consideration",
      correct: true,
      explanation: "Unreachable states can be eliminated as they don't affect the language"
    },
    {
      text: "Keep all states in separate partitions",
      correct: false,
      explanation: "Unreachable states should be identified and removed"
    },
    {
      text: "Merge all non-accepting states",
      correct: false,
      explanation: "Non-accepting states may have different behaviors"
    }
  ],
  
  transitionRefinement: [
    {
      text: "Split partitions where states have different transition destinations",
      correct: true,
      explanation: "States that transition to different equivalence classes are not equivalent"
    },
    {
      text: "Keep current partitions unchanged",
      correct: false,
      explanation: "Refinement is necessary to find truly equivalent states"
    },
    {
      text: "Merge all partitions with the same size",
      correct: false,
      explanation: "Partition size doesn't determine equivalence"
    }
  ]
};

// Test strings for equivalence checking
const testStrings = [
  "",
  "a",
  "b", 
  "ab",
  "ba",
  "aa",
  "bb",
  "aba",
  "bab",
  "aab",
  "abb",
  "baa",
  "bba",
  "abab",
  "baba",
  "aaaa",
  "bbbb",
  "aabb",
  "bbaa"
];

// Hints for common mistakes
const hints = {
  initialPartition: "Start by separating states based on their accepting/non-accepting status",
  reachability: "Check which states can be reached from the start state",
  equivalence: "Two states are equivalent if they have the same behavior for all possible inputs",
  refinement: "Look at where states transition for each input symbol",
  finalCheck: "Compare the structure and behavior of both minimized DFAs"
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    dfaExamples,
    minimizationChoices,
    testStrings,
    hints
  };
}

// Export to global scope for browser use
if (typeof window !== 'undefined') {
  window.dfaExamples = dfaExamples;
  window.minimizationChoices = minimizationChoices;
  window.testStrings = testStrings;
  window.hints = hints;
}
