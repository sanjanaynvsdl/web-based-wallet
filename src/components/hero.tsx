"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  const handleChainSelect = (chain: string) => {
    router.push(`/wallet?chain=${chain.toLowerCase()}`);
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-[calc(100vh-240px)]">
      <div className="text-center">
        <p className=" sm:max-w-3xl max-w-2xl text-foreground font-bold sm:text-4xl text-2xl tracking-tighter text-center p-2">
          &ldquo;WalletXYZ&rdquo; is multi-chain ready.
        <p>Choose where You&rsquo;d like to start.{" "}</p>
          
        </p>
        <p className="text-muted-foreground text-lg md:text-xl mt-4 text-center">
          A web based wallet helps to create wallets across chains
        </p>
      </div>

      <div className="flex gap-2 mt-6 justify-center">
        <Button
          onClick={() => handleChainSelect("Solana")}
          className="bg-primary text-primary-foreground text-md font-medium cursor-pointer hover:bg-primary/90"
        >
          Solana
        </Button>
        {/* <Button
          onClick={() => handleChainSelect("Ethereum")}
          className="bg-primary text-primary-foreground text-md font-medium cursor-pointer hover:bg-primary/90"
        >
          Ethereum
        </Button> */}
      </div>
    </div>
  );
};
