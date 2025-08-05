// Verification script to ensure DFA examples are correctly labeled
// This script checks that the equivalence labels match the actual algorithm results

function verifyExamples() {
  console.log("Verifying DFA examples against the equivalence theorem...");
  
  const testStrings = [
    "", "a", "b", "ab", "ba", "aa", "bb", "aba", "bab", "aab", "abb", "baa", "bba",
    "abab", "baba", "aaaa", "bbbb", "aabb", "bbaa", "abba", "baab"
  ];
  
  dfaExamples.forEach((example, index) => {
    console.log(`\n--- Verifying Example ${index + 1}: ${example.name} ---`);
    
    const result = DFAAnalyzer.testEquivalence(example.dfa1, example.dfa2, testStrings);
    const algorithmSays = result.equivalent;
    const exampleSays = example.isEquivalent;
    
    console.log(`Algorithm result: ${algorithmSays}`);
    console.log(`Example claims: ${exampleSays}`);
    
    if (algorithmSays === exampleSays) {
      console.log("✅ CORRECT: Example label matches algorithm result");
    } else {
      console.log("❌ ERROR: Example label does not match algorithm result!");
      if (result.counterexample) {
        console.log(`Counterexample: "${result.counterexample}"`);
        console.log(`DFA1 result: ${result.dfa1Result}, DFA2 result: ${result.dfa2Result}`);
      }
    }
    
    // Test minimization steps
    console.log("\nTesting minimization...");
    const minimal1 = DFAAnalyzer.minimizeDFA(example.dfa1);
    const minimal2 = DFAAnalyzer.minimizeDFA(example.dfa2);
    
    console.log(`DFA1: ${example.dfa1.states.length} states → ${minimal1.states.length} states`);
    console.log(`DFA2: ${example.dfa2.states.length} states → ${minimal2.states.length} states`);
    
    // If equivalent, minimized DFAs should have same number of states
    if (algorithmSays && minimal1.states.length !== minimal2.states.length) {
      console.log("⚠️  WARNING: Equivalent DFAs have different numbers of minimal states");
    }
  });
  
  console.log("\n--- Verification Complete ---");
}

// Run verification when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for other scripts to load
  setTimeout(verifyExamples, 1000);
});
