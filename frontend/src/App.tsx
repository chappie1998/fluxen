import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <Fragment>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      {/* <Footer /> */}
    </Fragment>
  );
}

export default App;
