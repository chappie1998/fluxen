import Home08 from "./Home08";

import ItemDetails02 from "./ItemDetails02";
import CreateCollection from "./CreateCollection";
import UpdateCollection from "./UpdateCollection";
import MyCollections from "./MyCollections";

import Authors01 from "./Authors01";
import Authors02 from "./Authors02";
import CreateItem from "./CreateItem";
import EditProfile from "./EditProfile";

import NoResult from "./NoResult";
import FAQ from "./FAQ";

import { Sell } from "./Sell";
import CreateItemNft from "./CreateItemNft";

const routes = [
  // { path: "/", component: <Home /> },
  // { path: "/", component: <Home01 /> },
  { path: "/", component: <Home08 /> },

  { path: "/authors-01", component: <Authors01 /> },
  // { path: "/author", component: <Authors02 /> },
  { path: "/author/:publicKey", component: <Authors02 /> },
  { path: "/create-item", component: <CreateItem /> },
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/no-result", component: <NoResult /> },
  { path: "/faq", component: <FAQ /> },
  { path: "/sell/:contract_id/:token", component: <Sell /> },
  { path: "/property/:contract_id", component: <ItemDetails02 /> },
  { path: "/my-properties", component: <MyCollections /> },
  { path: "/create-property", component: <CreateItem /> },
  { path: "/add-room/:contract_id", component: <CreateItemNft /> },
  { path: "/update-property/:contract_id", component: <UpdateCollection /> },
];

export default routes;
