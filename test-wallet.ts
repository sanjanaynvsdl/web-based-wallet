import { generateSolanaKeyPair } from "./src/lib/functions";

// Test 1: Generate new wallet
console.log("=== Test 1: Generate New Wallet ===");
generateSolanaKeyPair(null, 0).then((wallet) => {
  console.log("Generated Wallet:", wallet);
});

// Test 2: Use existing mnemonic
console.log("\n=== Test 2: Use Existing Mnemonic ===");
const existingMnemonic = "your test mnemonic here if you have one";
generateSolanaKeyPair(existingMnemonic, 0).then((wallet) => {
  console.log("Wallet from mnemonic:", wallet);
});
