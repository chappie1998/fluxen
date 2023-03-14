import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PropertyAbi__factory } from "./contracts/nft";
import { ManagerAbi__factory } from "./contracts/manager";
import { Wallet } from "fuels";

function App() {
  type TokenMetaData = {
    name: string;
    // symbol: string;
    token_uri: string;
  };
  const wallet = Wallet.fromPrivateKey(
    "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"
    // "https://node-beta-2.fuel.network/graphql"
  );
  const admin =
    "0x6b63804cfbf9856e68e5b6e7aef238dc8311ec55bec04df774003a2c96e0418e";

  const contractId =
    "0xf33494881c67797d70ed78277cf1fa0fff59ffecb4af62bc1989128e88f0ab95";
  const managerContract = ManagerAbi__factory.connect(contractId, wallet);

  const NFTContractId =
    "0x8383488e3f2a1e1600ce2052e14341b505355917ac9726320698b83c7443ff69";
  const NFTContract = PropertyAbi__factory.connect(NFTContractId, wallet);

  const callConstructorResp = async () => {
    console.log("some1 start");
    const consttructor = await NFTContract.functions
      .constructor({ Address: { value: admin } }, 100)
      .txParams({ gasPrice: 1 })
      .call();
    console.log("some1", consttructor);
  };

  const mint = async (token: any) => {
    // const NFTAdmin = await NFTContract.functions.admin().get();
    // console.log("NFTAdmin", NFTAdmin);
    const mintData: TokenMetaData = {
      token_uri:
        "https://bafkreidhmmldn6o5nxyfqf65x5jz7f66qcj4xy2axv2onefkzdbv4i7yta.ipfs.w3s.link/",
      name: "nftName 0" + (token + 1),
    };
    console.log(mintData);

    const mintedNFT = await NFTContract.functions
      .mint({ Address: { value: admin } }, mintData)
      .txParams({ gasPrice: 1 })
      .call();

    console.log("mint", mintedNFT);
  };

  const approveNFT = async (token: any) => {
    const approve_nft = await NFTContract.functions
      .approve({ ContractId: { value: contractId } }, token)
      .txParams({ gasPrice: 1 })
      .call();
    console.log("approve_nft", approve_nft);
  };

  const listNFT = async (token: any) => {
    const list_nft = await managerContract.functions
      .list_nft({ value: NFTContractId }, token, 0.1 * 1e9)
      .txParams({ gasPrice: 1 })
      // .addContracts([NFTContract])
      .call();
    console.log("list_nft", list_nft);
    // console.log("list_nft", "list_nft");
  };

  const mintAndList = async () => {
    const token = 0;
    await mint(token);
    // await approveNFT(token);
    // await listNFT(token);
    console.log(token);
  };

  return (
    <div className="App">
      <div>
        <button onClick={callConstructorResp}>callConstructorResp</button>
      </div>
      <div>
        <button onClick={mintAndList}>mintAndList</button>
      </div>
    </div>
  );
}

export default App;
