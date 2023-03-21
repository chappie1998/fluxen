import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import img1 from "../assets/images/box-item/image-box-6.jpg";
import avt from "../assets/images/avatar/avt-9.jpg";

import { Fragment, useState } from "react";
import { Web3Storage } from "web3.storage";

import { getNftContract, getPublicKey } from "./../utils/GetContract";

const CreateItem = () => {
  const [spinner, setSpinner] = useState(false);
  const [imageURL, setImageURL] = useState(img1);
  const [image, setImage] = useState();
  const [nftName, setNftName] = useState("Nft Name");
  const [description, setDescription] = useState("Description");

  const navigate = useNavigate();

  function getFiles(e) {
    if (e.target.files) {
      setImageURL(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files);
    }
  }

  const client = new Web3Storage({
    token: process.env.REACT_APP_WEB_STORAGE_TOKEN,
  });

  const storeFiles = async (files) => {
    const cid = await client.put(files, {
      wrapWithDirectory: false,
    });
    return cid;
  };

  function makeFileObjects(meta_data) {
    const blob = new Blob([JSON.stringify(meta_data)], {
      type: "application/json",
    });

    if (image) {
      const files = [new File([blob], image[0].name.split(".")[0] + ".json")];
      return files;
    }
  }

  const upload = async () => {
    // console.log(image);
    const cid = await storeFiles(image);
    const nftMetaData = {
      name: nftName,
      image: "https://" + cid + ".ipfs.w3s.link",
      description: description,
      attributes: [],
    };
    const cid2 = await storeFiles(makeFileObjects(nftMetaData));
    const md1 = {
      name: nftName,
      token_uri: "https://" + cid2 + ".ipfs.w3s.link",
    };
    return md1;
  };

  const mint = async () => {
    if (!image || nftName == "Nft Name" || description == "Description") {
      alert("please provide data!");
      return;
    }

    setSpinner(true);
    try {
      const mintData = await upload();
      // const mintData = {
      //   token_uri:
      //     "bafkreie57f7sxx566cfjsjvuke7a5tqd3xcx6s6s2ikjd2zf63xy4z3onq",
      //   name: "lolName 5",
      // };
      if (process.env.REACT_APP_NFT_CONTRACT_ID) {
        const NFTContractId = process.env.REACT_APP_NFT_CONTRACT_ID;
        const publicKey = await getPublicKey();
        const contract = await getNftContract(NFTContractId);
        const mintedNFT = await contract.functions
          .mint({ Address: { value: publicKey } }, mintData)
          .txParams({ gasPrice: 1 })
          // .simulate();
          .call();
        console.log("mint", mintedNFT);
        alert("congratulations for minting NFT on fuel!");
        navigate("/author/" + publicKey);
        // navigate(
        //   "/asset/" +
        //     NFTContractId +
        //     "/" +
        //     mintedNFT.logs[0].token_id.toNumber()
        // );
        // setTimeout(() => {
        //   navigate(
        //     "/asset/" +
        //       NFTContractId +
        //       "/" +
        //       mintedNFT.logs[0].token_id.toNumber()
        //   );
        // }, "3000");
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <Fragment>
      {spinner ? (
        <div
          style={{
            inset: "0",
            position: "fixed",
            zIndex: "999999",
            background: "rgba(200, 200, 200,.2)",
            fontSize: "30px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            Loading...
          </div>
        </div>
      ) : null}
      <div className="create-item">
        <div className="tf-create-item tf-section">
          <div className="themesflat-container mt-5">
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                <h4 className="title-create-item">Preview item</h4>
                <div className="sc-card-product">
                  <div className="card-media">
                    <img src={imageURL} alt="Fluxen" />
                  </div>
                  <div className="card-title">
                    <h5>"{nftName}”</h5>
                    <div className="tags">FUEL</div>
                  </div>

                  <div className="mt-4">
                    <h5>"{description}”</h5>
                  </div>
                  {/* <div className="meta-info">
                  <div className="author">
                    <div className="avatar">
                      <img src={avt} alt="Fluxen" />
                    </div>
                    <div className="info">
                      <span>Owned By</span>
                      <h6>
                        {" "}
                        <Link to="/author-02">Freddie Carpenter</Link>
                      </h6>
                    </div>
                  </div>
                  <div className="price">
                    <span>Price</span>
                    <h5> {price} ETH</h5>
                  </div>
                </div> */}
                  {/* <div className="card-bottom">
                  <Link
                    to="/wallet-connect"
                    className="sc-button style bag fl-button pri-3"
                  >
                    <span>Place Bid</span>
                  </Link>
                  <Link to="/activity-01" className="view-history reload">
                    View History
                  </Link>
                </div> */}
                </div>
              </div>
              <div className="col-xl-9 col-lg-6 col-md-12 col-12">
                <div className="form-create-item">
                  <form action="#">
                    <h4 className="title-create-item">Upload file</h4>
                    <label className="uploadFile">
                      <span className="filename">
                        PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                      </span>
                      <input
                        type="file"
                        required
                        className="inputfile form-control"
                        name="file"
                        onChange={getFiles}
                      />
                    </label>
                  </form>
                  <div className="flat-tabs tab-create-item">
                    {/* <h4 className="title-create-item">Select method</h4> */}
                    <Tabs>
                      {/* <TabList>
                      <Tab>
                        <span className="icon-fl-tag"></span>Fixed Price
                      </Tab>
                      <Tab>
                        <span className="icon-fl-clock"></span>Time Auctions
                      </Tab>
                      <Tab>
                        <span className="icon-fl-icon-22"></span>Open For Bids
                      </Tab>
                    </TabList> */}

                      {/* <TabPanel> */}
                      <div>
                        {/* <h4 className="title-create-item">Price</h4>
                        <input
                          type="text"
                          required
                          placeholder="Enter price for one item (ETH)"
                          onChange={(e) => setPrice(e.target.value)}
                        /> */}

                        <h4 className="title-create-item">Title</h4>
                        <input
                          type="text"
                          required
                          placeholder="Item Name"
                          onChange={(e) => setNftName(e.target.value)}
                        />

                        <h4 className="title-create-item">Description</h4>
                        <textarea
                          required
                          placeholder="e.g. “This is very limited item”"
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>

                        <div className="col-md-12 text-center mt-5">
                          <button
                            className="sc-button fl-button style-1"
                            onClick={mint}
                          >
                            <span>Create</span>
                          </button>
                        </div>

                        {/* <div className="row-form style-3">
                          <div className="inner-row-form">
                            <h4 className="title-create-item">Royalties</h4>
                            <input type="text" placeholder="5%" />
                          </div>
                          <div className="inner-row-form">
                            <h4 className="title-create-item">Size</h4>
                            <input type="text" placeholder="e.g. “size”" />
                          </div>
                          <div className="inner-row-form style-2">
                            <div className="seclect-box">
                              <div id="item-create" className="dropdown">
                                <Link to="#" className="btn-selector nolink">
                                  Abstraction
                                </Link>
                                <ul>
                                  <li>
                                    <span>Art</span>
                                  </li>
                                  <li>
                                    <span>Music</span>
                                  </li>
                                  <li>
                                    <span>Domain Names</span>
                                  </li>
                                  <li>
                                    <span>Virtual World</span>
                                  </li>
                                  <li>
                                    <span>Trading Cards</span>
                                  </li>
                                  <li>
                                    <span>Sports</span>
                                  </li>
                                  <li>
                                    <span>Utility</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      {/* </TabPanel> */}
                      {/* <TabPanel>
                      <form action="#">
                        <h4 className="title-create-item">Minimum bid</h4>
                        <input type="text" placeholder="enter minimum bid" />
                        <div className="row">
                          <div className="col-md-6">
                            <h5 className="title-create-item">Starting date</h5>
                            <input
                              type="date"
                              name="bid_starting_date"
                              id="bid_starting_date"
                              className="form-control"
                              min="1997-01-01"
                            />
                          </div>
                          <div className="col-md-6">
                            <h4 className="title-create-item">
                              Expiration date
                            </h4>
                            <input
                              type="date"
                              name="bid_expiration_date"
                              id="bid_expiration_date"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <h4 className="title-create-item">Title</h4>
                        <input type="text" placeholder="Item Name" />

                        <h4 className="title-create-item">Description</h4>
                        <textarea placeholder="e.g. “This is very limited item”"></textarea>
                      </form>
                    </TabPanel>
                    <TabPanel>
                      <form action="#">
                        <h4 className="title-create-item">Price</h4>
                        <input
                          type="text"
                          placeholder="Enter price for one item (ETH)"
                        />

                        <h4 className="title-create-item">Minimum bid</h4>
                        <input type="text" placeholder="enter minimum bid" />

                        <div className="row">
                          <div className="col-md-6">
                            <h5 className="title-create-item">Starting date</h5>
                            <input
                              type="date"
                              name="bid_starting_date"
                              id="bid_starting_date2"
                              className="form-control"
                              min="1997-01-01"
                            />
                          </div>
                          <div className="col-md-6">
                            <h4 className="title-create-item">
                              Expiration date
                            </h4>
                            <input
                              type="date"
                              name="bid_expiration_date"
                              id="bid_expiration_date2"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <h4 className="title-create-item">Title</h4>
                        <input type="text" placeholder="Item Name" />

                        <h4 className="title-create-item">Description</h4>
                        <textarea placeholder="e.g. “This is very limited item”"></textarea>
                      </form>
                    </TabPanel> */}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </Fragment>
  );
};

export default CreateItem;
