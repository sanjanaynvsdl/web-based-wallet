"use client";

import { Container } from "@/components/container";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import {
  ChevronDown,
  Copy,
  PlusIcon,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  generateEthereumKeyPair,
  generateSolanaKeyPair,
} from "@/lib/functions";
import { toast, Toaster } from "sonner";

interface Wallet {
  id: number;
  publicKey: string;
  privateKey?: string;
  isPrivateKeyVisible: boolean;
}

interface StoredWallet {
  id: number;
  publicKey: string;
}

interface AccountBalance{
  wallet:string,
  publicKey:string,
  balance:string,
  isBalanceVisible:boolean,
}

function ChainContent() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") || "solana";
  const [seedphrase, setSeedPhrase] = useState("");
  const [inputPhrase, setInputPhrase] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] = useState<AccountBalance[]>([]);

  const currentWallets = wallet === "solana" ? solWallets : ethWallets;
  const setCurrentWallets =
    wallet === "solana" ? setSolWallets : setEthWallets;

  // Detect theme on mount
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    loadLocalStorage();
  }, []);

  function saveToLocalStorage(
    phrase: string,
    solWalletsData: Wallet[],
    ethWalletsData: Wallet[]
  ) {
    localStorage.setItem("seedphrase", phrase);

    const solWalletsToStore: StoredWallet[] = solWalletsData.map(
      ({ id, publicKey }) => ({
        id,
        publicKey,
      })
    );

    const ethWalletsToStore: StoredWallet[] = ethWalletsData.map(
      ({ id, publicKey }) => ({
        id,
        publicKey,
      })
    );

    localStorage.setItem("sol_wallets", JSON.stringify(solWalletsToStore));
    localStorage.setItem("eth_wallets", JSON.stringify(ethWalletsToStore));
  }

  function loadLocalStorage() {
    const seedPhrase = localStorage.getItem("seedphrase");
    const sol_wallets = localStorage.getItem("sol_wallets");
    const eth_wallets = localStorage.getItem("eth_wallets");

    if (seedPhrase) {
      setSeedPhrase(seedPhrase);
    }

    if (sol_wallets) {
      const storedSolWallets: StoredWallet[] = JSON.parse(sol_wallets);
      const solWalletsWithoutPrivateKeys: Wallet[] = storedSolWallets.map(
        (w) => ({
          ...w,
          isPrivateKeyVisible: false,
        })
      );
      setSolWallets(solWalletsWithoutPrivateKeys);
    }

    if (eth_wallets) {
      const storedEthWallets: StoredWallet[] = JSON.parse(eth_wallets);
      const ethWalletsWithoutPrivateKeys: Wallet[] = storedEthWallets.map(
        (w) => ({
          ...w,
          isPrivateKeyVisible: false,
        })
      );
      setEthWallets(ethWalletsWithoutPrivateKeys);
    }
  }

  function generateSolKeyPair() {
    setIsLoading(true);
    try {
      const currWalletLen = solWallets.length;
      const phraseToUse = inputPhrase.trim() || seedphrase || null;

      const { secretPhrase, privateKey, publicKey } = generateSolanaKeyPair(
        phraseToUse,
        currWalletLen
      );

      const newWallet: Wallet = {
        id: currWalletLen,
        publicKey: publicKey,
        isPrivateKeyVisible: false,
      };

      const updatedWallets = [...solWallets, newWallet];
      setSolWallets(updatedWallets);
      setSeedPhrase(secretPhrase);
      setInputPhrase("");
      saveToLocalStorage(secretPhrase, updatedWallets, ethWallets);

      toast.success("Solana wallet generated successfully!");
    } catch (error) {
      toast.error("Failed to generate Solana wallet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function generateEthKeyPair() {
    setIsLoading(true);
    try {
      const ethWalletsLength = ethWallets.length;
      const phraseToUse = inputPhrase.trim() || seedphrase || null;

      const { secretPhrase, privateKey, publicKey } = generateEthereumKeyPair(
        phraseToUse,
        ethWalletsLength
      );

      const newWallet: Wallet = {
        id: ethWalletsLength,
        publicKey: publicKey,
        isPrivateKeyVisible: false,
      };

      const updatedWallets = [...ethWallets, newWallet];
      setEthWallets(updatedWallets);
      setSeedPhrase(secretPhrase);
      setInputPhrase("");
      saveToLocalStorage(secretPhrase, solWallets, updatedWallets);

      toast.success("Ethereum wallet generated successfully!");
    } catch (error) {
      toast.error("Failed to generate Ethereum wallet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddWallet = () => {
    if (wallet === "solana") {
      generateSolKeyPair();
    } else {
      generateEthKeyPair();
    }
  };

  const handleClearWallets = () => {
    if (wallet === "solana") {
      setSolWallets([]);
      saveToLocalStorage(seedphrase, [], ethWallets);
    } else {
      setEthWallets([]);
      saveToLocalStorage(seedphrase, solWallets, []);
    }
    toast.success(`All ${wallet} wallets cleared!`);
  };

  const handleDeleteWallet = (id: number) => {
    if (wallet === "solana") {
      const updatedWallets = solWallets.filter((w) => w.id !== id);
      setSolWallets(updatedWallets);
      saveToLocalStorage(seedphrase, updatedWallets, ethWallets);
    } else {
      const updatedWallets = ethWallets.filter((w) => w.id !== id);
      setEthWallets(updatedWallets);
      saveToLocalStorage(seedphrase, solWallets, updatedWallets);
    }
    toast.success("Wallet deleted successfully!");
  };

  const togglePrivateKeyVisibility = async (id: number) => {
    const walletItem = currentWallets.find((w) => w.id === id);
    if (!walletItem) return;

    if (!walletItem.isPrivateKeyVisible) {
      setIsLoading(true);
      try {
        const generateFunc =
          wallet === "ethereum"
            ? generateEthereumKeyPair
            : generateSolanaKeyPair;
        const walletData = generateFunc(seedphrase, id);

        const updatedWallets = currentWallets.map((w) =>
          w.id === id
            ? {
                ...w,
                privateKey: walletData.privateKey,
                isPrivateKeyVisible: true,
              }
            : w
        );
        setCurrentWallets(updatedWallets);
      } catch (error) {
        toast.error("Failed to retrieve private key");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const updatedWallets = currentWallets.map((w) =>
        w.id === id
          ? { ...w, privateKey: undefined, isPrivateKeyVisible: false }
          : w
      );
      setCurrentWallets(updatedWallets);
    }
  };

  const copyToClipboard = (text: string, label: string = "Text") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCheckBalance = async (publicKey: string) => {
    setIsLoading(true);

    try {
      if (wallet === "solana") {
        const res = await axios.post(
          "https://solana-mainnet.g.alchemy.com/v2/eAmgKxm2U2tb3LrxE79Nf",
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [publicKey],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const lamports = res.data?.result?.value?.lamports ?? 0;
        const sol = lamports / 1_000_000_000;

        setBalances((prev) => {
          const existing = prev.filter((b) => b.publicKey !== publicKey);
          return [
            ...existing,
            {
              wallet: "solana",
              publicKey,
              balance: sol.toFixed(4),
              isBalanceVisible: true,
            },
          ];
        });

        toast.success(`Balance: ${sol.toFixed(4)} SOL`);
      } else if (wallet === "ethereum") {
        const res = await axios.post(
          "https://eth-mainnet.g.alchemy.com/v2/eAmgKxm2U2tb3LrxE79Nf",
          {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [publicKey, "latest"],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const hexBalance = res.data.result;
        const eth = Number(BigInt(hexBalance) / 10n ** 18n);
        const ethFraction = Number(BigInt(hexBalance) % 10n ** 18n) / 1e18;
        const totalEth = eth + ethFraction;

        setBalances((prev) => {
          const existing = prev.filter((b) => b.publicKey !== publicKey);
          return [
            ...existing,
            {
              wallet: "ethereum",
              publicKey,
              balance: totalEth.toFixed(4),
              isBalanceVisible: true,
            },
          ];
        });

        toast.success(`Balance: ${totalEth.toFixed(4)} ETH`);
      }
    } catch (error) {
      toast.error("Failed to fetch balance");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const secretPhraseWords = seedphrase.split(" ").filter((word) => word);

  return (
    <>
      <Toaster
        position="bottom-right"
        richColors
        theme={isDark ? "dark" : "light"}
        toastOptions={{
          style: {
            background: isDark ? "#1a1a16" : "#ffffff",
            color: isDark ? "#f5f6ef" : "#0f1009",
            border: isDark ? "1px solid #333330" : "1px solid #d4d4d0",
          },
        }}
      />
      <Container>
        <div className="flex justify-center items-center min-h-[calc(100vh-300px)] py-8">
          <div className="w-full max-w-3xl space-y-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl tracking-tighter md:text-4xl font-bold text-foreground capitalize">
                {wallet} Wallet
              </h1>
              <p className="text-muted-foreground">
                Generate or import your {wallet} wallet
              </p>
            </div>

            {/* Input Section - Only show if no wallets exist */}
            {currentWallets.length === 0 && (
              <div className="rounded-lg p-2">
                <div className="flex sm:flex-row flex-col justify-center gap-4">
                  <Input
                    type="text"
                    value={inputPhrase}
                    onChange={(e) => setInputPhrase(e.target.value)}
                    placeholder="Enter your 12-word secret phrase (leave blank to generate new)"
                    className="flex-1 border border-input bg-background text-foreground px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />

                  <Button
                    onClick={handleAddWallet}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer p-4 text-md font-semibold"
                  >
                    {isLoading ? "Generating..." : "Generate Wallet"}
                  </Button>
                </div>
              </div>
            )}

            {/* Secret Phrase Accordion */}
            {currentWallets.length > 0 && seedphrase && (
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-accent/10 transition-all duration-200 cursor-pointer"
                >
                  <h2 className="text-2xl tracking-tighter font-bold text-foreground">
                    Secret Recovery Phrase
                  </h2>
                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      showSeedPhrase ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showSeedPhrase
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div
                      className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4 cursor-pointer"
                      onClick={() =>
                        copyToClipboard(seedphrase, "Secret phrase")
                      }
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
            {currentWallets.length > 0 && (
              <div className="rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tighter text-foreground">
                    Your Wallets
                  </h2>
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={handleAddWallet}
                      disabled={isLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <PlusIcon size={16} />
                      <p>Add Wallet</p>
                    </Button>

                    <Button
                      onClick={handleClearWallets}
                      className="bg-destructive text-foreground hover:bg-destructive/90 transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Clear Wallets
                    </Button>
                  </div>
                </div>

                {/* Wallet List */}
                <div className="space-y-4">
                  {currentWallets.map((walletItem) => (
                    <div
                      key={walletItem.id}
                      className="border border-border rounded-lg p-4 space-y-3 hover:bg-accent/5 transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">
                          Wallet {walletItem.id + 1}
                        </h3>
                        <div className="flex gap-2 items-center">
                          <Button
                            onClick={() =>
                              handleCheckBalance(walletItem.publicKey)
                            }
                            className="bg-primary/10 border border-primary text-foreground px-3 py-1 text-sm rounded-md hover:bg-primary/20 cursor-pointer"
                          >
                            {balances.find(
                              (b) => b.publicKey === walletItem.publicKey
                            )
                              ? `Balance : ${
                                  balances.find(
                                    (b) => b.publicKey === walletItem.publicKey
                                  )?.balance
                                } ${wallet === "solana" ? "SOL" : "ETH"}`
                              : "Check Balance"}
                          </Button>
                          <button
                            onClick={() => handleDeleteWallet(walletItem.id)}
                            className="text-destructive hover:text-destructive/80 transition-all duration-200 p-2 rounded-md cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Public Key */}
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Public Key
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded truncate">
                            {walletItem.publicKey}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                walletItem.publicKey,
                                "Public key"
                              )
                            }
                            className="text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                          >
                            <Copy size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Private Key */}
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Private Key
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="flex-1 text-sm font-mono bg-muted px-3 py-2 rounded truncate">
                            {walletItem.isPrivateKeyVisible
                              ? walletItem.privateKey
                              : "••••••••••••••••"}
                          </p>
                          <button
                            onClick={() =>
                              togglePrivateKeyVisibility(walletItem.id)
                            }
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                          >
                            {walletItem.isPrivateKeyVisible ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                          {walletItem.isPrivateKeyVisible &&
                            walletItem.privateKey && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    walletItem.privateKey!,
                                    "Private key"
                                  )
                                }
                                className="text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                              >
                                <Copy size={18} />
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

export default function Chain() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChainContent />
    </Suspense>
  );
}
