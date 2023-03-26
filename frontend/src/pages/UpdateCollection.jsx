import React from "react";
import Header from "../components/header/HeaderStyle2";
import ItemContent from "../components/layouts/ItemContent3";
import SideBar from "../components/layouts/home-8/SideBar";

const UpdateCollection = () => {
  return (
    <div className="home-8">
      <section className="tf-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-box-17">
              <SideBar />
            </div>

            <div className="col-box-83">
              <ItemContent />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateCollection;

// import React, { useState } from "react";
// import Footer from "../components/footer/Footer";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Countdown from "react-countdown";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
// import img1 from "../assets/images/avatar/avt-3.jpg";
// import img2 from "../assets/images/avatar/avt-11.jpg";
// import img3 from "../assets/images/avatar/avt-1.jpg";
// import img4 from "../assets/images/avatar/avt-5.jpg";
// import img5 from "../assets/images/avatar/avt-7.jpg";
// import img6 from "../assets/images/avatar/avt-8.jpg";
// import img7 from "../assets/images/avatar/avt-2.jpg";
// import imgdetail1 from "../assets/images/box-item/images-item-details2.jpg";
// import { getPublicKey } from "../utils/GetContract";
// import { token } from "../utils/auth";

// const UpdateCollection = () => {
//   const { contract_id } = useParams();
//   const navigate = useNavigate();

//   const create_collection = async () => {
//     const publicKey = await getPublicKey();
//     let body = {
//       contract_id: contract_id,
//       owner: publicKey,
//     };
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/collection`,
//         {
//           method: "POST",
//           headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );
//       if (response.ok) {
//         navigate("/add-rooms/" + contract_id);
//       } else if (!response.ok) {
//         console.log("Unauthorized or token expired");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   return (
//     <div className="item-details">
//       <div className="tf-section tf-item-details style-2">
//         <div className="themesflat-container mt-5 pt-5 pb-5">
//           <div className="row">
//             <div className="col-xl-6 col-md-12">
//               <div className="content-left">
//                 <div className="media">
//                   <img src={imgdetail1} alt="Fluxen" />
//                 </div>
//               </div>
//             </div>
//             <div className="col-xl-6 col-md-12">
//               <div className="content-right">
//                 <div className="sc-item-details">
//                   <div className="meta-item">
//                     <div className="left">
//                       <h2>“The Pretty Fantasy Flower illustration ”</h2>
//                     </div>
//                   </div>
//                   <div className="client-infor sc-card-product">
//                     <div className="meta-info">
//                       <div className="author">
//                         <div className="avatar">
//                           <img src={img6} alt="Fluxen" />
//                         </div>
//                         <div className="info">
//                           <span>Owner</span>
//                           <h6>
//                             {" "}
//                             <Link to="/author-02">Ralph Garraway</Link>{" "}
//                           </h6>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <p>
//                     Habitant sollicitudin faucibus cursus lectus pulvinar dolor
//                     non ultrices eget. Facilisi lobortisal morbi fringilla urna
//                     amet sed ipsum vitae ipsum malesuada. Habitant sollicitudin
//                     faucibus cursus lectus pulvinar dolor non ultrices eget.
//                     Facilisi lobortisal morbi fringilla urna amet sed ipsum
//                   </p>
//                 </div>
//                 <button
//                   onClick={create_collection}
//                   className="sc-button loadmore style bag fl-button pri-3"
//                 >
//                   <span>Update details</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateCollection;
