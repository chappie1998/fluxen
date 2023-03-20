import { useState } from "react";
import Modal from "react-bootstrap/Modal";

export const ChangeListing = (props) => {
  const [price, setPrice] = useState();
  const handleContinue = () => {
    console.log("Continue", price);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3 className="text-center">Edit listing</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="changeListing">
          <div className="details row mb-5">
            <div className="nftImage col-3">
              <img src={props.imgUrl} alt={props.alt} />
            </div>
            <div className="col-6">
              <h4>750</h4>
              <p className="textMuted">Expire in 27 days</p>
            </div>
            <div className="col-3">
              <h5>1.5 ETH</h5>
              <p className="textMuted">$2,464.98</p>
            </div>
          </div>
          <div>
            <h4>Set new price</h4>
            <p className="textMuted">
              If you want to increase the price, you will be prompted to cancel
              all of your existing first. This will cost gas.&nbsp;
              <a href="#">Learn more</a>.
            </p>
            <div className="input">
              <input
                type="number"
                onChange={handlePrice}
                name="price"
                className="style-2"
              />
              <span>ETH</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4 actions">
            <button
              onClick={props.onHide}
              className="sc-button loadmore fl-button pri-3 mb-0"
            >
              <span>Change listing</span>
            </button>
            <button
              disabled={!price}
              className="sc-button fl-button style-1"
              onClick={handleContinue}
            >
              <span>Complete Listing</span>
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
