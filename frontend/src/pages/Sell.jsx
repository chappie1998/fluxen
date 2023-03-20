import { useState, useEffect } from "react";
import img1 from "../assets/images/test/anger.jpg";
import { ProductCard } from "../components/ProductCard";
import { useParams } from "react-router-dom";
import {
  getManagerContract,
  getWallet,
  NFTContract,
} from "../utils/GetContract";
import { Contract, Address, bn } from "fuels";
import { _abi } from "../contracts/nft/factories/NFTAbi__factory.ts";
import { LoadingDots } from "../components/LoadingDots";
import { NFTAbi__factory } from "../contracts/nft";

export const Sell = () => {
  const [selected, setSelected] = useState(true);
  const [price, setPrice] = useState();
  const [potentialEarnings, setPotentialEarnings] = useState();
  const [data, setData] = useState();
  const [contractCall, setContractCall] = useState(false);

  const serviceFee = 2.5;
  const creatorEarnings = 0;

  const { contract_id, token } = useParams();

  useEffect(() => {
    const loadData = async () => {
      // const base = ".ipfs.w3s.link";
      // const metaData = await NFTContract(contract_id)
      //   .functions.token_metadata(token)
      //   .get();
      // const res = await fetch("https://" + metaData.value?.token_uri + base);
      // const data = await res.json();
      // const url = "https://" + data.image + base;
      // setData({
      //   title: data.name,
      //   description: data.description,
      //   imgUrl: url,
      // });
      const data = await fetch(
        `${
          process.env.REACT_APP_WALLET_NFTS_URL
        }/nft-data/${contract_id.replace("0x", "")}/${token}`
      );
      let result = await data.json();
      setData({
        title: result.name,
        description: result.description,
        imgUrl: result.image,
      });
    };
    loadData();
  }, []);

  function handleClick(e) {
    e.stopPropagation();
    setSelected((prev) => !prev);
  }

  function handlePrice(e) {
    const price = e.target.value;
    setPrice(price);
    const PE = price * (1 - 0.01 * serviceFee - 0.01 * creatorEarnings);
    setPotentialEarnings(PE);
  }

  const listNFT = async () => {
    setContractCall(true);
    try {
      const wallet = await getWallet();
      const contractInstance = await getManagerContract();
      const nftcontractInstance = NFTAbi__factory.connect(contract_id, wallet, {
        cache: false,
      });
      // const nftcontractInstance = await getNftContract(contract_id);

      const amount = bn(price * 1e9);
      const calls = [
        nftcontractInstance.functions.approve(
          { ContractId: { value: contractInstance.id } },
          token
        ),
        contractInstance.functions.list_nft(
          { value: contract_id },
          token,
          amount
        ),
      ];

      const scope = contractInstance
        .multiCall(calls)
        .addContracts([NFTContract(contract_id)]);

      const results = await scope.txParams({ gasPrice: 10 }).call();
      console.log("calls: ", results);
      alert("listed nft");
    } catch (error) {
      console.log(error);
    } finally {
      setContractCall(false);
    }
  };

  return (
    <div className="item-details sell">
      {contractCall ? <LoadingDots fullScreen={true} /> : <></>}
      <section className="tf-item-details tf-section">
        <div className="themesflat-container mt-5 px-5">
          <h2 className="tf-title-heading style-2 mg-bt-12">List for sale</h2>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 pr-5">
              <h3 className="tf-title-heading style-2 mg-bt-12">
                Choose a type of sale
              </h3>
              <div
                className={`fixedPrice ${selected ? "selected" : ""} `}
                onClick={handleClick}
              >
                <div>
                  <h4>Fixed price</h4>
                  <p className="text-muted">
                    The item is listed at the price you set
                  </p>
                </div>
                <div>
                  <input
                    min={0}
                    type="checkbox"
                    checked={selected}
                    onChange={handleClick}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="priceInput mt-4">
                <h3 className="tf-title-heading style-2 mg-bt-12">
                  Choose a type of sale
                </h3>
                <div id="side-bar" className="side-bar style-2 pl-0">
                  <div className="widget widget-search mgbt-24">
                    <form action="#">
                      <input
                        className="style-2"
                        type="number"
                        placeholder="Amount"
                        required
                        value={price}
                        onChange={handlePrice}
                      />
                      <span>ETH</span>
                    </form>
                  </div>
                </div>
              </div>
              <div className="summery">
                <h3 className="tf-title-heading style-2 mg-bt-12">Summery</h3>
                <ul>
                  <li>
                    <span>Listing price</span>
                    <span>{price ? price : "--"} ETH</span>
                  </li>
                  <li>
                    <span>Service fees</span>
                    <span>{serviceFee}%</span>
                  </li>
                  {/* <li>
                    <span>Creator earnings</span>
                    <span>{data.creatorEarnings}%</span>
                  </li> */}
                </ul>
                <h3>
                  <span>Potential earnings</span>
                  <span>
                    {potentialEarnings ? potentialEarnings : "--"} ETH
                  </span>
                </h3>
              </div>
              <div className="col-md-12 text-center mt-5">
                <button
                  disabled={!price}
                  className="sc-button fl-button style-1"
                  onClick={listNFT}
                >
                  <span>Complete Listing</span>
                </button>
              </div>
            </div>
            {data ? (
              <div className="col-lg-4 col-md-4 col-12">
                <ProductCard
                  title={data.title}
                  imgUrl={data.imgUrl}
                  subTitle={data.description}
                  price={price}
                  tag="Fuel"
                />
              </div>
            ) : (
              <div className="col-lg-6 col-md-6 col-12">
                <LoadingDots />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
