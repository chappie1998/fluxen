import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avt from "../assets/images/avatar/avata_profile.jpg";
import bg1 from "../assets/images/backgroup-secsion/option1_bg_profile.jpg";
import bg2 from "../assets/images/backgroup-secsion/option2_bg_profile.jpg";
import { token } from "../utils/auth";
import { getPublicKey } from "../utils/GetContract";
import { Web3Storage } from "web3.storage";

const EditProfile = () => {
  const [imageURL, setImageURL] = useState(avt);
  const [image, setImage] = useState();
  const client = new Web3Storage({
    token: process.env.REACT_APP_WEB_STORAGE_TOKEN,
  });
  // const [publicKey, setPublicKey] = useState();
  const navigate = useNavigate();

  const storeFiles = async (files) => {
    const cid = await client.put(files, {
      wrapWithDirectory: false,
    });
    return cid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    form.reportValidity();
    if (form.checkValidity()) {
      const formControls = form.elements;
      const publicKey = await getPublicKey();
      const profile_image =
        "https://" + (await storeFiles(image)) + ".ipfs.w3s.link";
      let body = {
        address: publicKey,
        profile_image: profile_image,
        name: formControls["name"].value,
        custom_url: formControls["customUrl"].value,
        email: formControls["email"].value,
        bio: formControls["bio"].value,
        facebook: formControls["facebook"].value,
        twitter: formControls["twitter"].value,
        discord: formControls["discord"].value,
      };

      // remove all falsy value from body
      body = Object.entries(body).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      try {
        const response = await fetch(
          `${process.env.REACT_APP_AMRKETPLACE_API_URL}/user/update`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          }
        );
        if (response.ok) {
          navigate("/author/" + publicKey);
        } else if (!response.ok) {
          console.log("Unauthorized or token expired");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  function getFiles(e) {
    if (e.target.files) {
      setImageURL(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files);
    }
  }
  return (
    <div>
      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row mt-5">
            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
              <div className="sc-card-profile text-center">
                <div className="card-media">
                  <img id="profileimg" src={imageURL} alt="Fluxen" />
                </div>
                <div id="upload-profile">
                  <Link to="#" className="btn-upload">
                    Upload New Photo
                  </Link>
                  <input
                    id="tf-upload-img"
                    type="file"
                    name="profile"
                    required
                    onChange={getFiles}
                  />
                </div>
                {/* <Link to="#" className="btn-upload style2">
                  Delete
                </Link> */}
              </div>
            </div>
            <div className="col-xl-9 col-lg-8 col-md-12 col-12">
              <div className="form-upload-profile">
                <form id="profile-form" className="form-profile">
                  <div className="form-infor-profile">
                    <div className="info-account">
                      <h4 className="title-create-item">Account info</h4>
                      <fieldset>
                        <h4 className="title-infor-account">Display name*</h4>
                        <input
                          type="text"
                          placeholder="Trista Francis"
                          required
                          name="name"
                        />
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Custom URL</h4>
                        <input
                          type="text"
                          placeholder="Fluxen.Trista Francis.com/"
                          name="customUrl"
                        />
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Email</h4>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                        />
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Bio</h4>
                        <textarea tabIndex="4" rows="5" name="bio"></textarea>
                      </fieldset>
                    </div>
                    <div className="info-social">
                      <h4 className="title-create-item">Your Social media</h4>
                      <fieldset>
                        <h4 className="title-infor-account">Facebook</h4>
                        <input
                          type="text"
                          placeholder="Facebook username"
                          name="facebook"
                        />
                        {/* <Link to="#" className="connect">
                          <i className="fab fa-facebook"></i>Connect to face
                          book
                        </Link> */}
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Twitter</h4>
                        <input
                          type="text"
                          placeholder="Twitter username"
                          name="twitter"
                        />
                        {/* <Link to="#" className="connect">
                          <i className="fab fa-twitter"></i>Connect to Twitter
                        </Link> */}
                      </fieldset>
                      <fieldset>
                        <h4 className="title-infor-account">Discord</h4>
                        <input
                          type="text"
                          placeholder="Discord username"
                          name="discord"
                        />
                        {/* <Link to="#" className="connect">
                          <i className="icon-fl-vt"></i>Connect to Discord
                        </Link> */}
                      </fieldset>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="tf-button-submit mg-t-15"
                    type="submit"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
