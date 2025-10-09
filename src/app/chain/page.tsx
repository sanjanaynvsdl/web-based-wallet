"use client";

import { Container } from "@/components/container";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUpIcon,
  Copy,
  PlusIcon,
  Trash2,
} from "lucide-react";
import {
  generateEthereumKeyPair,
  generateSolanaKeyPair,
} from "@/lib/functions";

interface Wallet {
  seedphrase: string;
  publicKey: string;
  privatekey: string;
}

export default function Chain() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get("wallet") || "solana";
  const [seedphrase, setSeedPhrase] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);

  console.log(wallet);

  function loadLocalStorage() {
    const seedPhrase = localStorage.getItem("seedphrase");
    const sol_wallets = localStorage.getItem("sol_wallets");
    const eth_wallets = localStorage.getItem("eth_wallets");
  }

  function generateSolKeyPair() {
    const currWalletLen = solWallets.length;
    const { secretPhrase, privateKey, publicKey } = generateSolanaKeyPair(
      seedphrase,
      currWalletLen
    );

    const newWallet = {
      seedphrase: secretPhrase,
      publicKey: publicKey,
      privateKey: privateKey,
    };

    setSolWallets([...solWallets, newWallet]);
  }

  function generateEthKeyPair() {
    const ethWalletsLength = ethWallets.length;
    const { secretPhrase, privateKey, publicKey } = generateEthereumKeyPair(
      seedphrase,
      ethWalletsLength
    );
    console.log("---------eth key pair is ---------");
    console.log("Seed phrase : " + secretPhrase);
    console.log("public key : " + publicKey);
    console.log("private key : " + privateKey);
    const newWallet = {
      seedphrase: secretPhrase,
      publicKey: publicKey,
      privateKey: privateKey,
    };

    setEthWallets([...ethWallets, newWallet]);
  }

  return (
    <Container>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tighter ">
              {" "}
              {wallet} Wallet{" "}
            </h1>

            <p>Hello, generating the public and private keys, </p>
            <div className="flex justify-center gap-2 mt-4 w-full ">
              <Input
                type="Seed Phrase"
                placeholder="Seed Phrase"
                className="flex-1 focus:border-spacing-0.5"
                value={seedphrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
              />
              <Button
                onClick={generateEthKeyPair}
                className="bg-primary hover:bg-primary/80 text-foreground  px-4 py-2 rounded-md cursor-pointer "
              >
                Generate Wallet
              </Button>
            </div>

            {/* Seed phrase -12 words */}

            <div className="mt-4 border p-4 w-full  rounded-lg">
              <div className="flex justify-between">
                <h1 className="font-bold text-2xl text-foreground tracking-tighter">
                  Your Seed Phrase
                </h1>

                <Button
                  className="text-foreground cursor-pointer"
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                >
                  {showSeedPhrase ? (
                    <ChevronUpIcon size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </Button>
              </div>
              {showSeedPhrase && (
                <div>
                  <p>{seedphrase} fakfuk aufhuuodf adniUDF ADFUNo </p>
                </div>
              )}
            </div>

            {/* Render Wallet -btns */}
            <div className="mt-6 w-full">
              <div className="flex justify-between w-full">
                <h1 className="text-foreground font-bold text-2xl sm:text-3xl px-3 tracking-tighter ">
                  Wallets
                </h1>
                <div className="flex gap-2 justify-center">
                  <Button className="p-4 bg-primary cursor-pointer text-foreground">
                    <PlusIcon />
                    <p> Add wallet</p>
                  </Button>

                  <Button className="bg-destructive/90 p-2 hover:bg-destructive/80 cursor-pointer  text-foreground">
                    <Trash2 size={20} />
                    Clear Wallets
                  </Button>
                </div>
              </div>
            </div>

            {/* Render all wallets with get Balance functionality */}

            <div className="mt-4 p-2 border w-full rounded-lg">
              <div className="flex p-2 flex-col text-left">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-xl tracking-tight ">
                    Wallet 1
                  </p>
                  <div className="flex justify-center gap-2 items-center">
                    <Button className="bg-primary-foreground border text-foreground p-2 rounded-md ">
                      Check Balance
                    </Button>
                    <div>200 sol</div>
                  </div>
                </div>

                <div className="">
                  <p className="text-foreground font-medium">Public Key</p>
                  <div className="flex justify-between text-muted-foreground p-1 ">
                    <p>fndwfauifbaifbvaef</p>
                    <Copy size={20} />
                  </div>
                </div>
                <div className="">
                  <p className="font-medium text-foreground">Private Key</p>
                  <p className="text-sm  text-muted-foreground">
                    fbauiefaierbf
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
