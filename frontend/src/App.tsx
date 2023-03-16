import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { PropertyAbi__factory } from "./contracts/nft";
import { ManagerAbi__factory } from "./contracts/manager";
import { Address, Contract, ContractFactory, Wallet } from "fuels";
import { _abi } from "./contracts/nft/factories/PropertyAbi__factory";

const buffer = require("buffer");

const SIGN_MESSAGE = "This is a test";

function App() {
  const [address, setAddress] = useState();

  type TokenMetaData = {
    name: string;
    // symbol: string;
    token_uri: string;
  };
  const admin =
    "0xfec21894a55b54b3dd89ab836856403d20f20d2af3694e13e64a32b3e1d41f0a";
  const wallet = Wallet.fromPrivateKey(
    "0xc852a8675f20538e3c578f56d59ea928035fda840b428e873e8abc04bb2a57ab",
    "https://beta-3.fuel.network/graphql"
  );

  const contractId =
    "0x2f4df4e7dfe8ef765e159bf6f68a7c184d6010e1566d520add513086826b8f7d";
  const managerContract = ManagerAbi__factory.connect(contractId, wallet);

  const NFTContractId =
    "0xc6d83b7bd82d2cb0bbedb683d5203de491eccd1bf0da873bd24ec5e72446b825";
  // const NFTContract = PropertyAbi__factory.connect(NFTContractId, wallet);
  // console.log(PropertyAbi__factory.createInterface);

  const NFTContract = new Contract(NFTContractId, _abi, wallet);

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

  const getadmin = async () => {
    const admin = await managerContract.functions.admin().get();
    console.log("admin", admin);
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
      .list_nft({ value: NFTContractId }, token, 0.01 * 1e9)
      .txParams({ gasPrice: 1 })
      .addContracts([NFTContract])
      .call();
    console.log("list_nft", list_nft);
    // console.log("list_nft", "list_nft");
  };

  const mintAndList = async () => {
    const token = 0;
    await mint(token);
    await approveNFT(token);
    await listNFT(token);
    console.log(token);
  };

  const token_metadata = async () => {
    const token_metadata = await NFTContract.functions.token_metadata(0).get();
    console.log("token_metadata", token_metadata);
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

  const lend_nft = async () => {
    const lend_nft = await managerContract.functions
      .lend_nft(
        { value: NFTContractId },
        0,
        { Address: { value: admin } },
        8315,
        8316,
        0.01 * 1e9
      )
      .txParams({ gasPrice: 1 })
      .callParams({
        forward: [0.01 * 1e9],
      })
      .call();
    console.log("lend_nft", lend_nft);
  };

  const lended_nft_info = async () => {
    const lended_nft_info = await managerContract.functions
      .lended_nft_info({ value: NFTContractId }, 0)
      .get();
    console.log("lended_nft_info", lended_nft_info);
    console.log(
      "start_block",
      lended_nft_info.value?.[0]?.start_block.toNumber()
    );
  };

  const lended_nft_withdraw = async () => {
    const lended_nft_withdraw = await managerContract.functions
      .lended_nft_withdraw({ value: NFTContractId }, 0)
      .txParams({ gasPrice: 1 })
      .addContracts([NFTContract])
      .call();
    console.log("lended_nft_withdraw", lended_nft_withdraw);
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
        <button onClick={getadmin}>getadmin</button>
      </div>
      <div>
        <button onClick={whiltest_contract}>whiltest_contract</button>
        <button onClick={get_whiltested_contract}>
          get_whiltested_contract
        </button>
      </div>

      <div>
        <button onClick={mintAndList}>mintAndList</button>
      </div>
      <div>
        <button onClick={token_metadata}>token_metadata</button>
      </div>
      <div>
        <button onClick={lend_nft}>lend_nft</button>
        <button onClick={lended_nft_info}>lended_nft_info</button>
      </div>
      <div>
        <button onClick={lended_nft_withdraw}>lended_nft_withdraw</button>
      </div>
    </div>
  );
}

export default App;
