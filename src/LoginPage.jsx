import { IoLogoFacebook } from "react-icons/io";
import React,{useState,useEffect} from "react";
import { useFirebase } from "./Firebase";
import { useNavigate } from "react-router-dom";
import Auth from "./imgs/auth.png"
import micro from "./imgs/micro.png"
import play from "./imgs/play.png"
import ss1 from "./imgs/screenshot1.png"
import logo from "./imgs/logo.jpg"
import ss2 from "./imgs/screenshot2.png"
import ss3 from "./imgs/screenshot3.png"
import ss4 from "./imgs/screenshot4.png"


export default function LoginPage() {
  const firebase=useFirebase();
  console.log("login",firebase)
  const {setNavv,SsetFollowing,SsetFollower,setFollowing,setFollower,setAllShow}=firebase;

  const navigate = useNavigate();
  const [hideShow,sethideShow]=useState();
  const [types,settypes]=useState();
// yhA se hai 5 line ka auto login bala
useEffect(()=>{
  if(firebase.isLoggedIn){
         navigate("/HomePage");
  }
},[firebase,navigate])

  const handelHideShow=(e)=>{
     e.preventDefault();
    sethideShow(!hideShow);                
    settypes(!types);
  }

  const [email, setemail] = useState();
  const [password,setpassword]=useState();



  const handleSubmit = async (e) => {
    e.preventDefault();
     try{
                const resultofLogin= await firebase.loginWithEmailandPass(email, password);
          alert("Login successful");
    console.log("resultofLogin",resultofLogin)
          navigate("/HomePage");
          SsetFollowing(false);
          SsetFollower(false);
          setFollowing(false);
          setFollower(false);
          setAllShow("")
          setNavv("")
     }catch(err){
        alert("Error: Something Went Wrong");
     }
      };



  const handleFacebookLogin = async () => {
    await firebase.loginWithFacebook();
    console.log("Facebook login successful");
  };

  const [Moveimg,setMoveimg]=useState(ss1);
  const [Indx,setIndx]=useState(0);
  const Imges=[ss1,ss2,ss3,ss4];

  useEffect(()=>{
    const interval=setInterval(()=>{
      setMoveimg(Imges[Indx]);
      if(Indx===3){setIndx(0)}else{setIndx(Indx+1)}
      // console.log(Indx)
    },3000)


    return ()=>clearInterval(interval);
  },[Indx]);
  return (
    <>
      <div
        className="Main_container bg- w-100 d-flex align-items-center justify-content-center"
        style={{ height: "663.98px" }}
      >
        <div
          className="Second_main bg- d-flex "
          
        >
          <div className=" col first w-100 position-relative ">
            <img src={Auth} className="mt-2" />
            <div className="text-center w-100" style={{position:"absolute",top:"-40px",right:"-50px",marginTop:'24px'}} >

              <img src={Moveimg} alt="Move_img" className="mt-5"/>

              </div>
          </div>
          <div
            className=" col Second w-100 bg- "
           
          >
            <div
              className="Login_data bg-  d-flex align-items-center flex-column gap-3 "
              
            >
              <img
                src={logo}
                alt="Insta_logo"
                style={{ maxWidth: "207px", marginTop: "24px" }}
              />

              <div className="App mt-1">
                <form onSubmit={handleSubmit}>
                  <div className="input-container ">
                    <input
                      type="text"
                      onChange={(e)=>setemail(e.target.value)}
                      value={email}
                      name="username"
                      autoComplete="on"
                      placeholder=" "
                      required
                      id="inputs"
                    />
                    <label className="floating-placeholder" htmlFor="name">
                      Enter your email only
                    </label>
                  </div>
                  <div className="input-container" id="button">
                    <input
                      type={types?"text":"password"}
                      onChange={(e)=>setpassword(e.target.value)}
                      value={password}
                      placeholder=" "
                      name="password"
                      autoComplete="on"
                      required

                   / >

                    <label className="floating-placeholder" htmlFor="name">
                      Password
                    </label>

                    <span  
                      style={{border:"none",color: "#262626",background:"none",fontSize:"14px",marginRight:"4px",marginLeft:"4px",cursor:"pointer"}}
                       onClick={handelHideShow}
                      >{hideShow?"Hide":"Show"}</span>
              </div>
              <button
                type="submit"
                className=" btn btn-primary fw-bold"
                style={{ width: "268px", height: "32px" }}
              >
                Log in
              </button>
                  </form>
                  </div>
              <div
                className="OR d-flex align-items-center justify-content-center"
                style={{ width: "268px", height: "14.98px" }}
              >
                <div
                  style={{
                    background: "rgb(219,219,219",
                    height: "1px",
                    width: "100%",
                  }}
                ></div>
                <div
                  style={{
                    margin: "0px 18px",
                    fontWeight: "600",
                    fontSize: "0.8125rem",
                    color: "rgb(115,115,115)",
                  }}
                >
                  OR
                </div>
                <div
                  style={{
                    background: "rgb(219,219,219",
                    height: "1px",
                    width: "100%",
                  }}
                ></div>
              </div>

              <div className="mt-2">
                <IoLogoFacebook style={{ color: "#385185" }} size={23} />
                <button
                  style={{
                    fontSize: "14px",
                    color: "#385185",
                    cursor: "pointer",
                    border:"none",
                    background:"none"
                  }}
                   onClick={handleFacebookLogin}
                >
                  Log in with Facebook
                </button>
              </div>
              <span style={{ fontSize: "12px", color: "#00376B" }}>
                Forgotten your password?
              </span>
            </div>
            <div
            
              
              className=" mt-2 d-flex align-items-center justify-content-center Login_border"
            >
              <span>Don't have a account? </span>
              <button className="fw-bold ms-1" 
                style={{border:"none",color: "#0095f6",background:"none"}}
                onClick={() => navigate("/SignUpPage")}
                >

                Sign up
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

      {/* footer data */}
      <div className="w-100 mt-3 d-flex flex-column align-items-center justify-content-center flex-column">
        <div
          className="fotter_data  d-flex align-items-center gap-4 justify-content-center"
          style={{ maxWidth: "1066px", flexWrap:"wrap" }}
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
