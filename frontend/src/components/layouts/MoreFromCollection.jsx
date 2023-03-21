import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";

import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

const MoreFromCollection = (props) => {
  const data = props.data;

  return (
    <Fragment>
      <section className="tf-section live-auctions">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions">
                <h3 className="tf-title pb-24">MORE FROM COLLECTION</h3>
                <Link
                  to={`/collection/${data[0].nft_contract}`}
                  className="exp style2"
                >
                  EXPLORE MORE
                </Link>
              </div>
            </div>
            <div className="col-md-12">
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={30}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  767: {
                    slidesPerView: 2,
                  },
                  991: {
                    slidesPerView: 3,
                  },
                  1300: {
                    slidesPerView: 4,
                  },
                }}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {data.slice(0, 7).map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-container show-shadow carousel auctions">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="slider-item">
                            <div className="sc-card-product explode style2">
                              <div className="card-media">
                                <Link
                                  to={`/asset/${item.nft_contract}/${item.token_id}`}
                                >
                                  <img src={item.nft_data.image} alt="fluxen" />
                                </Link>
                              </div>
                              <div className="card-title">
                                <h5>
                                  <Link
                                    path="relative"
                                    to={`/asset/${item.nft_contract}/${item.token_id}`}
                                  >
                                    {item.nft_data.name}
                                  </Link>
                                </h5>
                              </div>

                              <div className="card-bottom style-explode">
                                <div className="price">
                                  <span>Price</span>
                                  <div className="price-details">
                                    <h5>{(item.price / 1e9).toFixed(3)}</h5>
                                  </div>
                                </div>

                                <div className="tags">fuel</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

MoreFromCollection.propTypes = {
  data: PropTypes.array.isRequired,
};

export default MoreFromCollection;
