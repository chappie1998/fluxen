import { Link, useParams } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import img6 from "../assets/images/avatar/avt-8.jpg";
import imgdetail1 from "../assets/images/box-item/images-item-details2.jpg";
import { getManagerContract, getPublicKey } from "../utils/GetContract";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "../components/Calender";

const ItemDetails02 = () => {
  const contract_id = useParams();

  const borrow_nft = async (token, amount, start_time, end_time) => {
    const contract = await getManagerContract();
    const lend_nft = await contract()
      .functions.lend_nft(
        { value: contract_id },
        token,
        { Address: { value: getPublicKey } },
        start_time,
        end_time,
        amount
      )
      .txParams({ gasPrice: 1 })
      .callParams({
        forward: [amount],
      })
      .call();
    console.log("lend_nft", lend_nft);
  };

  const onChange = (ranges) => {
    console.log(ranges);
  };

  return (
    <div className="item-details">
      <div className="tf-section tf-item-details style-2">
        <div className="themesflat-container mt-5 pt-5 pb-5">
          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  <img src={imgdetail1} alt="Fluxen" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <div className="meta-item">
                    <div className="left">
                      <h2>“The Pretty Fantasy Flower illustration ”</h2>
                    </div>
                  </div>
                  <div className="client-infor sc-card-product">
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img src={img6} alt="Fluxen" />
                        </div>
                        <div className="info">
                          <span>Owner</span>
                          <h6>
                            <Link to="/author-02">Ralph Garraway</Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>
                    Habitant sollicitudin faucibus cursus lectus pulvinar dolor
                    non ultrices eget. Facilisi lobortisal morbi fringilla urna
                    amet sed ipsum vitae ipsum malesuada. Habitant sollicitudin
                    faucibus cursus lectus pulvinar dolor non ultrices eget.
                    Facilisi lobortisal morbi fringilla urna amet sed ipsum
                  </p>
                </div>
                <button className="sc-button loadmore style bag fl-button pri-3">
                  <span>Reserve</span>
                </button>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="calender">
                <Calendar onChange={onChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails02;
