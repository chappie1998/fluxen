import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";

export const SuccessFullyMinted = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h3>Your NFTs</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row justify-content-center">
          {props.list.map((item) => (
            <div key={item.id} className="col-sm-4">
              <ProductCard imgUrl={item.imgUrl} title={item.name} />
            </div>
          ))}
        </div>
        <div className="row justify-content-center mb-3">
          <Link className="sc-button style-1" to={`/author/${props.publicKey}`}>
            <span>okay</span>
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
};
