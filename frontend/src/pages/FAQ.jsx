import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { Accordion } from "react-bootstrap-accordion";

const FAQ = () => {
  const [data] = useState([
    {
      key: "0",
      show: "show",
      title: "What is FuelArt?",
      text: "FuelArt is a cutting-edge, next-generation NFT marketplace on FuelVM, which is changing the game in the world of digital art and collectibles",
    },
    {
      key: "1",
      title: "What is FuelVM ?",
      text: "Fuel Virtual Machine (FuelVM):- Designed to reduce wasteful processing of traditional blockchain virtual machine architectures, while vastly increasing the potential design space for developers. The design learns from the mistakes of the past and insights from years of production blockchains.",
    },
    {
      key: "2",
      title: " Why on Fuel?",
      text: "Blockchains are moving away from a monolithic design, where consensus, data availability, and execution are tightly coupled. This separation allows for specialization at the base layer, delivering a significant increase in bandwidth capacity. At Fuel the fuel team is building the fastest execution layer for the modular blockchain stack.",
    },
    {
      key: "3",
      title: " When will FuelArt main net coming up?",
      text: "Currently all our development process is completed we are testing some things so our main net will be live in a week or two.",
    },
    {
      key: "4",
      title: "What all will be the features of FuelArt?",
      text: "Our MVP will contain features such as ,Instant NFT buy/ sell, NFT Minting for the Artists, NFT launchpad for the NFT collections.",
    },
    {
      key: "5",
      title: "What all are the features in FuelArt Roadmap?",
      text: "Our development team is working on features such as NFT Auction, P2P Marketplace, NFT Lending and NFT Fractionalization for future roadmap.",
    },
    // {
    //   key: "6",
    //   title: "How can a members of community connect with FuelArt team?",
    //   text: "",
    // },
  ]);
  return (
    <div>
      {/* <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">FAQ</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="#">Pages</Link>
                  </li>
                  <li>FAQ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="tf-section wrap-accordion">
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title-heading ct style-2 fs-30 mg-bt-10">
                Frequently Asked Questions
              </h2>
              <h5 className="sub-title help-center mg-bt-32 ">
                "Swap, trade, and collect multiple NFTs in one place with ease!
                Get ready to upgrade your crypto game"
              </h5>
            </div>
            <div className="col-md-12">
              <div className="flat-accordion2">
                {data.map((item, index) => (
                  <Accordion key={index} title={item.title}>
                    <p>{item.text}</p>
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
