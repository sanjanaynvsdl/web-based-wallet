import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
// import { HDKey } from "ethereum-cryptography/hdkey";
import bs58 from "bs58";


//not yet implemented fully, 
export const generateEthereumKeyPair =  (
  userMnemonic: string | null,
  walletId: number
) => {
  let mnemonic;
  if (userMnemonic == null || userMnemonic === "") {
    mnemonic = generateMnemonic();
  } else {
    mnemonic = userMnemonic.trim();
  }

  // const seed = mnemonicToSeedSync(mnemonic);
  const mnemonicphrase = ethers.Mnemonic.fromPhrase(mnemonic);
  const path = `m/44'/60'/${walletId}'/0/0`; 
  const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicphrase, path);
  //the HDNodeWallet internally, uses the keccak algorithm and takes out 20 bytes from the public key and then appends 0x and returns it

  return {
    secretPhrase: mnemonic,
    privateKey: wallet.privateKey,
    publicKey: wallet.address
  };
};

export const generateSolanaKeyPair =  (
  userMnemonic: string | null,
  walletId: number
) => {
  let mnemonic;
  if (userMnemonic == null || userMnemonic === "") {
    mnemonic = generateMnemonic();
  } else {
    mnemonic = userMnemonic.trim();
  }

  const seedphrase = mnemonicToSeedSync(mnemonic);

  const path = `m/44'/501'/${walletId.toString()}'/0'`; // This is the derivation path
  const derived = derivePath(path, seedphrase.toString("hex")); // ed25519-hd-key expects hex string
  const keypair = Keypair.fromSeed(new Uint8Array(derived.key));

  const exportedPrivateKey = bs58.encode(keypair.secretKey);
  const publickey = keypair.publicKey.toBase58();


//   console.log("mnemonic is : " +mnemonic);
//   console.log("1. privatekey : "+exportedPrivateKey);
//   console.log("2. public key : "+publickey);

  return {
    secretPhrase: mnemonic,
    privateKey: exportedPrivateKey,
    publicKey: publickey
  }
};

// For testing: uncomment the line below
// generateSolanaKeyPair(null, 1).then(console.log);
