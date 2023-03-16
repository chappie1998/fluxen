import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { PropertyAbi__factory } from "./contracts/nft";
import { ManagerAbi__factory } from "./contracts/manager";
import { Address, ContractFactory, Wallet } from "fuels";

const buffer = require("buffer");

const SIGN_MESSAGE = "This is a test";

function App() {
  const [address, setAddress] = useState();

  type TokenMetaData = {
    name: string;
    // symbol: string;
    token_uri: string;
  };
  const wallet = Wallet.fromPrivateKey(
    "0xc852a8675f20538e3c578f56d59ea928035fda840b428e873e8abc04bb2a57ab",
    "https://beta-3.fuel.network/graphql"
  );
  const admin =
    "0x6b63804cfbf9856e68e5b6e7aef238dc8311ec55bec04df774003a2c96e0418e";

  const contractId =
    "0xf2fd740804044104015a91096f9ee9f41a5e9749761fab16c622ea428304c8c4";
  const managerContract = ManagerAbi__factory.connect(contractId, wallet);

  const NFTContractId =
    "0x1072ca8fcab43048a5b31c1ea204748c2cb5acca6b90f3b1a02ef7a2d92386d9";
  const NFTContract = PropertyAbi__factory.connect(NFTContractId, wallet);

  const callConstructorResp = async () => {
    console.log("some1 start");
    const consttructor = await NFTContract.functions
      .constructor({ Address: { value: admin } }, 100)
      .txParams({ gasPrice: 1 })
      .call();
    console.log("some1", consttructor);
  };

  const constructorManager = async () => {
    console.log("some1 start");
    const consttructor = await managerContract.functions
      .constructor({ Address: { value: admin } })
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

  const connectWalletButton = async () => {
    const w = window;
    try {
      const accounts = await window.fuel.accounts();
      localStorage.setItem("publicKey", accounts[0]);
      // setAddress(Address.fromAddressOrString(accounts[0]).toB256());
    } catch (error) {
      const isConnected = await w.fuel.connect();
      console.log("Connection response", isConnected);
      const accounts = await w.fuel.accounts();
      localStorage.setItem("publicKey", accounts[0]);
      // setAddress(Address.fromAddressOrString(accounts[0]).toB256());
    }
  };

  const signMessage = async () => {
    let w = window;
    if (w.fuel) {
      const accounts = await w.fuel.accounts();
      const signature = await w.fuel.signMessage(accounts[0], SIGN_MESSAGE);
      if (signature && address) {
        const body = {
          varifiedBy: "fuel",
          address,
          signature,
          message: SIGN_MESSAGE,
        };
        try {
          const response = await fetch(
            `${process.env.REACT_APP_AMRKETPLACE_API_URL}/user/auth`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const getaccount = async () => {
    let w = window;
    if (w.fuel) {
      const isConnected = await w.fuel.connect();
      console.log("Connection response", isConnected);
      const accounts = await w.fuel.accounts();
      return w.fuel.getWallet(accounts[0]);
    }
  };

  const whiltest_contract = async () => {
    const whiltest_contract = await managerContract.functions
      .whiltest_contract({ value: NFTContractId })
      .txParams({ gasPrice: 1 })
      .call();
    console.log("whiltest_contract", whiltest_contract);
  };

  const get_whiltested_contract = async () => {
    const get_whiltested_contract = await managerContract.functions
      .get_whiltested_contract({ value: NFTContractId })
      .get();
    console.log("get_whiltested_contract", get_whiltested_contract);
  };

  const deployContract = async () => {
    // load the byteCode of the contract, generated from Sway source
    const data = await fetch("./deploy_contract/property.bin");

    var byteCode = new Uint8Array(await data.arrayBuffer());
    const buff = buffer.Buffer.from(byteCode);

    // load the JSON abi of the contract, generated from Sway source
    const abi = require("./deploy_contract/property-abi.json");
    // console.log(abi.toString());

    const wallet = await getaccount();
    // send byteCode and ABI to ContractFactory to load
    const factory = new ContractFactory(buff, abi, wallet);
    const contract = await factory.deployContract();
    console.log("contract successful deployed", contract);
  };

  return (
    <div className="App">
      <button
        className="sc-button fl-button style-1"
        onClick={connectWalletButton}
      >
        <span>connectWalletButton</span>
      </button>
      <button className="sc-button fl-button style-1" onClick={signMessage}>
        <span>Verify Wallet</span>
      </button>
      <div>
        <button onClick={deployContract}>deployContract</button>
      </div>
      <div>
        <button onClick={callConstructorResp}>callConstructorResp</button>
      </div>
      <div>
        <button onClick={constructorManager}>constructorManager</button>
      </div>
      <div>
        <button onClick={whiltest_contract}>whiltest_contract</button>
      </div>
      <div>
        <button onClick={get_whiltested_contract}>
          get_whiltested_contract
        </button>
      </div>
      <div>
        <button onClick={mintAndList}>mintAndList</button>
      </div>
    </div>
  );
}

export default App;
