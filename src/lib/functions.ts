import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
// import { HDKey } from "ethereum-cryptography/hdkey";
import bs58 from "bs58";


//not yet implemented fully, 
export const generateEthereumKeyPair = async (
  userMnemonic: string | null,
  walletId: number
) => {
//   let mnemonic;
//   if (userMnemonic == null || userMnemonic === "") {
//     mnemonic = generateMnemonic();
//   } else {
//     mnemonic = userMnemonic.trim();
//   }

//   const seed = mnemonicToSeedSync(mnemonic);
//   const path = `m/44'/60'/${walletId}'/0/0`; // Ethereum derivation path
//   const hdkey = HDKey.fromMasterSeed(seed);
//   const wallet = hdkey.derive(path);

//   const privateKey = wallet.privateKey ? Buffer.from(wallet.privateKey).toString("hex") : "";
//   const publicKey = wallet.publicKey ? `0x${Buffer.from(wallet.publicKey).toString("hex")}` : "";

//   console.log("mnemonic is: " + mnemonic);
//   console.log("1. privatekey: " + privateKey);
//   console.log("2. public key: " + publicKey);

  return {
    secretPhrase: "xyz",
    privateKey: "yet to implement ",
    publicKey: "yet to implement"
  };
};

export const generateSolanaKeyPair = async (
  userMnemonic: string | null,
  walletId: number
) => {
  let mnemonic;
  if (userMnemonic == null || userMnemonic === "") {
    console.log("generating the mnemonic : " );
    mnemonic = generateMnemonic();
  } else {
    mnemonic = userMnemonic.trim();
  }

  const seedphrase = mnemonicToSeedSync(mnemonic);
  console.log("path id is :" +walletId);
  const path = `m/44'/501'/${walletId.toString()}'/0'`; // This is the derivation path
  const derived = derivePath(path, seedphrase.toString("hex")); // ed25519-hd-key expects hex string
  const keypair = Keypair.fromSeed(new Uint8Array(derived.key));
  const privateKey = keypair.secretKey.slice(0, 32); // first 3
//   const privateKey = bs58.encode(keypair.secretKey.slice(0, 32));

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
