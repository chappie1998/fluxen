import React, { useState, Fragment, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Countdown from "react-countdown";
import { Dropdown, Modal } from "react-bootstrap";

import img1 from "../../assets/images/box-item/image-box-47.jpg";
import imga1 from "../../assets/images/avatar/author_rank.jpg";
import img2 from "../../assets/images/box-item/image-box-48.jpg";
import imga2 from "../../assets/images/avatar/avt-3.jpg";
import img3 from "../../assets/images/box-item/image-box-34.jpg";
import imga3 from "../../assets/images/avatar/avt-27.jpg";
import img4 from "../../assets/images/box-item/image-box-35.jpg";
import imga4 from "../../assets/images/avatar/avt-10.jpg";
import img5 from "../../assets/images/box-item/image-box-36.jpg";
import imga5 from "../../assets/images/avatar/avt-5.jpg";
import img6 from "../../assets/images/box-item/image-box-32.jpg";
import img7 from "../../assets/images/box-item/image-box-33.jpg";
import img8 from "../../assets/images/box-item/image-box-52.jpg";
import img9 from "../../assets/images/box-item/image-box-53.jpg";
import img10 from "../../assets/images/box-item/image-box-49.jpg";
import img11 from "../../assets/images/box-item/image-box-54.jpg";
import img12 from "../../assets/images/box-item/image-box-55.jpg";
import img13 from "../../assets/images/box-item/image-box-56.jpg";
import img14 from "../../assets/images/box-item/image-box-50.jpg";
import img15 from "../../assets/images/box-item/image-box-51.jpg";
import {
  getManagerContract,
  getWallet,
  getNftContract,
} from "../../utils/GetContract";
import { token } from "../../utils/auth";
import { NftAbi__factory } from "../../contracts/nft";
import { LoadingDots } from "../LoadingDots";

const ItemContent = () => {
  const [nfts, setNfts] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [changePricemodalShow, setChangePriceModalShow] = useState(false);
  const [contractCall, setContractCall] = useState(false);
  const [tokenId, setTokenId] = useState();
  const [price, setPrice] = useState();
  const [newPrice, setNewPrice] = useState();

  const { contract_id } = useParams();

  const loadData = async () => {
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/asset/${contract_id}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let result = await data.json();
    console.log(result);
    setNfts(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const list_nft = async () => {
    if (!price) {
      alert("Enter a price");
      return;
    }
    setContractCall(true);
    try {
      // await approveNFT(token);
      // await listNFT(token);
      const nft_contract = await getNftContract(contract_id);
      const approve_nft = await nft_contract.functions
        .approve({ ContractId: { value: contract_id } }, tokenId)
        .txParams({ gasPrice: 1 })
        .call();
      console.log("approve_nft", approve_nft);

      const contract = await getManagerContract();
      const list_nft = await contract.functions
        .list_nft({ value: contract_id }, tokenId, price * 1e9)
        .txParams({ gasPrice: 1 })
        .addContracts([nft_contract])
        .call();
      console.log("list_nft", list_nft);

      // const wallet = await getWallet();
      // const contractInstance = await getManagerContract();
      // const nftcontractInstance = NftAbi__factory.connect(contract_id, wallet, {
      //   cache: false,
      // });
      // const amount = price * 1e9;
      // const calls = [
      //   nftcontractInstance.functions.approve(
      //     { ContractId: { value: contractInstance.id.toB256() } },
      //     tokenId
      //   ),
      //   contractInstance.functions.list_nft(
      //     { value: contract_id },
      //     tokenId,
      //     amount
      //   ),
      // ];
      // const scope = contractInstance
      //   .multiCall(calls)
      //   .addContracts([nftcontractInstance]);
      // const results = await scope.txParams({ gasPrice: 10 }).call();
      // console.log("calls: ", results);

      let body = {
        contract_id: contract_id,
        token_id: tokenId,
        status: true,
        price: price * 1e9,
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/asset`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        window.location.reload();
      } else if (!response.ok) {
        console.log("Unauthorized or token expired");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setContractCall(false);
    }
  };

  const delist = async () => {
    const contractInstance = await getManagerContract();
    const wallet = await getWallet();
    const nftcontractInstance = NftAbi__factory.connect(contract_id, wallet);
    const delist = await contractInstance.functions
      .delist_nft({ value: contract_id }, tokenId)
      .txParams({ gasPrice: 1 })
      .addContracts([nftcontractInstance])
      .call();
    console.log("delist", delist);
  };

  const change_price = async () => {
    if (!newPrice) {
      alert("Enter a price");
      return;
    }
    const contractInstance = await getManagerContract();
    const change_nft_price = await contractInstance.functions
      .change_nft_price({ value: contract_id }, tokenId, newPrice * 1e9)
      .txParams({ gasPrice: 1 })
      .call();
    console.log("change_nft_price", change_nft_price);
    let body = {
      contract_id: contract_id,
      token_id: tokenId,
      status: true,
      price: newPrice * 1e9,
    };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/asset`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      window.location.reload();
    } else if (!response.ok) {
      console.log("Unauthorized or token expired");
    }
  };

  const listModal = (
    <Modal show={modalShow} onHide={() => setModalShow(false)}>
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Enter a Price</h3>

        <p>Enter room price.</p>
        <input
          type="number"
          className="form-control"
          placeholder="1"
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="hr"></div>

        <button
          onClick={list_nft}
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#popup_bid_success"
          data-dismiss="modal"
          aria-label="Close"
        >
          {" "}
          Continue
        </button>
      </div>
    </Modal>
  );

  const changePriceModal = (
    <Modal
      show={changePricemodalShow}
      onHide={() => setChangePriceModalShow(false)}
    >
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body space-y-20 pd-40">
        <h3>Enter a Price</h3>

        <p>Enter new room price.</p>
        <input
          type="number"
          className="form-control"
          placeholder="1"
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <div className="hr"></div>

        <button
          onClick={change_price}
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#popup_bid_success"
          data-dismiss="modal"
          aria-label="Close"
        >
          {" "}
          Continue
        </button>
      </div>
    </Modal>
  );

  return (
    <Fragment>
      <div className="flat-tabs items">
        {contractCall ? <LoadingDots fullScreen={true} /> : <></>}
        <Tabs>
          <TabList>
            {/* {dataTab.map((data) => (
              <Tab key={data.id}>{data.title}</Tab>
            ))} */}
            <Tab>Property Rooms</Tab>
          </TabList>
          <TabPanel>
            {/* <div className="option">
                <h2 className="title">1,000 Items</h2>
                <div className="view">
                  <ul>
                    <li
                      onClick={listToggle}
                      ref={listBtn}
                      className="style1 grid active"
                    >
                      <Link to="#">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
                            fill="white"
                          />
                          <path
                            d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
                            fill="white"
                          />
                          <path
                            d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
                            fill="white"
                          />
                          <path
                            d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
                            fill="white"
                          />
                        </svg>
                        <span>Grid</span>
                      </Link>
                    </li>
                    <li
                      onClick={gridToggle}
                      ref={gridBtn}
                      className="style2 list"
                    >
                      <Link to="#">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 8H3C2.59 8 2.25 7.09333 2.25 6C2.25 4.90667 2.59 4 3 4H21C21.41 4 21.75 4.90667 21.75 6C21.75 7.09333 21.41 8 21 8Z"
                            fill="#EBEBEB"
                          />
                          <path
                            d="M21 14H3C2.59 14 2.25 13.0933 2.25 12C2.25 10.9067 2.59 10 3 10H21C21.41 10 21.75 10.9067 21.75 12C21.75 13.0933 21.41 14 21 14Z"
                            fill="#EBEBEB"
                          />
                          <path
                            d="M21 20H3C2.59 20 2.25 19.0933 2.25 18C2.25 16.9067 2.59 16 3 16H21C21.41 16 21.75 16.9067 21.75 18C21.75 19.0933 21.41 20 21 20Z"
                            fill="#EBEBEB"
                          />
                        </svg>
                        <span>List</span>
                      </Link>
                    </li>
                  </ul>

                  <Dropdown>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="btn-sort-by dropdown"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 7H21"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M6 12H18"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M10 17H14"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      <span>Low To High</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ margin: 0 }}>
                      <Dropdown.Item href="#">Top rate</Dropdown.Item>
                      <Dropdown.Item href="#">Mid rate</Dropdown.Item>
                      <Dropdown.Item href="#">Low rate</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div> */}
            <div className="content-item2 open">
              {nfts ? (
                nfts.map((item, index) => (
                  <div key={index} className="col-item">
                    <div className="sc-card-product menu_card style-h7">
                      <div className="wrap-media">
                        <div className="card-media">
                          <Link to="/item-details-01">
                            <img src={item.image} alt="Fuelart" />
                          </Link>
                        </div>
                      </div>
                      <div className="card-title">
                        <p>Item Name</p>
                        <h4>
                          <Link to="/item-details-01">{item.name}</Link>
                        </h4>
                      </div>
                      {/* <div className="meta-info style">
                        <p>Creator</p>
                        <div className="author">
                          <div className="avatar">
                            <img src={item.imgAuthor} alt="Fuelart" />
                          </div>
                          <div className="info">
                            <h4>
                              {" "}
                              <Link to="author02.html">
                                {item.nameAuthor}
                              </Link>{" "}
                            </h4>
                          </div>
                        </div>
                      </div> */}

                      {/* <div className="wrap-hear">
                          <button className="wishlist-button heart">
                            <span className="number-like"> {item.wishlist}</span>
                          </button>
                        </div> */}
                      <div className="wrap-tag">
                        <div className="tags">FUEL</div>
                      </div>
                      <div className="meta-info">
                        <div className="author">
                          <div className="info">
                            <p>Status</p>
                            {item.status ? (
                              <p className="pricing">listed</p>
                            ) : (
                              <p className="pricing">unlisted</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="meta-info">
                        <div className="author">
                          <div className="info">
                            <p>Current Price</p>
                            {item.status ? (
                              <p className="pricing">{item.price / 1e9} ETH</p>
                            ) : (
                              <p className="pricing">--</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {item.status ? (
                        <>
                          <div className="button-place-bid mr-5">
                            <button
                              onClick={() => {
                                delist();
                                setTokenId(item.token_id);
                              }}
                              data-toggle="modal"
                              data-target="#popup_bid"
                              className="sc-button style-place-bid style bag fl-button pri-3"
                            >
                              <span>delist</span>
                            </button>
                          </div>
                          <div className="button-place-bid ml-5">
                            <button
                              onClick={() => setChangePriceModalShow(true)}
                              data-toggle="modal"
                              data-target="#popup_bid"
                              className="sc-button style-place-bid style bag fl-button pri-3"
                            >
                              <span>Change price</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="button-place-bid">
                          <button
                            onClick={() => {
                              setModalShow(true);
                              setTokenId(item.token_id);
                            }}
                            data-toggle="modal"
                            data-target="#popup_bid"
                            className="sc-button style-place-bid style bag fl-button pri-3"
                          >
                            <span>List</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="col-item">
                <div className="sc-card-product menu_card style-h7">
                  <div className="wrap-media">
                    <div className="card-media">
                      <Link to={`/add-room/${contract_id}`}>
                        <img src={img1} alt="Fuelart" />
                      </Link>
                    </div>
                  </div>
                  <div className="card-title">
                    <p>Add new room</p>
                    <h4>
                      <Link to={`/add-room/${contract_id}`}>Add new room</Link>
                    </h4>
                  </div>

                  {/* <div className="wrap-hear">
                    <button className="wishlist-button heart">
                      <span className="number-like"> {item.wishlist}</span>
                    </button>
                  </div> */}
                  <div className="wrap-tag">
                    <div className="tags">FUEL</div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      {listModal}
      {changePriceModal}
    </Fragment>
  );
};

export default ItemContent;
