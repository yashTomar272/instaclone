
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "./Firebase";
import micro from "./imgs/micro.png";
import auth from "./imgs/auth.png";
import play from "./imgs/play.png";
import ss1 from "./imgs/screenshot1.png";
import allimg from "./imgs/allimg.png";
import ss2 from "./imgs/screenshot2.png";
import ss3 from "./imgs/screenshot3.png";
import ss4 from "./imgs/screenshot4.png";

export default function EmailPage() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const {setNavv,SsetFollowing,SsetFollower,setFollowing,setFollower,setAllShow}=firebase;


  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp);
  };

  useEffect(() => {
    generateOtp();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.saveData();

    // User OTP ko compare karna generated OTP se
    if (userOtp === generatedOtp) {
      
      alert("You are register successfull");
      navigate("/SeeAll")
      SsetFollowing(false);
          SsetFollower(false);
          setFollowing(false);
          setFollower(false);
          setAllShow("")
          setNavv("Profile");
    } else {
      setErrorMessage("Invalid OTP");
    }
  };

  const [Moveimg, setMoveimg] = useState(ss1);
  const [Indx, setIndx] = useState(0);
  const Imges = [ss1, ss2, ss3, ss4];

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
  }, [Indx]);

  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 1919; i <= currentYear; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayOptions = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dayOptions.push(i);
    }
    setDays(dayOptions);
  }, [month, year]);

  return (
    <>
      <div
        className="Main_container bg- w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ height: "663.98px" }}
      >
        <div
          className="Second_main bg- d-flex "
          
        >
          <div className=" col first w-100 bg-  " style={{ position: "relative" }}>
            <img src={auth} className="mt-3" />
            <div className="text-center w-100" style={{ position: "absolute", top: "0px", right: "-50px", marginTop: '-7px' }}>
              <img src={Moveimg} alt="Move_img" className="mt-5" />
            </div>
          </div>
          <div
            className=" col Second w-100 bg- "
           
          >
            <div
              className="Login_dataaa bg- p-4 d-flex align-items-center justify-content-center flex-column gap-2 "
             
            >
              <span style={{ backgroundRepeat: "no-repeat", backgroundPosition: "-440px -142px", height: "76px", width: "64px",backgroundImage:`url(${allimg})` }}>
              </span>
              {/* <span style={{ backgroundRepeat: "no-repeat", backgroundPosition: "30px -148px", height: "76px", width: "64px", overflow: "hidden" }}>
                <img src={allimg} alt="Insta_logo" />
              </span> */}
              <span className="w-100 text-center px-5" style={{ color: "#000", fontSize: "16px", fontWeight: "600" }}>
                Enter confirmation code
              </span>
              <span className="d-flex flex-column text-center">
                <span>
                  <span style={{ color: "black", fontSize: "14px" }}>Enter the confirmation code that we sent to:</span>
                  <span style={{ color: "black", fontSize: "14px" }}>{firebase?.email} <span style={{ fontSize: "14px", color: "#0095f6", cursor: "pointer" }} onClick={generateOtp}>Resend code</span></span>
                </span>
                <span className="" style={{ fontSize: "13px", color: "red" }}>{generatedOtp}</span>
              </span>

              <form onSubmit={handleSubmit} className="d-flex align-items-center flex-column justify-content-center">
                <div className="input-container ">
                  <input
                    type="text"
                    name="otp"
                    autoComplete="on"
                    placeholder=" "
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)} // User OTP ko state me set kar rahe hain
                    required
                    id="inputs"
                  />
                  <label className="floating-placeholder" htmlFor="name">
                    Confirmation code
                  </label>
                </div>
                <button
                  type="submit"
                  style={{ color: "#0095f6", border: "none", background: "none", fontSize: "14px", fontWeight: "600" }}
                >
                  Verify OTP
                </button>
              </form>

              {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
            </div>

            <div
              
              className=" mt-2 d-flex align-items-center justify-content-center Login_border"
            >
              <span>Don't have a account? </span>
              <button className="fw-bold ms-1"
                style={{ border: "none", color: "#0095f6", background: "none" }}
                onClick={() => navigate("/")}
              >
                Log in
              </button>
            </div>
            <div
              className="d-flex mt-3 align-items-center justify-content-center"
              style={{ width: "350px" }}
            >
              <span style={{ color: "#000000", fontSize: "14px" }}>
                Get the app.
              </span>
            </div>
            <div
              className="Play_store_logo d-flex justify-content-center gap-2 mt-3"
              style={{ width: "350px", height: "44px" }}
            >
              <img src={play} alt="playstore_img" />
              <img src={micro} alt="microsoft_img" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 mt-5 d-flex flex-column align-items-center justify-content-center flex-column">
        <div
          className="fotter_data  d-flex align-items-center gap-4 justify-content-center"
          style={{ maxWidth: "1066px", flexWrap: "wrap" }}
        >
          <a style={{ color: "#737373", fontSize: "12px" }}>Meta</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>About</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Blog</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Jobs</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Help</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Api</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Privacy</a>
          

          <a style={{ color: "#737373", fontSize: "12px" }}>Term</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Locations</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Instagram Lite</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Threads</a>
          <a style={{ color: "#737373", fontSize: "12px" }}>
            Contact uploading and non-users
          </a>
          <a style={{ color: "#737373", fontSize: "12px" }}>Meta Verified</a>
        </div>
        <div
          className="fotter_data col mt-3  d-flex align-items-center gap-4 justify-content-center"
          style={{
            maxWidth: "1066px",
            color: "#737373",
            fontSize: "13px",
            marginBottom: "60px",
          }}
        >
          <span>English (UK)</span>
          <span>© 2024 Instagram from Meta</span>
        </div>
      </div>
    </>
  );
}

