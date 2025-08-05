## Getting Started

1. **Open the Simulation**: Launch the DFA Minimization and Equivalence visualization in your web browser
2. **Review the Interface**: The simulation displays parallel DFA minimization with side-by-side comparison, interactive choice selection, and step-by-step minimization traces
3. **Choose Your DFAs**: Use the "Change DFAs" button to select different DFA pairs for comparison

## Understanding the Interface

### Dual-DFA Visualization
- **Left Panel**: "DFA A Minimization" - shows step-by-step partitioning process for the first DFA
- **Right Panel**: "DFA B Minimization" - displays parallel minimization steps for the second DFA
- **Center Area**: Interactive choice selection and current action display
- **Visual Canvas**: Side-by-side DFA diagrams showing states, transitions, and minimization progress

### Main Controls
- **Change DFAs**: Switch between different DFA pairs to explore various equivalence scenarios
- **Reset**: Return to the beginning of the minimization process
- **Previous Step**: Go back to the previous partitioning step
- **Show Hint**: Get guidance on the correct choice for the current step
- **Auto Step**: Automatically apply the correct minimization step

### Progress Tracking
- **Score Display**: Shows your accuracy in making correct minimization choices
- **Current Turn**: Indicates which DFA (A or B) you're currently working on
- **Phase Display**: Shows whether you're in the "Minimization" or "Equivalence" phase

## Step-by-Step Procedure

### Step 1: Select DFA Pair
1. Use **Change DFAs** to choose from available DFA examples
2. Observe the initial state diagrams for both DFA A and DFA B
3. Review the DFA descriptions to understand what languages they accept

### Step 2: Remove Unreachable States
1. **Identify Unreachable States**: Look for states that cannot be reached from the start state
2. **Choose Elimination Strategy**: Select from 4 multiple-choice options for state removal
3. **Visual Feedback**: Watch as unreachable states are highlighted and removed from the diagram
4. **Alternating Process**: Take turns between DFA A and DFA B for each minimization step

### Step 3: Initial Partitioning
1. **Separate by Accepting Property**: Partition states into accepting and non-accepting groups
2. **Interactive Selection**: Choose the correct partitioning strategy from the provided options
3. **Partition Visualization**: See how states are grouped and color-coded in the diagram

### Step 4: Refine Partitions
1. **Analyze Transition Behavior**: Examine how states in each partition behave under input symbols
2. **Identify Distinguishable States**: Find states that transition to different partitions
3. **Choose Refinement Steps**: Select the appropriate partition refinement from multiple choices
4. **Iterative Process**: Continue until no further refinement is possible

### Step 5: Compare Minimized DFAs
1. **Final State Count**: Compare the number of states in both minimized DFAs
2. **Transition Structure**: Examine the transition patterns in the final minimized forms
3. **Equivalence Determination**: Decide whether the minimized DFAs are structurally identical
4. **Language Equivalence**: Understand that identical minimized forms prove language equivalence


