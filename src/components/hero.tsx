import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="flex justify-center items-center flex-col min-h-[calc(100vh-240px)]">
      <div className="max-w-3xl text-center">
        <p className="text-foreground font-bold sm:text-4xl text-2xl tracking-tighter text-center">
          &ldquo;WalletXYZ&rdquo; is multi-chain ready.
          <br />
          Choose where You&rsquo;d like to start.{" "}
        </p>
        <p className="text-muted-foreground text-lg md:text-xl mt-4 text-center">
          A web based wallet helps to create wallets across chains
        </p>
      </div>

      <div className="flex gap-2 mt-6 justify-center">
        <Button className="bg-primary text-primary-foreground text-md font-medium cursor-pointer">
          Solana
        </Button>
        <Button className="bg-primary text-primary-foreground text-md font-medium cursor-pointer">
          Ethereum
        </Button>
      </div>
    </div>
  );
};
