import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import img1 from "../assets/images/box-item/image-box-6.jpg";
import avt from "../assets/images/avatar/avt-9.jpg";

import { Fragment, useState } from "react";
import { Web3Storage } from "web3.storage";

import { getPublicKey, getWallet } from "./../utils/GetContract";
import { token } from "../utils/auth";
import { ContractFactory } from "fuels";

const buffer = require("buffer");

const CreateItem = () => {
  const [spinner, setSpinner] = useState(false);
  const [imageURL, setImageURL] = useState(img1);
  const [image, setImage] = useState();
  const [name, setName] = useState("Name");
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

  const upload = async () => {
    // console.log(image);
    const cid = await storeFiles(image);
    const img = "https://" + cid + ".ipfs.w3s.link";
    // const nftMetaData = {
    //   name: name,
    //   image: "https://" + cid + ".ipfs.w3s.link",
    //   description: description,
    //   attributes: [],
    // };
    // const cid2 = await storeFiles(makeFileObjects(nftMetaData));
    // const md1 = {
    //   name: name,
    //   token_uri: "https://" + cid2 + ".ipfs.w3s.link",
    // };
    return img;
  };

  const deployContract = async () => {
    // load the byteCode of the contract, generated from Sway source
    const data = await fetch("../deploy_contract/nft.bin");

    var byteCode = new Uint8Array(await data.arrayBuffer());
    const buff = buffer.Buffer.from(byteCode);

    // load the JSON abi of the contract, generated from Sway source
    const abi = require("../deploy_contract/nft-abi.json");
    // console.log(abi.toString());

    const wallet = await getWallet();

    // send byteCode and ABI to ContractFactory to load
    const factory = new ContractFactory(buff, abi, wallet);
    const contract = await factory.deployContract({
      gasPrice: 100,
      gasLimit: 1_000_000,
      storageSlots: [],
    });
    console.log("contract successful deployed", contract.id.toB256());
    // navigate("/update-property/" + contract.id.toB256());
    return contract.id.toB256();
  };

  // const wallet = getWallet();
  // console.log(getWallet());

  const mint = async () => {
    if (!image || name == "Name" || description == "Description") {
      alert("please provide data!");
      return;
    }

    setSpinner(true);
    const img = await upload();
    const contract_id = await deployContract();
    const publicKey = await getPublicKey();
    let body = {
      name: name,
      description: description,
      contract_id: contract_id,
      owner: publicKey,
      mainImage: img,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/collection`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        navigate("/update-property/" + contract_id);
      } else if (!response.ok) {
        console.log("Unauthorized or token expired");
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
                    <h5>"{name}”</h5>
                    <div className="tags">FUEL</div>
                  </div>

                  <div className="mt-4">
                    <h5>"{description}”</h5>
                  </div>
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
                    <Tabs>
                      <div>
                        <h4 className="title-create-item">Title</h4>
                        <input
                          type="text"
                          required
                          placeholder="Item Name"
                          onChange={(e) => setName(e.target.value)}
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
                      </div>
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
