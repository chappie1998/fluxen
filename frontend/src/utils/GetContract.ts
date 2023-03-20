import { Address, Contract, WalletUnlocked } from "fuels";
import { NFTAbi__factory } from "../contracts/nft";
import { _abi as nftabi } from "../contracts/nft/factories/NFTAbi__factory";
import { ManagerAbi__factory } from "../contracts/manager";

// let pk = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c";

const w: any = window;

const node = process.env.REACT_APP_FUEL_NETWORK;

export const NFTContract = async (NFTContractId: any) => {
  const wallet = await getWallet();
  return NFTAbi__factory.connect(NFTContractId, wallet);
};
export const getWallet = async () => {
  if (w.fuel) {
    const accounts = await w.fuel.accounts();
    const publicKey = accounts[0];

    return w.fuel.getWallet(publicKey);
  }
};

export const getPublicKey = async () => {
  if (w.fuel) {
    const accounts = await w.fuel.accounts();
    const publicKey = accounts[0];
    return Address.fromAddressOrString(publicKey).toB256();
  }
};

export const getNftContract = async (contractId: any) => {
  const wallet = await getWallet();
  return NFTAbi__factory.connect(contractId, wallet);
};

export const getManagerContract = async () => {
  const contract_id = process.env.REACT_APP_MANAGER_CONTRACT_ID;
  if (contract_id) {
    const wallet = await getWallet();
    return ManagerAbi__factory.connect(contract_id, wallet);
  }
};
