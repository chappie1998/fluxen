import React, { useState, Fragment, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Countdown from "react-countdown";
import CardModal from "./CardModal";
import { Dropdown } from "react-bootstrap";

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
import { getPublicKey } from "../../utils/GetContract";
import { token } from "../../utils/auth";

const ItemContent = () => {
  const [visible, setVisible] = useState(15);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 5);
  };

  const listContent = useRef(null);

  const [modalShow, setModalShow] = useState(false);
  const [collections, setCollections] = useState([]);

  const loadData = async () => {
    const publicKey = await getPublicKey();
    const data = await fetch(
      `${process.env.REACT_APP_API_URL}/collection/owner/${publicKey}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let result = await data.json();
    console.log(result);
    setCollections(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Fragment>
      <div className="flat-tabs items">
        <Tabs>
          <TabList>
            <Tab>My Properties</Tab>
            {/* <Tab>Unlisted</Tab> */}
          </TabList>
          <TabPanel>
            <div className="content-item open" ref={listContent}>
              {collections ? (
                collections.map((item, key) => (
                  <div key={key} className="col-item">
                    <div className="sc-card-product menu_card style-h7">
                      <div className="meta-info style">
                        <div className="author"></div>
                      </div>
                      <div className="card-media">
                        <Link to={`/update-property/${item.contract_id}`}>
                          <img src={item.mainImage} alt="Fuelart" />
                        </Link>
                      </div>
                      <div className="card-title">
                        <h5>
                          <Link to={`/update-property/${item.contract_id}`}>
                            {item.title}
                          </Link>
                        </h5>
                      </div>
                      <div className="meta-info">
                        <div className="author">
                          <div className="info">
                            {/* <span>{item.name}</span> */}
                            <h3 className="pricing">{item.name}</h3>
                          </div>
                        </div>
                        <div className="tags">FUEL</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="col-item">
                <div className="sc-card-product menu_card style-h7">
                  <div className="meta-info style">
                    <div className="author"></div>
                  </div>
                  <div className="card-media">
                    <Link to="/create-property">
                      <img src={img1} alt="Fuelart" />
                    </Link>
                  </div>
                  <div className="card-title">
                    <h5>
                      <Link to="/create-property">Create New</Link>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      <CardModal show={modalShow} onHide={() => setModalShow(false)} />
    </Fragment>
  );
};

export default ItemContent;
