import React from "react";
import { Link } from "react-router-dom";
import icon1 from "../../assets/images/icon/Wallet.png";
import icon2 from "../../assets/images/icon/Category.png";
import icon3 from "../../assets/images/icon/Image2.png";
import icon4 from "../../assets/images/icon/Bookmark.png";

const Create = () => {
  const data = [
    {
      title: "Set Up Your Wallet",
      description:
        "Wallet that is functional for NFT purchasing. you will need Fuels wallet for the website.",
      icon: icon1,
      colorbg: "icon-color1",
    },
    {
      title: "Create Your Collection",
      description:
        "Setting up your NFT collection and creating NFTs on NFTs is easy! This guide explains how to set up your first collection",
      icon: icon2,
      colorbg: "icon-color2",
    },
    {
      title: "Add Your NFTs",
      description:
        "Sed ut perspiciatis un de omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.",
      icon: icon3,
      colorbg: "icon-color3",
    },
    {
      title: "List Them For Sale",
      description:
        "Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs!",
      icon: icon4,
      colorbg: "icon-color4",
    },
  ];
  return (
    <section className="tf-box-icon create style1 tf-section">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions mg-bt-22">
              <h2 className="tf-title pb-17">Create And Sell Your NFTs</h2>
            </div>
          </div>
          {data.map((item, index) => (
            <CreateItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CreateItem = (props) => (
  <div className="col-lg-3 col-md-6 col-12">
    <div className="sc-box-icon">
      <div className="image">
        <div className={`icon-create ${props.item.colorbg}`}>
          <img src={props.item.icon} alt="" />
        </div>
      </div>
      <h3 className="heading">
        {/* <Link to="/wallet-connect">{props.item.title}</Link> */}
        <a
          href="https://wallet.fuel.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.item.title}
        </a>
      </h3>
      <p className="content">{props.item.description}</p>
    </div>
  </div>
);

export default Create;
