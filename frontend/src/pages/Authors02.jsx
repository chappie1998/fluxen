import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Footer from "../components/footer/Footer";
import CardModal from "../components/layouts/CardModal";

import avt from "../assets/images/avatar/avt-author-tab.jpg";
import img1 from "../assets/images/box-item/card-item-3.jpg";
import imga1 from "../assets/images/avatar/avt-1.jpg";
import imgCollection1 from "../assets/images/avatar/avt-18.jpg";
import img2 from "../assets/images/box-item/card-item-4.jpg";
import imga2 from "../assets/images/avatar/avt-2.jpg";
import imgCollection2 from "../assets/images/avatar/avt-18.jpg";
import img3 from "../assets/images/box-item/card-item-2.jpg";
import imga3 from "../assets/images/avatar/avt-4.jpg";
import imgCollection3 from "../assets/images/avatar/avt-18.jpg";
import img4 from "../assets/images/box-item/card-item-7.jpg";
import imga4 from "../assets/images/avatar/avt-3.jpg";
import imgCollection4 from "../assets/images/avatar/avt-18.jpg";
import img5 from "../assets/images/box-item/card-item8.jpg";
import imga5 from "../assets/images/avatar/avt-12.jpg";
import imgCollection5 from "../assets/images/avatar/avt-18.jpg";
import img6 from "../assets/images/box-item/card-item-9.jpg";
import imga6 from "../assets/images/avatar/avt-1.jpg";
import imgCollection6 from "../assets/images/avatar/avt-18.jpg";
import img7 from "../assets/images/box-item/image-box-6.jpg";
import imga7 from "../assets/images/avatar/avt-4.jpg";
import imgCollection7 from "../assets/images/avatar/avt-18.jpg";
import img8 from "../assets/images/box-item/image-box-11.jpg";
import imga8 from "../assets/images/avatar/avt-3.jpg";
import imgCollection8 from "../assets/images/avatar/avt-18.jpg";

import { getPublicKey } from "./../utils/GetContract";
import { LoadingDots } from "../components/LoadingDots";

const Authors02 = () => {
  // const [wallet, setWallet] = useState();
  const [nfts, setNfts] = useState();
  // const [userData, setUserData] = useState();
  const [userName, setUserName] = useState();
  const [userBio, setUserBio] = useState();
  const [userProfileImage, setProfileImage] = useState();
  const [menuTab] = useState([
    {
      class: "active",
      name: "ALL",
    },
    // {
    //   class: "",
    //   name: "CREATED",
    // },
    // {
    //   class: "",
    //   name: "LISTED",
    // },
    // {
    //   class: "",
    //   name: "OFFERS",
    // },
    // {
    //   class: "",
    //   name: "ACTIVITY",
    // },
  ]);

  const { publicKey } = useParams();

  const ud = localStorage.getItem("fuelart-ud");

  const loadUserData = async () => {
    const data = await fetch(
      `${process.env.REACT_APP_AMRKETPLACE_API_URL}/user/${publicKey}`
    );
    let result = await data.json();
    setUserName(result.name);
    setUserBio(result.bio);
    setProfileImage(result.profile_image);
    // setUserData({
    //   name: result.name,
    //   bio: result.bio,
    //   profile_image: result.profile_image,
    //   twitter: result.twitter,
    // });
  };
  const loadData = async () => {
    const data = await fetch(
      `${process.env.REACT_APP_WALLET_NFTS_URL}/owner-nfts/${publicKey.replace(
        "0x",
        ""
      )}`
    );
    let result = await data.json();
    const panelTab = [
      {
        id: 1,
        dataContent: result,
      },
    ];
    setNfts(panelTab);
    // } else {
    //   alert("Connect Fuel's Wallet!");
    // }
  };

  useEffect(() => {
    loadData();
    loadUserData();
  }, [publicKey]);

  const [visible, setVisible] = useState(8);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 4);
  };

  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="authors-2">
      <section className="tf-section authors">
        <div className="themesflat-container mt-5">
          <div className="flat-tabs tab-authors">
            <div className="author-profile flex">
              <div className="feature-profile">
                {userProfileImage ? (
                  <img src={userProfileImage} alt="Axies" className="avatar" />
                ) : (
                  <img src={avt} alt="Axies" className="avatar" />
                )}
              </div>
              <div className="infor-profile">
                <span>Author Profile</span>
                <h2 className="title">
                  {ud ? ud : <>{userName ? userName : <>Unnamed</>}</>}
                </h2>
                <p className="content">
                  {userBio ? userBio : <>I am ghost...</>}
                </p>
                <form>
                  <input
                    type="text"
                    className="inputcopy"
                    defaultValue={publicKey}
                    readOnly
                  />
                  <button type="button" className="btn-copycode">
                    <i className="icon-fl-file-1"></i>
                  </button>
                </form>
              </div>
              {/* <div className="widget-social style-3">
                <ul>
                  <li>
                    <Link to="#">
                      <i className="fab fa-twitter"></i>
                    </Link>
                  </li>
                  <li className="style-2">
                    <Link to="#">
                      <i className="fab fa-telegram-plane"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="fab fa-youtube"></i>
                    </Link>
                  </li>
                  <li className="mgr-none">
                    <Link to="#">
                      <i className="icon-fl-tik-tok-2"></i>
                    </Link>
                  </li>
                </ul>
                 <div className="btn-profile">
                  <Link to="/login" className="sc-button style-1 follow">
                    Follow
                  </Link>
                </div> 
              </div> */}
            </div>
            <Tabs>
              <TabList>
                {menuTab.map((item, index) => (
                  <Tab key={index}>{item.name}</Tab>
                ))}
              </TabList>

              <div className="content-tab">
                <div className="content-inner">
                  <div className="row">
                    {nfts ? (
                      nfts.length ? (
                        nfts.map((item, index) => (
                          <TabPanel key={index}>
                            {item.dataContent
                              .slice(0, visible)
                              .map((data, index) => (
                                <div
                                  key={index}
                                  className="col-xl-3 col-lg-4 col-md-6 col-12"
                                >
                                  <div className="sc-card-product explode style2 mg-bt nft-card">
                                    <div className="card-media">
                                      <Link
                                        to={`/sell/${
                                          "0x" + data.nft_contract
                                        }/${data.token_id}`}
                                      >
                                        <img
                                          src={data.nft_data.image}
                                          alt="Fuelart"
                                        />
                                      </Link>
                                      {/* <Link
                                    to="/login"
                                    className="wishlist-button heart"
                                  >
                                    <span className="number-like">
                                      {" "}
                                      {data.wishlist}
                                    </span>
                                  </Link> */}
                                    </div>
                                    <div className="card-title mg-bt-16">
                                      <h5>
                                        <Link
                                          to={`/sell/${
                                            "0x" + data.nft_contract
                                          }/${data.token_id}`}
                                        >
                                          "{data.nft_data.name}"
                                        </Link>
                                      </h5>
                                    </div>
                                    <div className="meta-info style-explode card-bottom">
                                      {/* <div className="author">
                                    <div className="avatar">
                                      <img src={data.imgAuthor} alt="Axies" />
                                    </div>
                                    <div className="info">
                                      <span>Creator</span>
                                      <h6>
                                        {" "}
                                        <Link to="/author-02">
                                          {data.nameAuthor}
                                        </Link>{" "}
                                      </h6>
                                    </div>
                                  </div> */}

                                      <Link
                                        className="sc-button bag fl-button pri-3"
                                        to={`/sell/${
                                          "0x" + data.nft_contract
                                        }/${data.token_id}`}
                                      >
                                        <span>List </span>
                                      </Link>
                                      <div className="tags">FUEL</div>
                                    </div>
                                    {/* <div className="card-bottom style-explode">
                                  <div className="price">
                                    <span>Current Bid</span>
                                    <div className="price-details">
                                      <h5>{data.price}</h5>
                                      <span>= {data.priceChange}</span>
                                    </div>
                                  </div>
                                  <Link
                                    to="/activity-01"
                                    className="view-history reload"
                                  >
                                    View History
                                  </Link>
                                </div> */}
                                  </div>
                                </div>
                              ))}
                            {visible < item.dataContent.length && (
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
                          </TabPanel>
                        ))
                      ) : (
                        <div className="col-md-12 wrap-inner load-more text-center fs-16">
                          <h5>No NFTs found / Wallet is not connected</h5>
                        </div>
                      )
                    ) : (
                      <div className="col-md-12 wrap-inner load-more text-center fs-16">
                        <LoadingDots />
                      </div>
                      // <>
                      //   {wallet ? (
                      //     <></>
                      //   ) : (
                      //     <div className="col-md-12 wrap-inner load-more text-center">
                      //       <h5>Wallet is not connected!</h5>
                      //     </div>
                      //   )}
                      // </>
                    )}
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default Authors02;
