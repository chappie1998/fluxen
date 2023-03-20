import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CardModal from "./CardModal";
import { LoadingDots } from "../LoadingDots";
import { useEffect } from "react";
import { getMerketplaceContract, NFTContract } from "../../utils/GetContract";

const AllNFTs = () => {
  // const data = useSelector((state) => state.nftCollection.nftCollectionData);
  const [data, setData] = useState();

  useEffect(() => {
    const nftarray = [];
    const loadData = async () => {
      const data = await fetch(
        `${process.env.REACT_APP_WALLET_NFTS_URL}/listed-nfts`
      );
      let result = await data.json();
      for (let i = 0; i < result.length; i++) {
        const base = ".ipfs.w3s.link";
        const res = await fetch("https://" + result[i].token_uri + base);
        const data = await res.json();
        const name = data.name;
        const img = "https://" + data.image + ".ipfs.w3s.link/";
        const desc = data.description;
        nftarray.push({
          contract_id: "0x" + result[i].nft_contract,
          token: result[i].token_id,
          name,
          img,
          desc,
          owner: "0x" + result[i].owner_address,
          price: result[i].price / 1000000000,
        });
      }
      setData(nftarray);
    };
    loadData();
  }, []);

  console.log(data);

  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };
  const [modalShow, setModalShow] = useState(false);

  const buy_nft = async (contract_id, token) => {
    const contract = await getMerketplaceContract();
    const data = await contract.functions
      .get_nft_data({ value: contract_id }, token)
      .get();

    const buy_nft = await contract.functions
      .buy_nft({ value: contract_id }, parseInt(token))
      .addContracts([NFTContract(contract_id)])
      .txParams({ gasPrice: 1 })
      .callParams({
        forward: [data.value.price.toNumber()],
      })
      // .simulate();
      .call();
    console.log("buy_nft: ", buy_nft);

    alert("Congratulations on your fuel nft!");
  };

  if (!data) return <LoadingDots headerFix={true} />;
  return (
    <Fragment>
      <section className="tf-section live-auctions home5 style2 bg-style3">
        <div className="themesflat-container mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions mg-bt-21">
                <h2 className="tf-title pad-l-7">Top Picks</h2>
                {/* <Link to="/explore-03" className="exp style2">
                  EXPLORE MORE
                </Link> */}
              </div>
            </div>
            {data.slice(0, visible).map((item, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div className={`sc-card-product explode style2 mg-bt`}>
                  <div className="card-media">
                    <Link
                      to={`/asset/${item.contract_id}/${item.token}`}
                      relative="path"
                    >
                      <img src={item.img} alt="fuelart" />
                    </Link>
                    <div className="button-place-bid">
                      <button
                        onClick={() => buy_nft(item.contract_id, item.token)}
                        className="sc-button style-place-bid style bag fl-button pri-3"
                      >
                        <span>Quick Buy</span>
                      </button>
                    </div>
                    {/* <Link to="/login" className="wishlist-button heart">
                      <span className="number-like">{item.wishlist}</span>
                    </Link> */}
                    {/* <div className="coming-soon">{item.feature}</div> */}
                  </div>
                  <div className="card-title">
                    <h5>
                      <Link
                        to={`/asset/${item.contract_id}/${item.token}`}
                        relative="path"
                      >
                        {item.name}
                      </Link>
                    </h5>
                  </div>
                  {/* <div className="meta-info"> */}
                  {/* <div className="author">
                      <div className="avatar">
                      <img src={item.imgAuthor} alt="fuelart" />
                      </div>
                      <div className="info">
                      <span>Owned By</span>
                      <h6>
                      {" "}
                      <Link to="/authors-02">{item.nameAuthor}</Link>{" "}
                      </h6>
                      </div>
                    </div> */}
                  {/* </div> */}
                  <div className="card-bottom style-explode">
                    <div className="price">
                      <span>Price</span>
                      <div className="price-details">
                        <h5>{item.price} ETH</h5>
                        {/* <span>= {item.priceChange}</span> */}
                      </div>
                    </div>
                    <div className="tags">FUEL</div>

                    {/* <Link
                              to="/activity-01"
                              className="view-history reload"
                            >
                              View History
                            </Link> */}
                  </div>
                  {/* <div className="card-bottom">
                    <button
                      className="sc-button style bag fl-button pri-3 no-bg"
                      onClick={() => setModalShow(true)}
                    >
                      <span>Place Bid</span>
                    </button>
                    <Link to="/activity-01" className="view-history reload">
                      View History
                    </Link>
                  </div> */}
                </div>
              </div>
            ))}
            {visible < data.length && (
              <div className="col-md-12 wrap-inner load-more text-center">
                <Link
                  to="#"
                  id="load-more"
                  className="sc-button loadmore fl-button pri-3"
                  onClick={showMoreItems}
                >
                  <span>Load More</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

// AllNFTs.propTypes = {
//   data: PropTypes.array.isRequired,
// };

export default AllNFTs;
