import { ContractFactory, JsonAbi, WalletUnlocked } from "fuels";
import { readFileSync } from "fs";

const main = async () => {
  // We're using `WalletUnlocked` instead of `Wallet`
  // const wallet = new WalletUnlocked(
  //   "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"
  // );
  const wallet = new WalletUnlocked(
    "0xc852a8675f20538e3c578f56d59ea928035fda840b428e873e8abc04bb2a57ab",
    "https://beta-3.fuel.network/graphql"
  );

  const deployNFTContract = async () => {
    const bytecode = readFileSync(
      "/home/ankit/fluxen/contracts/nft/out/debug/nft.bin"
    ); // Read the binary file
    const abiJSON = JSON.parse(
      readFileSync(
        "/home/ankit/fluxen/contracts/nft/out/debug/nft-abi.json"
      ).toString()
    ) as JsonAbi;
    const factory = new ContractFactory(bytecode, abiJSON, wallet);
    console.log("deploying NFT contract");
    const contract = await factory.deployContract({
      gasPrice: 100,
      gasLimit: 1_000_000,
      storageSlots: [],
    }); // deployContract takes no argument here.
    console.log("NFT contract", contract.id.toB256());
  };

  const deployManagerContract = async () => {
    const bytecode = readFileSync(
      "/home/ankit/fluxen/contracts/manager/out/debug/manager.bin"
    ); // Read the binary file
    const abiJSON = JSON.parse(
      readFileSync(
        "/home/ankit/fluxen/contracts/manager/out/debug/manager-abi.json"
      ).toString()
    ) as JsonAbi;
    const factory = new ContractFactory(bytecode, abiJSON, wallet);
    console.log("deploying marketplace contract");
    const contract = await factory.deployContract({
      gasPrice: 100,
      gasLimit: 1_000_000,
      storageSlots: [],
    }); // deployContract takes no argument here.
    console.log("manager contract", contract.id.toB256());
  };

  await deployManagerContract();
  await deployNFTContract();
};

main()
  .then(() => process.exit)
  .catch((err) => console.log(err));
