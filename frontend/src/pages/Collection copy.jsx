import { Accordion } from "react-bootstrap-accordion";
import { useEffect, useRef, useState } from "react";
import img1 from "../assets/images/box-item/card-item-3.jpg";
import { Link, useParams } from "react-router-dom";
import { getMerketplaceContract, NFTContract } from "../utils/GetContract";
import { Toggle } from "../elements/Toggle";
import { LoadingDots } from "../components/LoadingDots";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { BsFillGridFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { Provider } from "fuels";

const formatAddress = (address) =>
  typeof address === "string"
    ? `${address.slice(0, 5)}...${address.slice(-3)}`
    : "";

const SLIDER_MAX_VALUE = 50;

let filters = {};

export const Collection = () => {
  const [nftData, setNftData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [contractCall, setContractCall] = useState(false);
  const [collectionDetails, setCollectionDetails] = useState();
  const [floorPrice, setFloorPrice] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [buyNowState, setBuyNowState] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Price: Low to high");
  const [nftHistory, setNftHistory] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const minPriceRef = useRef();
  const maxPriceRef = useRef();

  const { contract_id } = useParams();

  const activityTableHeader = [
    // "",
    "name",
    "transaction type",
    "seller",
    "buyer",
    "total amount",
    "time",
  ];

  const total_supply = async () => {
    const total_supply = await await NFTContract(contract_id)
      .functions.total_supply()
      .get();
    setTotalSupply(total_supply.value.toNumber());
  };

  const loadHistory = async () => {
    let provider = new Provider("https://node-beta-2.fuel.network/graphql");
    const block = Number(await provider.getBlockNumber());
    const current_time = Number((await provider.getBlock(block))?.time);
    let array = [];
    const data = await fetch(
      `${
        process.env.REACT_APP_AMRKETPLACE_API_URL
      }/collection-history/${contract_id.replace("0x", "")}`
    );
    let result = await data.json();
    for (const h of result) {
      const time = Number((await provider.getBlock(h.block_height))?.time);
      array.push({
        name: "test",
        transaction_type: h.transaction_type,
        seller: h.address,
        buyer: h.buyer_address,
        amount: h.price / 1e9,
        time: current_time - time,
      });
    }
    setNftHistory(array);
  };

  const loadData = async (condition) => {
    condition.page = 1;
    const data = await fetch(
      `${process.env.REACT_APP_AMRKETPLACE_API_URL}/collection-nfts`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condition),
      }
    );
    let result = await data.json();
    setNftData(result.data);
    setLoading(false);
  };

  const loadCollectionDetails = async (condition) => {
    const data = await fetch(
      `${
        process.env.REACT_APP_AMRKETPLACE_API_URL
      }/collection-details/${contract_id.slice(2)}`
    );
    let result = await data.json();
    const total_listed = result.total_listed;
    const available_attributes = structuredClone(result.available_attributes);
    const attributes = available_attributes.reduce((prev, curr) => {
      prev[curr.attribute.trait_type] = prev[curr.attribute.trait_type] || [];
      const content = {
        name: curr.attribute.value,
        count: curr.count,
        floorPrice: curr.floor_price,
      };
      prev[curr.attribute.trait_type].push(content);
      return prev;
    }, {});

    const details = result.details;
    let social_list = [];
    if (details) {
      if (details.website)
        social_list.push({
          icon: "fa fa-globe",
          link: details.website,
        });
      if (details.twitter)
        social_list.push({
          icon: "fab fa-twitter",
          link: details.twitter,
        });
      if (details.discord)
        social_list.push({
          icon: "icon-fl-vt",
          link: details.discord,
        });
      if (details.telegram)
        social_list.push({
          icon: "fab fa-telegram-plane",
          link: details.telegram,
        });
    }

    setCollectionDetails({
      total_listed,
      name: details.name,
      image: details.image,
      description: details.description,
      attributes,
      social_list,
      total_volume: details.total_volume,
    });
  };

  useEffect(() => {
    filters = {
      id: contract_id.slice(2),
      status: true,
      limit: 10,
      page: 1,
    };
    loadData(filters);
    loadCollectionDetails();
    loadHistory();
    total_supply();
  }, []);

  useEffect(() => {
    setSliderValue(selected.length);
    // add the price of all nfts
    const totalPrice = selected.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(totalPrice);
  }, [selected]);

  const priceRange = async () => {
    setBuyNowState(true);
    filters = {
      ...filters,
      max_price: maxPriceRef?.current?.value * 1e9,
      min_price: minPriceRef?.current?.value * 1e9,
    };
    loadData(filters);
  };

  const buy_now_nfts_api = async (state) => {
    setBuyNowState(state);
    if (state) filters.status = state;
    else delete filters.status;
    loadData(filters);
  };

  const handleClick = (item, e) => {
    const clickedCard = e.target.closest(".nft-card");
    clickedCard.classList.toggle("selected");

    if (clickedCard.classList.contains("selected")) {
      setSelected((prev) => [...prev, item]);
    } else {
      setSelected((prev) =>
        prev.filter((nft) => nft.token_id !== item.token_id)
      );
    }
  };

  const removeSelectedNft = (item) => {
    const clickedCard = document.getElementById(
      `${item.nft_data.name}${item.token_id}`
    );
    clickedCard.classList.remove("selected");
    setSelected((prev) => prev.filter((nft) => nft.token_id !== item.token_id));
  };

  const buy_now = async () => {
    // if (buyNowState) {
    if (selected.length > 0) {
      setContractCall(true);
      try {
        const contract = await getMerketplaceContract();
        let calls = [];
        for (const selectedNft of selected) {
          let call = contract.functions
            .buy_nft({ value: contract_id }, parseInt(selectedNft.token))
            .callParams({
              forward: [selectedNft.price * 1e9],
            });
          calls.push(call);
        }
        const results = await contract
          .multiCall(calls)
          .addContracts([NFTContract(contract_id)])
          .call();
        console.log(results);
        // alert("you bought bnt");
        loadData();
        setSelected([]);
      } catch (error) {
        console.log(error);
      } finally {
        setContractCall(false);
        loadData({
          id: contract_id.replace("0x", ""),
          status: true,
        });
      }
    }
    // } else {
    //   alert("Select listed nfts only!");
    // }
  };

  const handleSliderChange = (e) => {
    const sliderValue = +e.target.value;
    setSliderValue(sliderValue);
    setSelected(nftData.slice(0, sliderValue));
    const allNftNode = document.querySelectorAll(".nft-card");
    for (
      let index = 0;
      index <=
      (allNftNode.length < SLIDER_MAX_VALUE
        ? allNftNode.length
        : SLIDER_MAX_VALUE);
      index++
    ) {
      const node = allNftNode[index];
      if (node) {
        index < sliderValue
          ? node.classList.add("selected")
          : node.classList.remove("selected");
      } else break;
    }
  };

  const handleHide = (e, side) => {
    if (side === "left") {
      const node = e.target.closest(".left");
      node.classList.toggle("hide");
    }
    if (side === "right") {
      const node = e.target.closest(".right");
      node.classList.toggle("hide");
    }
  };

  const handleFilter = (e, value) => {
    setBuyNowState(true);
    setSelectedFilter(e.target.innerText);
    filters = {
      ...filters,
      sort: value,
    };
    if (value === "recently") {
      delete filters.sort;
    }
    loadData(filters);
  };

  const handleGrid = (e, grid) => {
    e.stopPropagation();
    const nftCardNode = document.querySelector(".box-explore");
    if (grid === "grid3") nftCardNode.classList.add("small-card");
    else nftCardNode.classList.remove("small-card");
    const nodeList = document.querySelectorAll(".gridIcon");
    nodeList.forEach((node) => {
      if (node.attributes.name.value === grid) {
        node.classList.add("selected");
      } else node.classList.remove("selected");
    });
  };

  const handleAttributFilter = (e, traitType, value) => {
    e.stopPropagation();
    e.target.closest(".attr").classList.toggle("selected");
    let attributes = filters.attributes || [];
    const found = attributes.some(
      (attr) => attr.trait_type === traitType && attr.value === value.name
    );
    const newAttribute = { trait_type: traitType, value: value.name };
    if (found) {
      attributes = attributes.filter((obj) =>
        Object.keys(newAttribute).some((key) => obj[key] !== newAttribute[key])
      );
    } else {
      attributes.push(newAttribute);
    }
    filters = { ...filters, attributes };
    loadData(filters);
  };

  window.onscroll = async () => {
    if (
      hasMore &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
    ) {
      setLoading(true);
      filters.page++;
      const data = await fetch(
        `${process.env.REACT_APP_AMRKETPLACE_API_URL}/collection-nfts`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );
      let result = await data.json();
      if (result.data.length === 0) setHasMore(false);
      setNftData((prev) => [...prev, ...result.data]);
      setLoading(false);
    }
  };

  return (
    <section className="tf-explore tf-section collection">
      {contractCall ? <LoadingDots fullScreen={true} /> : <></>}
      <div className="container-fluid mt-5">
        {collectionDetails ? (
          <div className="row mb-5">
            <div className="col-md-12 col-lg-3 collection-image-holder">
              <img src={collectionDetails.image} alt="" />
            </div>
            <div className="col-md-12 col-lg-9">
              <h4>{collectionDetails.name}</h4>
              <div className="d-flex flex-wrap mt-4">
                <div className="collection-details letter-spacing-1 fs-16">
                  <div>
                    <span className="text-uppercase textMuted">floor</span>
                    <span>{floorPrice} ETH</span>
                  </div>
                  <div>
                    <span className="text-uppercase textMuted">listed</span>
                    <span>{collectionDetails.total_listed}</span>
                  </div>
                  <div>
                    <span className="text-uppercase textMuted">total vol</span>
                    <span>{collectionDetails.total_volume / 1e9} ETH</span>
                  </div>
                  {/* <div>
                  <span className="text-uppercase textMuted">
                    avg. sale(24)
                  </span>
                  <span>120.123</span>
                </div>
                <div>
                  <span className="text-uppercase textMuted">owners</span>
                  <span>1,123</span>
                </div> */}
                  <div>
                    <span className="text-uppercase textMuted">
                      total supply
                    </span>
                    <span>{totalSupply}</span>
                  </div>
                </div>
                <div className="fs-16 max-w-500 letter-spacing-1 line-h-1">
                  <div className="widget-social style-1">
                    <ul>
                      {collectionDetails.social_list.map((item, index) => (
                        <li key={index}>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className={item.icon}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span>
                    {collectionDetails.description} <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="collectio-nft-list">
          <div className="left">
            <button
              className="hide-button"
              onClick={(e) => handleHide(e, "left")}
            ></button>
            <div id="side-bar" className="side-bar">
              <div className="widget widget-category mgbt-24 boder-bt">
                <div className="buy-now-check content-wg-category">
                  <h2>Buy Now</h2>
                  <Toggle
                    toggled={buyNowState}
                    onClick={(state) => buy_now_nfts_api(state)}
                  />
                </div>
              </div>
              <Accordion title="Price">
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    min={0}
                    ref={minPriceRef}
                  />
                  <span className="mx-2 textMuted fs-16">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    name="maxPrice"
                    min={0}
                    ref={maxPriceRef}
                  />
                </div>
                <div className="col-md-12 text-center mt-5">
                  <button
                    className="sc-button fl-button style-1 loadMore"
                    onClick={() => {
                      priceRange();
                    }}
                  >
                    <span>Apply</span>
                  </button>
                </div>
              </Accordion>
              <div className="devider mb-24"></div>
              {collectionDetails && collectionDetails.attributes ? (
                Object.entries(collectionDetails.attributes).map(
                  ([key, value]) => (
                    <div
                      className="widget widget-category mgbt-24 boder-bt"
                      key={key}
                    >
                      <Accordion title={key}>
                        {value.map((nft) => (
                          <div
                            key={nft.name}
                            className="accordion-item-card fs-16 attr"
                            onClick={(e) => handleAttributFilter(e, key, nft)}
                          >
                            <span>{nft.name}</span>
                            <div className="justify-self-end">
                              {nft.count}/
                              <span className="text-muted">
                                {collectionDetails.total_listed}
                              </span>
                            </div>
                            <span className="text-muted">
                              {nft.floorPrice / 1e9} ETH
                            </span>
                            {/* <div className="justify-self-end">
                              <span>{"10"}</span>
                            </div> */}
                          </div>
                        ))}
                      </Accordion>
                    </div>
                  )
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="middle">
            <div className="flat-tabs themesflat-tabs">
              <Tabs>
                <TabList>
                  <Tab>Items</Tab>
                  <Tab>Activity</Tab>
                </TabList>
                <TabPanel>
                  <div className="filters">
                    <div className="dropdown">
                      <input readOnly type="text" value={selectedFilter} />
                      <div>
                        <ul>
                          <li onClick={(e) => handleFilter(e, "asc")}>
                            Price: Low to high
                          </li>
                          <li onClick={(e) => handleFilter(e, "desc")}>
                            Price: High to low
                          </li>
                          <li onClick={(e) => handleFilter(e, "recently")}>
                            Recently Listed
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="grid">
                      <div
                        name="grid3"
                        className="gridIcon"
                        onClick={(e) => handleGrid(e, "grid3")}
                      >
                        <BsFillGrid3X3GapFill size={25} />
                      </div>
                      <div
                        name="grid2"
                        className="gridIcon selected"
                        onClick={(e) => handleGrid(e, "grid2")}
                      >
                        <BsFillGridFill size={25} />
                      </div>
                    </div>
                  </div>
                  <div className="explore">
                    <div className="box-explore">
                      {nftData ? (
                        nftData.map((item) => (
                          <div
                            key={item.token_id}
                            id={`${item.nft_data.name}${item.token_id}`}
                            className="sc-card-product col-card-product explode style2 mg-bt nft-card"
                          >
                            {item.status ? (
                              <div
                                className="card-media"
                                onClick={(e) => handleClick(item, e)}
                              >
                                <img src={item.nft_data.image} alt="Fuelart" />
                              </div>
                            ) : (
                              <div className="card-media">
                                <img src={item.nft_data.image} alt="Fuelart" />
                              </div>
                            )}
                            <div className="card-title">
                              <h5>
                                <Link
                                  to={`/asset/${contract_id}/${item.token_id}`}
                                  relative="path"
                                >
                                  {item.nft_data.name}
                                </Link>
                              </h5>
                            </div>

                            <div className="card-bottom style-explode">
                              <div className="price">
                                <span>Price</span>
                                <div className="price-details">
                                  <h5>
                                    {item.status ? (
                                      (item.price / 1e9).toFixed(3)
                                    ) : (
                                      <>--</>
                                    )}
                                  </h5>
                                  {/* <span>= {item.priceChange}</span> */}
                                </div>
                              </div>
                              <div className="tags">FUEL</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                      {loading ? (
                        <div className="col-md-12 wrap-inner load-more text-center fs-16">
                          <LoadingDots />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="activities">
                    <table>
                      <thead>
                        <tr className="text-uppercase">
                          {activityTableHeader.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {nftHistory &&
                          nftHistory.map((nfth, index) => (
                            <tr key={index}>
                              <td>{nfth.name}</td>
                              <td>{nfth.transaction_type}</td>
                              <td>
                                <Link
                                  title={"0x" + nfth.seller}
                                  to={`/author/${"0x" + nfth.seller}`}
                                >
                                  {formatAddress(nfth.seller)}
                                </Link>
                              </td>
                              <td>
                                <Link to={`/author/${"0x" + nfth.buyer}`}>
                                  {formatAddress(nfth.buyer)}
                                </Link>
                              </td>
                              <td>{nfth.amount} ETH</td>
                              <td>{nfth.time}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="right">
            <button
              className="hide-button"
              onClick={(e) => handleHide(e, "right")}
            ></button>
            <div className="side-bar-right">
              <h4 className="mb-4">Cart</h4>
              <div className="create-item">
                <div className="themesflat-container">
                  <div className="flat-tabs tab-create-item">
                    <Tabs>
                      <TabList className="tabList">
                        <Tab>Buy</Tab>
                        <Tab
                          style={{
                            pointerEvents: `${buyNowState ? "auto" : "none"}`,
                          }}
                        >
                          Sweep
                        </Tab>
                      </TabList>
                      <TabPanel>
                        <div>
                          {selected.length > 0 ? (
                            selected.map((item) => (
                              <div
                                key={item.token_id}
                                className="d-flex align-items-center mb-3 fs-16"
                              >
                                <div className="nft-image-small">
                                  <img
                                    src={item.nft_data.image}
                                    alt={item.nft_data.name}
                                  />
                                  <span onClick={() => removeSelectedNft(item)}>
                                    x
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between w-100">
                                  <span>{item.nft_data.name}</span>
                                  <span>{(item.price / 1e9).toFixed(3)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="textMuted text-center">
                              (Cart is empty)
                            </p>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div className="slider">
                          <input
                            type="range"
                            name="sweep"
                            id="sweep"
                            step={1}
                            max={SLIDER_MAX_VALUE}
                            onChange={handleSliderChange}
                            value={sliderValue}
                          />
                        </div>
                        <div className="slider-values">
                          <span>0</span>
                          <span>{sliderValue}</span>
                          <span>{SLIDER_MAX_VALUE}</span>
                        </div>
                        <div>
                          {selected.length > 0 ? (
                            selected.map((item) => (
                              <div
                                key={item.token_id}
                                className="d-flex align-items-center mb-3 fs-16"
                              >
                                <div className="nft-image-small">
                                  <img
                                    src={item.nft_data.image}
                                    alt={item.nft_data.name}
                                  />
                                  <span onClick={() => removeSelectedNft(item)}>
                                    x
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between w-100">
                                  <span>{item.nft_data.name}</span>
                                  <span>{(item.price / 1e9).toFixed(3)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="textMuted text-center">
                              (Cart is empty)
                            </p>
                          )}
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </div>
              {/* <div className="devider"></div> */}
              {/* <div className="mt-3 fs-16">
              <ul>
                <li className="d-flex justify-content-between">
                  <span className="textMuted">
                    Items Price({selected.length})
                  </span>
                  <span>{totalPrice.toFixed(3)} ETH</span>
                </li>
                <li className="d-flex justify-content-between my-3">
                  <span className="textMuted">Protocol Fee</span>
                  <span>{protocolFee}% ETH</span>
                </li>
              </ul>
            </div> */}
              <div className="devider"></div>
              <div className="d-flex justify-content-between mt-3 align-items-center fs-16">
                <h5>Total Price</h5>
                <span>{(totalPrice / 1e9).toFixed(3)} ETH</span>
              </div>
              <div className="col-md-12 text-center mt-5">
                <button
                  className="sc-button fl-button style-1 loadMore"
                  onClick={buy_now}
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
