import { IoLogoFacebook } from "react-icons/io";
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
  import { useFirebase } from "./Firebase";
  import Auth from "./imgs/auth.png"
import micro from "./imgs/micro.png"
import play from "./imgs/play.png"
import ss1 from "./imgs/screenshot1.png"
import logo from "./imgs/logo.jpg"
import ss2 from "./imgs/screenshot2.png"
import ss3 from "./imgs/screenshot3.png"
import ss4 from "./imgs/screenshot4.png"

export default function SignUpPage() {
   const navigate = useNavigate();
   const firebase=useFirebase();

  const [hideShow,sethideShow]=useState();
  const [types,settypes]=useState();
  
  const [email,setemail]=useState();
  const [password,setpassword]=useState();
  const [fullname,setfullname]=useState();
  const [username  ,setusername]=useState();

  const [Moveimg,setMoveimg]=useState(ss1);
  const [Indx,setIndx]=useState(0);
  const Imges=[ss1,ss2,ss3,ss4];

  const handelHideShow=()=>{
    sethideShow(!hideShow);
    settypes(!types);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    firebase.userData(email,fullname,username,password)
    // Check if email and password are provided
   
       navigate("/BirthPage");
  };

  

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
        className="Main_container bg- w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ height: "663.98px" }}
      >
        <div
          className="Second_mainn bg- d-flex "
         
        >
          <div className=" col first w-100 bg-  " style={{marginTop:"50px",position:"relative"}}>
            <img src={Auth} className="mt-5" />
          <div className="text-center w-100" style={{position:"absolute",top:"0px",right:"-50px",marginTop:'24px'}} >

          <img src={Moveimg} alt="Move_img" className="mt-5"/>

          </div>

          </div>
          <div
            className=" col Second w-100 bg- "
           
          >
            {/* login */}
            <div

              className="Login_dataa bg- d-flex align-items-center justify-content-center flex-column gap-2 "
            
            >
              <img
                src={logo}
                alt="Insta_logo"
                style={{ maxWidth: "207px", marginTop: "24px" }}
              />
              <span className="w-100 text-center px-5" style={{color:"#737373",fontSize:"16px",fontWeight:"600"}}>Sign up to see photos and videos from your friends.</span>
              <button className="btn btn-primary d-flex align-items-center justify-content-center" style={{width:'268px',height:"34px"}}>
                <IoLogoFacebook style={{ color: "white" }} size={23} />
                <span
                  style={{
                    fontWeight:"600",
                    fontSize: "14px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Log in with Facebook
                </span>
              </button>
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

                <form onSubmit={handleSubmit} className="d-flex align-items-center flex-column justify-content-center" >


                  <div className="input-container ">
                    <input
                      onChange={(e)=>setemail(e.target.value)}
                       value={email}
                      type="email"
                      style={{width:"270px"}}
                      placeholder=" "
                      name="email"
                      autoComplete="on"
                      id="inputs"
                      required
                    />
                    <label className="floating-placeholder">
                      Enter email address only
                    </label>
                  </div>
                  <div className="input-container ">
                    <input
                      onChange={(e)=>setfullname(e.target.value)}
                      value={fullname}
                     type="text"
                      name="fullname"
                      autoComplete="on"
                      id="inputs"
                      placeholder=""
                      required
                      style={{width:"270px"}}
                    />
                    <label className="floating-placeholder">
                      Full name
                    </label>
                  </div>
                  <div className="input-container ">
{/*OK BYE I AM GOING  */}
                    <input
                      onChange={(e)=>setusername(e.target.value)}
                      value={username}
                      type="text"
                      name="username"
                      autoComplete="on"
                      id="inputs"
                      placeholder=""
                      required
                      style={{width:"270px"}}

                    />
                    <label className="floating-placeholder">
                     Username
                    </label>
                  </div>
                  <div className="input-container" id="button">
                    <input
                      onChange={(e)=>setpassword(e.target.value)}
                      value={password}
                      type={types?"text":"password"}
                       style={{width:"230px"}}
                      placeholder=" "
                      name="password"
                      autoComplete="on"

                      required
                    />
                    <label className="floating-placeholder">
                      Password
                    </label>
                    <span
                      onClick={handelHideShow}
                      style={{border:"none",color: "#262626",background:"none",fontSize:"14px",marginRight:"4px",marginLeft:"4px",cursor:"pointer"}}
                      >{hideShow?"Hide":"Show"}</span>
                  </div>
                {/* </form>
              </div> */}

              <span className="px-5 text-center" style={{fontSize:"12px",Color:"#737373"}}>People who use our service may have uploaded your contact  to Instagram. <a style={{color:"#00376b"}}> Learn more</a>
</span>
              <span className="px-5 text-center" style={{fontSize:"12px",Color:"#737373"}}>By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
</span>
              <button 
                type="submit"
                className=" btn btn-primary d-flex align-items-center mt-2 justify-content-center"
                style={{ width: "268px", height: "32px",fontWeight:"600" }}
              >
                Sign up
              </button>

</form>


              </div>


            <div
              
              className=" mt-2 d-flex align-items-center justify-content-center Login_border"
            >
              <span>Have an account? </span>
              <button className="fw-bold ms-1" 
                style={{border:"none",color: "#0095f6",background:"none"}}
                onClick={() => navigate("/instaclone")}>

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

      {/* footer data */}
      <div className="w-100 mt-5 d-flex flex-column align-items-center justify-content-center flex-column">
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
