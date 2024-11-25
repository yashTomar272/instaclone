import { IoIosArrowBack } from "react-icons/io";
import { LuUserCheck } from "react-icons/lu";
import { PiTextAaBold } from "react-icons/pi";
import { FaRegStickyNote } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Cross} from "./MoreSvg"
import prof from './imgs/profile.jpg'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef ,useEffect} from "react";
import { useFirebase } from "./Firebase"; // Firebase ka context
import { storage, database } from "./Firebase"; // Firebase storage aur Firestore ka import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Storage functions
import { collection,addDoc } from "firebase/firestore"; // Firestore functions
import boy from './imgs/boy.jpg'
import Loader from './Loader'

export default function ZZZ(){
    const navigate=useNavigate();
const firebase=useFirebase();
const [userr, setUser] = useState(null);
const [isUploading, setIsUploading] = useState(false); // Upload status
const [loader,setLoader]=useState(false)

const { user } = firebase;

const {CreateStory,setCreateStory}=firebase;
const location = useLocation();
  const { file, fileURL, fileType } = location.state || {}; // Accessing the passed data
  
  
  
  

  // Share button click hone par file upload karna
  const handleShare = async () => {
    console.log("yash")
    if (!file ) return;
  
    setIsUploading(true);

    try {
        const fileRef = ref(storage, `Story/${user.uid}/${file.name}`);

        // File upload करना 
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Upload progress (optional)
            },
            (error) => {
                console.error("Upload failed:", error);
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                // Firestore में user के अंदर posts collection का document reference
                const postsRef = collection(database, "users", user.uid, "Story");

                const newPost = {
                    url: downloadURL,
                   
                    type: fileType, // 'image' या 'video'
                    likes: "0", // Likes null से initialize होंगे
                   
                };

                // नया document create करना और automatic unique ID generate करना
                await addDoc(postsRef, newPost);

                setIsUploading(false);
                setLoader(true);
                alert("Post shared successfully!");
                
            }
        );
    } catch (error) {
        console.error("Error sharing post:", error);
        setIsUploading(false);
    }
};
useEffect(() => {
    const data = firebase.userdata;
    // console.log("hhhh", data);
    setUser(data);
  }, [firebase.userdata]);

    return(
        <>
        <div className="ZZZZ w-100 DALJU p-sm-3 position-relative" style={{background: "rgba(0,0,0,0.65)"}}>

        <div  style={{zIndex:"2001", position: "absolute", top: "15px", right: "15px", color: "white" }} className="cr d-md-block d-none"  onClick={() => navigate(-1)}>
                    <Cross />
                </div>
<div  className="Create_main h-100 position-relative">
<div className="w-100 bg- m-0 d-flex  justify-content-center flex-column position-relative h-100" style={{borderRadius:"10px"}}>
   
<div className=" d-flex justify-content-between align-items-center bg- p-3  w-100"   style={{zIndex:"2005",position:"absolute",top:"0px"}} >
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"  onClick={() => navigate(-1)}><IoIosArrowBack/></div>
<div className="d-flex gap-2">
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><LuUserCheck/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><PiTextAaBold/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><FaRegStickyNote/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><BsStars/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><IoMusicalNotesOutline/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><BsThreeDots/></div>   
</div>
</div>

{/* {isUploading && <div className="text-center w-100 position-absolute DALJU" style={{top:"50%",zIndex:"2009"}}><Loader/></div>}
{fileType === "image" ? ( */}
                                    <img
                                        // src={fileURL.current}  Using ref to persist image URL
                                        alt="Selected"
                                        src={boy}
                                        style={{
                                             width: "100%",
                                             height: "100%",
                                            objectFit: "cover",
                                           position:"absolute",
                                          background:"red"
                                        }}
                                    />
                                {/* ) : (
                                    <div  className="h-100 w-100">
                                  
                                    <video
                                   
                                    className="w-100 h-100 "
                                       
                                        autoPlay
                                        style={{
                                            objectFit: "cover",
                                            
                                        }}
                                    > <source src={fileURL.current} type="video/mp4" /></video>
                                    </div> */}
                                {/* )} */}

</div>
<div className="bg-dark w-100 position-absolute py-4 px-3 d-flex justify-content-between align-items-center" style={{bottom:"0px",right:"0px",height:"85px"}}>
<div className="py-2 px-3 gap-2 text-white DALJU cr" style={{borderRadius:"20px",background: "rgba(0,0,0,0.65)"}}>
<div tyle={{height:"23px",width:"23px",borderRadius:"50%",border:"1px solid white"}}><img src={prof} style={{height:"23px",width:"23px",borderRadius:"50%"}}/></div>
<span style={{fontSize:"12px",fontWeight:"500"}}>Your stories</span>
</div>
<div className="py-2 px-3 gap-2 text-white DALJU cr" style={{borderRadius:"20px",background: "rgba(0,0,0,0.65)"}}>
<div style={{height:"23px",width:"23px",borderRadius:"50%",border:"1px solid white",background:"green"}} className="DALJU p-1"><FaStar/></div>
<span style={{fontSize:"12px",fontWeight:"500"}}>Close Friends</span>
</div>
<div style={{height:"40px",width:"40px",borderRadius:"50%"}} className="bg-white DALJU fs-5 cr" onClick={handleShare}><IoIosArrowForward/></div>
</div>
</div>
        </div>
        </>
    )
}










// import {Home,Explore,Reel,Create,Post,Live,Message,Profile,Search,Bar,InstaLogo,Like,Down} from './ReelSvg';
// import { FiInstagram } from "react-icons/fi";
// import React,{useState,useContext, useEffect} from 'react'
// import { useFirebase } from "./Firebase";
// import { useNavigate } from "react-router-dom";
// import logo from './imgs/logo.jpg';
// import SearchPage from './SearchPage';
// import MoreBox from './MoreBox';
// import Notification from './Notification';
// import { SSearch } from './MoreSvg';


// import { useMediaQuery } from 'react-responsive';
// export default function Sidebar({children}) {

//   const firebase=useFirebase();
//   const {allShow,setAllShow}=firebase;
//   const navigate=useNavigate();
//   const [logout,setlogout]=useState(true);
//   const [create,setcreate]=useState(true);
//   const [notification,setnotification]=useState(true);
//   const [text,settext]=useState(true);
//   const [open,setOpen]=useState(true);
// // const {search, firebase.SetSearch}= firebase;
// const isShowIcon = useMediaQuery({ query: '(max-width: 1199px)' });
//   // const [messShow,setmessShow]=useState(true)
//   const handleNotification=()=>{
//     if(allShow!="Notification"){
//       setAllShow("Notification");
//      }
//      else{
//       setAllShow("")
//      }
//   }
//   const handleSearchPage=(data)=>{
//     firebase.setSearch(data);
//    if(allShow!="Search"){
//     setAllShow("Search");
//    }
//    else{
//     setAllShow("")
//    }
//   }
//   const handleCreate=()=>{
//     if(allShow!="Create"){
//       setAllShow("Create");
//      }
//      else{
//       setAllShow("")
//      }
//   }
//   const handleReels=()=>{
//     if(allShow!="Reel"){
//       setAllShow("Reel");
//       navigate("/ReelPage")
//      }
//      else{
//       setAllShow("")
//      }
//   }
//   const handleLogoutPage=()=>{
//     if(allShow!="Logout"){
//       setAllShow("Logout");
//      }
//      else{
//       setAllShow("")
//      }
//   }
 
//   const handleMainProfile= async()=>{
//     setAllShow("")
//     navigate('/MainProfile');
//   }
//   const handleExplore= async()=>{
//     setAllShow("")
//     navigate('/Explore');
//   }

//   const handleHome=()=>{
//     setAllShow("")
//     navigate('/');
//   }
 
//  const BootomArr = [
//     { icon: <Home /> },
//     { icon: <Explore/> },
//     { icon: <Search/> },
//    { icon: <Reel/>,onClick:handleReels},
//     { icon: <Create/>,onClick:handleCreate},
//     { icon: <Message/>},
//     { icon: <Profile/> },
//   ];
//   const SideArr=[
//   {icon:<Home/>,name:"Home",onClick:handleHome},
//   {icon:<Search />,name:"Search"},
//   {icon:<Explore/>,name:"Explore",onClick:handleExplore},
//   {icon:<Reel/>,name:"Reel",onClick:handleReels},
//   {icon:<Message/>,name:"Messages"},
//   {icon:<Like/>,name:"Notifications",onClick:handleNotification},
//   {icon:<Create/>,name:"Create",className:"POSITION",onClick:handleCreate},
//   {icon:<Profile/>,name:"Profile",onClick:handleMainProfile},
//   ]
//   return (
//     <div className='position-relative ' style={{height:"100vh"}}>
//     <div className="d-flex Sidde    d-md-block d-none DALJU  h-100 bg-white" style={{borderRight:"1px solid #e8e3e3"}}>
     
//       <div className=' position-relative  p-3 '>
     
//         <div className=" mt-3 " style={{ height: "39px" }}>
//           <div  className={`icons p-2 Side_text ${firebase.search? "d-none":""}`} ><InstaLogo/></div>
//           <div
//             className={` icons ${firebase.search || isShowIcon  ? "d-block": "d-none"}`}
//             style={{ padding: "10px", maxWidth: "230px" }}
//           >
//             <FiInstagram size={25} className={`fs-3 Side_insta_logo `} />
//           </div>
//         </div>
//         <div
//           className="Icons_group  d-flex justify-content-between gap-2 flex-column"
//           style={{ marginTop: "33px" }}
//         >
//         {
//           SideArr.map((val,id)=>{
//             return(
//              <div className="position-relative cr ">  <div key={id}
//               className={`${val.className ? val.className : ""} icons d-flex position-relative`}  onClick={val.onClick}
//                 style={{ padding: "10px", maxWidth: "230px" }} >
//                 <span className='arrIcon' onClick={()=>val.name==="Search"?handleSearchPage(true):handleSearchPage(false)}>{val.icon}</span>
//                 <span className={`Side_text ms-3 ${firebase.search? "d-none":""}`}  onClick={()=>val.name==="Search"?handleSearchPage(false):handleSearchPage(true)}>{val.name}</span>
//                 </div>        {val.name === "Create" && (allShow==="Create"?
//   <div>
//   <CreateBox/>
// </div>:
// null


//       )}
//                  </div>
              
//             )
//           })
//         }
//        {/* setSearch */}
//         </div>
// <div className="position-relative cr">
//         <div className="icons d-flex mt-5" onClick={handleLogoutPage} style={{ padding: "10px" }}>
//         <span className='arrIcon'> <Bar/></span>
//           <span className={`Side_text ms-3 ${firebase.search? "d-none":""}`}>More</span>
//         </div>
//         {
//           allShow==="Logout"?
//           <div >
//           <MoreBox/>
//           </div>:
//           null
//         }
       
//         </div>


//       </div>
       

//       {/* search page */}
//       {allShow==="Search"?
//       <div style={{position:"relative"}}>
//       <SearchPage/>
//     </div>:
//     null
//       }

//       {allShow==="Notification"?
//       <div style={{position:"relative"}}>
//         <Notification/>
//     </div>:
//     null
//       }
//     </div>
//     <div>
//     </div>
// {/* top */}
// <div className='position-relative w-100 h-100 d-md-none d-block ' >
//   <div style={{height:"60px",top:"0px",left:"0px",zIndex:"1000",padding:"0px 16px", borderBottom: "1px solid #e8e3e3"}} className='position-fixed bg-white w-100 d-flex align-items-center justify-content-between'>
//   <div className='cr d-flex align-items-center gap-1'><InstaLogo/> <Down/> </div>
//   <div className='d-flex  gap-4 align-items-center'>
//     <div className='d-block d-sm-none'><Create/></div>
//     <div className='d-sm-block d-none'>
//   <div style={{maxWidth:"268px",height:"36px",borderRadius:"8px",background:"#efefef",padding:"3px 16px"}}
//    className='  gap-2 ms-3 position-relative d-flex align-items-center'>
//     <SSearch/>
//     <input type="search" placeholder='Search' style={{border:"none",outline:"none",backgroundColor:"#efefef"}} className='w-100'/>
//   </div>
//   </div>
//   <div onClick={()=>navigate("/NotificationSecond")} className='cr'><Like/></div>
// </div>
//   </div>

//   <div  className=" w-100  bg-white  d-flex flex-row align-items-center justify-content-around  position-fixed"
//         style={{ height: "60px", borderTop: "1px solid #e8e3e3",bottom:"0px",left:"0px",zIndex:"1000"}}>

// {BootomArr.map((val, id) => {
//           return (
//             <div key={id}  onClick={val.onClick} className= {`${id===1 ||id===4  ? "d-none d-sm-block": ""} ${id===2  ? "d-block d-sm-none": ""} `}>
//               <span className='arrIconn cr'>{val.icon}</span>
//             </div>
//           );
//         })}
//   </div>
// </div>

//     </div>
    
//   );
// }

// const CreateBox=()=>{
//   const firebase= useFirebase();
  
 
//  const handlehello=()=>{
//  firebase.setCreatepost(true)
//  console.log("setCreatepost",firebase.createpost)
//  }
//   return(
   
//     <div className="Create bg-white" style={{zIndex:"10",height:"88px",width:"200px",position:"absolute",left:"0px",top:"50px",borderRadius:"10px",boxShadow:"2px 0px 10px rgba(0,0,0,0.5)",cursor:"pointer"}}>
//     <div onClick={handlehello}  style={{height:"44px",borderBottom:"1px solid #e8e3e3"}} className="d-flex Create_logo p-3  justify-content-between align-items-center">
//       <span style={{fontSize:"16px"}}>Post</span>
//       <Post/>
//     </div>
//     <div></div>
//       <div style={{height:"44px"}} className="d-flex Create_logo p-3 pb-3 align-items-center justify-content-between">
//         <span style={{fontSize:"16px"}}>Live video</span>
//         <Live/>
//       </div>
     
//     </div>
   
 
//   )
// }
