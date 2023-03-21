import "./App.css";
import "./assets/scss/common.scss";
import "./assets/scss/pages.scss";
import "./assets/scss/components.scss";
import "./assets/scss/elements.scss";
import { Routes, Route } from "react-router-dom";
import routes from "./pages/index";
// import Header from "./components/header/Header";
import { Fragment } from "react";
import Footer from "./components/footer/Footer";
import Header2 from "./components/header/HeaderStyle2";

function App() {
  return (
    <Fragment>
      {/* <Header /> */}
      <Header2 />
      <Routes>
        {routes.map((data, index) => (
          <Route
            onUpdate={() => window.scrollTo(0, 0)}
            exact={true}
            path={data.path}
            element={data.component}
            key={index}
          />
        ))}
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
