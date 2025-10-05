"use client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WalletPage() {
  const searchParams = useSearchParams();
  const chain = searchParams.get("chain") || "solana";

  const [secretPhrase, setSecretPhrase] = useState("");

  return (
    <Container>
      <div className="flex justify-center items-center min-h-[calc(100vh-240px)]">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground capitalize">
              {chain} Wallet
            </h1>
            <p className="text-muted-foreground">
              Generate or import your {chain} wallet
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              className="w-full border border-input bg-background text-foreground px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your secret phrase (or leave blank to generate one)"
              type="text"
              value={secretPhrase}
              onChange={(e) => setSecretPhrase(e.target.value)}
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-lg py-6">
              Generate Wallet
            </Button>
          </div>

          <div className="mt-8 border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Your Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              No wallets generated yet. Click the button above to create one.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
