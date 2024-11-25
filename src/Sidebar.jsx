import {Home,Explore,Reel,Create,Post,Live,Message,Profile,Search,Bar,InstaLogo,Like,Down} from './ReelSvg';
import { FiInstagram } from "react-icons/fi";
import React,{useState,useContext, useEffect} from 'react'
import { useFirebase } from "./Firebase";
import { useNavigate } from "react-router-dom";
import logo from './imgs/logo.jpg';
import SearchPage from './SearchPage';
import MoreBox from './MoreBox';
import Notification from './Notification';
import { SSearch } from './MoreSvg';


import { useMediaQuery } from 'react-responsive';
export default function Sidebar({children}) {

  const firebase=useFirebase();
  const {allShow,setAllShow,navv,setNavv,SsetFollowing,SsetFollower,setFollowing,setFollower}=firebase;
  const navigate=useNavigate();
  const [logout,setlogout]=useState(true);
  const [create,setcreate]=useState(true);
  const [notification,setnotification]=useState(true);
  const [text,settext]=useState(true);
  const [open,setOpen]=useState(true);
// const {search, firebase.SetSearch}= firebase;
const isShowIcon = useMediaQuery({ query: '(max-width: 1199px)' });
  // const [messShow,setmessShow]=useState(true)
  const handleNotification=()=>{
    if(allShow!="Notification"){
      setAllShow("Notification");
     
     }
     else{
      setAllShow("")
      
     }
  }
  
  const handleSearchPage=(data)=>{
    firebase.setSearch(data);
   if(allShow!="Search"){
    setAllShow("Search");
   }
   else{
    setAllShow("")
   }
  }
  const handleCreate=()=>{
    console.log("yash")
    if(allShow!="Create"){
      setAllShow("Create");
      SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
     }
     else{
      setAllShow("")
      SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
     }
  }
  const handleReels=()=>{
    if(allShow!="Reel"){
    setAllShow("Reel");
    navigate("/ReelPage")
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setNavv("Reel");
     }
     else{
    setAllShow(" ")
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setNavv(" ")
     }
  }
  const handleLogoutPage=()=>{
    if(allShow!="Logout"){
      setAllShow("Logout");
     }
     else{
      setAllShow("")
     }
  }
 
  const handleMainProfile= async()=>{
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setAllShow("")
    setNavv("Profile")
    navigate('/MainProfile');
  }
  const handleExplore= async()=>{
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setAllShow("")
    setNavv("Profile")
    navigate('/Explore');
  }

  const handleHome=()=>{
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setAllShow("")
    navigate('/instaclone');
    setNavv("")
  }
  const handleSearch=()=>{
    SsetFollowing(false);
    SsetFollower(false);
    setFollowing(false);
    setFollower(false);
    setAllShow("")
    navigate('/SearchEx');
    setNavv("Explore")
  }
  const handleSmallNoti=()=>{
  
    if(allShow!="Notification"){
      setAllShow("Notification");
      setNavv("Notification");
      navigate("/NotificationSecond");
     }
     else{
      setAllShow("")
      setNavv("")
     }
  }
 const handleMess=()=>{
  alert("Work on this page is in progress")
 }
 const BootomArr = [
    { icon: <Home />,name:"Home",onClick:handleHome },
    { icon: <Explore/>,name:"Explore",onClick:handleExplore },
    { icon: <Search/>,name:"Search" ,onClick:handleSearch},
   { icon: <Reel/>,name:"Reel",onClick:handleReels},
    { icon: <Create/>, name:"Create",onClick:handleCreate},
    { icon: <Message/>,name:"Message",onClick:handleMess},
    { icon: <Profile/>,name:"Profile",onClick:handleMainProfile },
  ];
  const SideArr=[
  {icon:<Home/>,name:"Home",onClick:handleHome},
  {icon:<Search />,name:"Search",onClick:handleSearchPage},
  {icon:<Explore/>,name:"Explore",onClick:handleExplore},
  {icon:<Reel/>,name:"Reel",onClick:handleReels},
  {icon:<Message/>,name:"Messages",onClick:handleMess},
  {icon:<Like/>,name:"Notifications",onClick:handleNotification},
  {icon:<Create/>,name:"Create",className:"POSITION",onClick:handleCreate},
  {icon:<Profile/>,name:"Profile",onClick:handleMainProfile},
  ]
  return (
    
    <div className='position-relative ' style={{height:"100vh",overflow:"visible"}}>
   
    <div className="d-flex  d-md-block d-none DALJU  h-100 bg-  Sidde " >
     
      <div className='dede bg-daner  p-3   ' >
     
        <div className=" mt-3 " style={{ height: "39px" }}>
          <div  className={` p-2 Side_text `} onClick={handleHome}><InstaLogo/></div>
          <div
          onClick={handleHome}
            className="Side_insta_logo"
            style={{ padding: "10px", maxWidth: "230px" }}
          >
  <FiInstagram size={25} className={`fs-3 Side_insta_logo `} />
          </div>
        </div>
        <div
          className="Icons_group  d-flex justify-content-between gap-2 flex-column"
          style={{ marginTop: "33px" }}
        >
        {
          SideArr.map((val,id)=>{
            return(
             <div className="position-relative cr ">  <div key={id}
              className={`${val.className ? val.className : ""} icons d-flex position-relative`}  onClick={val.onClick}
                style={{ padding: "10px", maxWidth: "230px" }} >
                <span className='arrIcon' onClick={()=>val.name==="Search"?handleSearchPage(true):handleSearchPage(false)}>{val.icon}</span>
                <span className="Side_text active ms-3"  onClick={()=>val.name==="Search"?handleSearchPage(false):handleSearchPage(true)}>{val.name}</span>
                </div>        {val.name === "Create" && (allShow==="Create"?
  <div>
  <CreateBox/>
</div>:
null


      )}
                 </div>
              
            )
          })
        }
       {/* setSearch */}
        </div>
<div className="position-relative cr">
        <div className="icons d-flex mt-5" onClick={handleLogoutPage} style={{ padding: "10px" }}>
        <span className='arrIcon'> <Bar/></span>
          <span className="Side_text ms-3">More</span>
        </div>
        {
          allShow==="Logout"?
          <div >
          <MoreBox/>
          </div>:
          null
        }
       
        </div>


      </div>
       

      {/* search page */}
      {allShow==="Search"?
      <div style={{position:"absolute",top:"0px",right:"0px"}}>
      <SearchPage/>
    </div>:
    null
      }

      {allShow==="Notification"?
           <div style={{position:"absolute",top:"0px",right:"0px"}}>
        <Notification/>
    </div>:
    null
      }
    </div>
    <div>
    </div>
{/* top */}

<div className='position-relative w-100 h-100 d-md-none d-block ' >
  <div className={`${navv==="Reel" || navv==="Notification" || navv==="Profile"  || navv==="Explore"?"d-none":"d-block"   }`}>
  <div style={{height:"60px",top:"0px",left:"0px",zIndex:"1000",padding:"0px 16px", borderBottom: "1px solid #e8e3e3"}} className={` d-flex align-items-center w-100  position-fixed bg-white `}>
  <div className='w-100 d-flex align-items-center h-100 justify-content-between position-relative'> 
  <div className='cr d-flex align-items-center gap-1'><InstaLogo/> <Down/> </div>
  <div className='d-flex  gap-4 align-items-center'>
   
   <div className='position-relative'> <div onClick={()=>handleCreate()} className='d-block d-sm-none cr'><Create/>
   { allShow==="Create"?
  <div>
  <CreateBoxxx/>
</div>:
null
      }
   </div>
   
   </div>
    <div className='d-sm-block d-none'>
  <div style={{maxWidth:"268px",height:"36px",borderRadius:"8px",background:"#efefef",padding:"3px 16px"}}
   className='  gap-2 ms-3 position-relative d-flex align-items-center'>
    <SSearch/>
    <input type="search" placeholder='Search' style={{border:"none",outline:"none",backgroundColor:"#efefef"}} className='w-100'/>
  </div>
  </div>
  <div onClick={handleSmallNoti} className='cr'><Like/></div>
</div>

  </div>
  </div>
  </div>

  <div  className=" w-100  bg-white  d-flex flex-row align-items-center justify-content-around  position-fixed"
        style={{ height: "60px", borderTop: "1px solid #e8e3e3",bottom:"0px",left:"0px",zIndex:"1000"}}>

{BootomArr.map((val, id) => {
          return (
            <div key={id}  onClick={val.onClick} className= {`position-relative ${ id===1 ||id===4  ? "d-none d-sm-block": ""} ${id===2  ? "d-block d-sm-none": ""} `}>
              <span className='arrIconn cr' >{val.icon}</span>
              {val.name === "Create" && (allShow==="Create"?
  <div>
  <CreateBoxx/>
</div>:
null
      )}
            </div>
          );
        })}  
        
  </div>
</div>

    </div>
    
  );
}

const CreateBox=()=>{
  const firebase= useFirebase();
  
 
 const handlehello=()=>{
 firebase.setCreatepost(true)
 console.log("setCreatepost",firebase.createpost)
 }
  return(
   
    <div className="Create bg-white" style={{zIndex:"10",height:"88px",width:"200px",position:"absolute",left:"0px",top:"50px",borderRadius:"10px",boxShadow:"2px 0px 10px rgba(0,0,0,0.5)",cursor:"pointer"}}>
    <div onClick={handlehello}  style={{height:"44px",borderBottom:"1px solid #e8e3e3"}} className="d-flex Create_logo p-3  justify-content-between align-items-center">
      <span style={{fontSize:"16px"}}>Post</span>
      <Post/>
    </div>
    <div></div>
      <div style={{height:"44px"}} className="d-flex Create_logo p-3 pb-3 align-items-center justify-content-between">
        <span style={{fontSize:"16px"}}>Live video</span>
        <Live/>
      </div>
     
    </div>
   
 
  )
}
const CreateBoxx=()=>{
  const firebase= useFirebase();
  
 
 const handlehello=()=>{
 firebase.setCreatepost(true)
 console.log("setCreatepost",firebase.createpost)
 }
  return(
  
    <div className="Create bg-white" style={{zIndex:"10",height:"88px",width:"200px",borderRadius:"10px" ,position:"absolute",left:"-150px",top:"-108px",boxShadow:"2px 0px 10px rgba(0,0,0,0.5)",cursor:"pointer"}}>
    <div onClick={handlehello}  style={{height:"44px",borderBottom:"1px solid #e8e3e3"}} className="d-flex Create_logo p-3  justify-content-between align-items-center">
      <span style={{fontSize:"16px"}}>Post</span>
      <Post/>
    </div>
    <div></div>
      <div style={{height:"44px"}} className="d-flex Create_logo p-3 pb-3 align-items-center justify-content-between">
        <span style={{fontSize:"16px"}}>Live video</span>
        <Live/>
      </div>
     
    </div>
   
 
  )
}
const CreateBoxxx=()=>{
  const firebase= useFirebase();
  
 
 const handlehello=()=>{
 firebase.setCreatepost(true)
 console.log("setCreatepost",firebase.createpost)
 }
  return(
  
    <div className="Create bg-white" style={{zIndex:"10",height:"88px",width:"140px",borderRadius:"10px" ,position:"absolute",left:"-60px",top:"47px",boxShadow:"2px 0px 10px rgba(0,0,0,0.5)",cursor:"pointer"}}>
    <div onClick={handlehello}  style={{height:"44px",borderBottom:"1px solid #e8e3e3"}} className="d-flex Create_logo p-3  justify-content-between align-items-center">
      <span style={{fontSize:"16px"}}>Post</span>
      <Post/>
    </div>
    <div></div>
      <div style={{height:"44px"}} className="d-flex Create_logo p-3 pb-3 align-items-center justify-content-between">
        <span style={{fontSize:"16px"}}>Live video</span>
        <Live/>
      </div>
     
    </div>
   
 
  )
}