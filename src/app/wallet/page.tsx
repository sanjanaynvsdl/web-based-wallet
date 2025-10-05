"use client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateSolanaKeyPair, generateEthereumKeyPair } from "@/lib/functions";
import { FaChevronDown, FaEye, FaEyeSlash, FaCopy, FaRegTrashAlt  } from "react-icons/fa";
import { toast, Toaster } from "sonner";

// TypeScript interfaces
interface Wallet {
  id: number;
  publicKey: string;
  privateKey?: string; // Only in memory when visible
  isPrivateKeyVisible: boolean;
}

interface StoredWallet {
  id: number;
  publicKey: string;
}

export default function WalletPage() {
  const searchParams = useSearchParams();
  const chain = searchParams.get("chain") || "solana";

  const [secretPhrase, setSecretPhrase] = useState("");
  const [inputPhrase, setInputPhrase] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect theme on mount
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // LocalStorage - ONLY store public keys for security
  const saveToLocalStorage = (phrase: string, walletsData: Wallet[]) => {
    localStorage.setItem("seedPhrase", phrase);

    const walletsToStore: StoredWallet[] = walletsData.map(({ id, publicKey }) => ({
      id,
      publicKey,
    }));

    localStorage.setItem("wallets", JSON.stringify(walletsToStore));
  };

  const loadFromLocalStorage = () => {
    const savedPhrase = localStorage.getItem("seedPhrase");
    const savedWallets = localStorage.getItem("wallets");

    if (savedPhrase && savedWallets) {
      setSecretPhrase(savedPhrase);

      const storedWallets: StoredWallet[] = JSON.parse(savedWallets);
      const walletsWithoutPrivateKeys: Wallet[] = storedWallets.map((w) => ({
        ...w,
        isPrivateKeyVisible: false,
      }));

      setWallets(walletsWithoutPrivateKeys);
      return true;
    }
    return false;
  };

  // Generate wallet function
  const handleGenerateWallet = async () => {
    const currentWalletId = wallets.length;

    // Use input phrase if provided, otherwise use existing or generate new
    const phraseToUse = inputPhrase.trim() || secretPhrase || null;

    const generateFunc = chain === "ethereum" ? generateEthereumKeyPair : generateSolanaKeyPair;
    const newWalletData = await generateFunc(phraseToUse, currentWalletId);

    const newWallet: Wallet = {
      id: currentWalletId,
      publicKey: newWalletData.publicKey,
      isPrivateKeyVisible: false,
    };

    // console.log("the details are :" + " private key : " + newWallet.privateKey);
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    setSecretPhrase(newWalletData.secretPhrase);
    setInputPhrase(""); // Clear input after generating
    saveToLocalStorage(newWalletData.secretPhrase, updatedWallets);

    toast.success("Wallet generated successfully!");
  };

  // Delete wallet
  const handleDeleteWallet = (id: number) => {
    const updatedWallets = wallets.filter((wallet) => wallet.id !== id);
    setWallets(updatedWallets);
    saveToLocalStorage(secretPhrase, updatedWallets);
    toast.success("Wallet deleted successfully!");
  };

  // Clear all wallets
  const handleClearWallets = () => {
    // Clear state
    setWallets([]);
    setSecretPhrase("");
    setInputPhrase("");

    // Clear localStorage
    localStorage.removeItem("seedPhrase");
    localStorage.removeItem("wallets");

    toast.success("All wallets cleared!");
  };

  // Toggle private key - generate on demand
  const togglePrivateKeyVisibility = async (id: number) => {
    const wallet = wallets.find((w) => w.id === id);
    if (!wallet) return;

    if (!wallet.isPrivateKeyVisible) {
      const generateFunc = chain === "ethereum" ? generateEthereumKeyPair : generateSolanaKeyPair;
      const walletData = await generateFunc(secretPhrase, id);

      const updatedWallets = wallets.map((w) =>
        w.id === id
          ? { ...w, privateKey: walletData.privateKey, isPrivateKeyVisible: true }
          : w
      );
      setWallets(updatedWallets);
    } else {
      const updatedWallets = wallets.map((w) =>
        w.id === id
          ? { ...w, privateKey: undefined, isPrivateKeyVisible: false }
          : w
      );
      setWallets(updatedWallets);
    }
  };

  // Copy to clipboard with toast
  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Load on mount - don't auto-generate, let user choose
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const secretPhraseWords = secretPhrase.split(" ");

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors
        theme={isDark ? "dark" : "light"}
        toastOptions={{
          style: {
            background: isDark ? '#1a1a16' : '#ffffff',
            color: isDark ? '#f5f6ef' : '#0f1009',
            border: isDark ? '1px solid #333330' : '1px solid #d4d4d0',
          },
        }}
      />
      <Container>
        <div className="flex justify-center items-center min-h-[calc(100vh-300px)] py-8">
          <div className="w-full max-w-3xl space-y-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl tracking-tighter md:text-4xl font-bold text-foreground capitalize">
                {chain} Wallet
              </h1>
              <p className="text-muted-foreground">
                Generate or import your {chain} wallet
              </p>
            </div>

            {/* Input Section - Only show if no wallets exist */}
            {wallets.length === 0 && (
              <div className="rounded-lg p-2 ">
                <div className="flex flex-row justify-center gap-4">
                  <input
                    type="text"
                    value={inputPhrase}
                    onChange={(e) => setInputPhrase(e.target.value)}
                    placeholder="Enter your 12-word secret phrase (leave blank to generate new)"
                    className="flex-1  border border-input bg-background text-foreground px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                 
                <Button
                  onClick={handleGenerateWallet}
                  className=" bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer py-6 text-lg font-semibold"
                >
                  Generate Wallet
                </Button>
                </div>
              </div>
            )}

            {/* Secret Phrase Accordion */}
            {wallets.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowSecretPhrase(!showSecretPhrase)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-accent/10 transition-all duration-200 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-foreground">Secret Recovery Phrase</h2>
                  <FaChevronDown
                    className={`transition-transform duration-300 ${showSecretPhrase ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showSecretPhrase ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div
                      className="grid grid-cols-4 gap-3 mt-4 cursor-pointer"
                      onClick={() => copyToClipboard(secretPhrase, "Secret phrase")}
                      title="Click to copy"
                    >
                      {secretPhraseWords.map((word, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-md px-3 py-2 text-center bg-muted hover:bg-muted/70 transition-all duration-200"
                        >
                          <p className="text-sm font-medium">{word}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Click anywhere on the grid to copy to clipboard
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Wallets Section */}
          {wallets.length > 0 && (
            <div className=" rounded-lg  space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Your Wallets</h2>
                <div className="flex justify-center gap-2 ">
                  <Button
                  onClick={handleGenerateWallet}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                >
                  + Add Wallet
                </Button>
                <Button
                  onClick={handleClearWallets}
                  className="bg-destructive text-foreground hover:bg-destructive/90 transition-all cursor-pointer"
                >
                 Clear Wallets  
                </Button>

                </div>
                
              </div>

              {/* Wallet List */}
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-foreground">Wallet {wallet.id + 1}</h3>
                      <button
                        onClick={() => handleDeleteWallet(wallet.id)}
                        className="text-destructive hover:text-destructive/80 transition-all duration-200 hover:bg p-2 rounded-md cursor-pointer"
                      >
                        <FaRegTrashAlt  />
                      </button>
                    </div>

                    {/* Public Key */}
                    <div>
                      <label className="text-xs text-muted-foreground">Public Key</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded truncate">
                          {wallet.publicKey}
                        </p>
                        <button
                          onClick={() => copyToClipboard(wallet.publicKey, "Public key")}
                          className="text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>

                    {/* Private Key */}
                    <div>
                      <label className="text-xs text-muted-foreground">Private Key</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded truncate">
                          {wallet.isPrivateKeyVisible ? wallet.privateKey : "••••••••••••••••"}
                        </p>
                        <button
                          onClick={() => togglePrivateKeyVisibility(wallet.id)}
                          className="text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          {wallet.isPrivateKeyVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {wallet.isPrivateKeyVisible && wallet.privateKey && (
                          <button
                            onClick={() => copyToClipboard(wallet.privateKey!, "Private key")}
                            className="text-muted-foreground hover:text-foreground transition-all duration-200"
                          >
                            <FaCopy />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </Container>
    </>
  );
}
