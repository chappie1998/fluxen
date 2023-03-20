import { Link } from "react-router-dom";

export const ProductCard = (props) => {
  return (
    <div className="sc-card-product">
      <div className="card-media">
        {/* {props.link ? <Link to="/item-details-01" /> : <></>} */}
        <img src={props.imgUrl} alt={props.alt ? props.alt : "Image"} />
      </div>
      <div className="card-title">
        <h5>{props.title}</h5>
        {props.tag ? <div className="tags">{props.tag}</div> : <></>}
      </div>
      {props.subTitle ? <p>{props.subTitle}</p> : <></>}
      {props.showPrice ? (
        <div className="price">
          <h5> {props.price ? props.price : "--"} ETH</h5>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
