import React from "react";
import Header from "../components/header/HeaderStyle2";
import ItemContent2 from "../components/layouts/ItemContent2";
import SideBar from "../components/layouts/home-8/SideBar";

const MyCollections = () => {
  return (
    <div className="home-8">
      <section className="tf-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            {/* <div className="col-box-17">
              <SideBar />
            </div> */}

            <div className="col-box-100">
              <ItemContent2 />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyCollections;

// import React, { useEffect, useState } from "react";
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
// import { getWallet, getPublicKey } from "../utils/GetContract";
// import { ContractFactory } from "fuels";
// import { token } from "../utils/auth";

// const MyCollections = () => {
//   const [collections, setCollections] = useState([]);

//   const loadData = async () => {
//     const publicKey = await getPublicKey();
//     const data = await fetch(
//       `${process.env.REACT_APP_API_URL}/collection/owner/${publicKey}`,
//       {
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     let result = await data.json();
//     console.log(result);
//     setCollections(result);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   return (
//     <div className="item-details">
//       <div className="tf-section tf-item-details style-2">
//         <div className="themesflat-container mt-5 pt-5 pb-5">
//           <div className="content-item open">
//             {collections ? (
//               collections.map((item, key) => (
//                 <div key={key} className="col-item">
//                   <div className="sc-card-product menu_card style-h7">
//                     <div className="meta-info style">
//                       <div className="author"></div>
//                     </div>
//                     <div className="card-media">
//                       <Link to={`/update-property/${item.contract_id}`}>
//                         <img src={item.mainImage} alt="fluxen" />
//                       </Link>
//                     </div>
//                     <div className="card-title">
//                       <h5>
//                         <Link to="item-details.html">{item.contract_id}</Link>
//                       </h5>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <></>
//             )}
//             <div className="col-item">
//               <div className="sc-card-product menu_card style-h7">
//                 <div className="meta-info style">
//                   <div className="author"></div>
//                 </div>
//                 <div className="card-media">
//                   <Link to="/create-property">
//                     <img src={imgdetail1} alt="fluxen" />
//                   </Link>
//                 </div>
//                 <div className="card-title">
//                   <h5>
//                     <Link to="/create-property">Create New</Link>
//                   </h5>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCollections;
