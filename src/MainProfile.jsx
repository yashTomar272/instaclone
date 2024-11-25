import { useState,useEffect } from 'react'
import Layout from "./Layout";
import rr from './imgs/img1.jpg'
import FollowersPage from './FollowersPage';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FollowingPage from './FollowingPage';
import Save from './Save';


import profileimg from './imgs/profile.jpg'
import { useNavigate, useParams } from "react-router-dom";
import {Plus,SmallRell,Boxes,Setting,Camera2,AAa,Down,Posts,Reel,Saveee} from './ReelSvg'
import { database, useFirebase} from './Firebase';
import {  doc, getDoc,onSnapshot,collection,getDocs } from "firebase/firestore";
import PostPage from './PostPage';
import ReelsPage from './ReelsPage';
import ActiveSettingpage from './ActiveSettingpage';

import Raj from './Raj'
export default function MainProfile(){
    const navigate=useNavigate();
  ;
  const [posts, setPosts] = useState([]);
   
    const firebase=useFirebase();
    const [followers, setFollowers] = useState(0); // Followers count'
    const [followingg, setFollowingg] = useState(0); // Following count'
    const {setseeting ,seeting,follower,setFollower,following,setFollowing,user} = firebase;
    // Fetch the logged-in user's followers
  useEffect(() => {
    const fetchMyFollowers = async () => {
      if (user) {
        const userDocRef = doc(database, "users", user.uid); // Get the logged-in user's document
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFollowers(userData.followers ? userData.followers.length : 0); // Followers count
        }
      }
    };
    fetchMyFollowers();
  }, [user, database]);

  useEffect(() => {
    let unsubscribeFromSnapshot; // Declare the variable

    if (user) {
        const userDocRef = doc(database, "users", user.uid); // Get the logged-in user's document
        
        unsubscribeFromSnapshot = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setFollowingg(userData.following ? userData.following.length : 0); // Update following count instantly
            }
        });
    }

    // Clean up listener when component unmounts
    return () => {
        if (unsubscribeFromSnapshot) {
            unsubscribeFromSnapshot(); // Unsubscribe from the snapshot listener
        }
    };
}, [user, database]);

  

  
    const handleClose=()=>{
        setseeting(true)
        console.log("yasj",seeting)
    }
    const handleFollower=()=>{
        setFollower(true)
        console.log("follower",follower)
    }
    const handleFollowing=()=>{
        setFollowing(true)
        console.log("follower",following)
    }
    const img=profileimg;
    // const { id } = useParams();
    const [showText,setShowText]= useState("-webkit-box")
    const [isExpanded, setIsExpanded] = useState(false);
    // const [userr,setUser]=useState();
    const [data,setdata]=useState(null);
    useEffect(()=>{
      const getdata=async()=>{
        const userdatas= await firebase.userdata;
setdata(userdatas)
      }
      getdata();
    },[firebase])

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const postsRef = collection(database, "users", user.uid, "posts"); // Change to collection
          const querySnapshot = await getDocs(postsRef); // Use getDocs instead of getDoc
  
          const fetchedPosts = querySnapshot.docs.map(doc => ({
            id: doc.id, // Get the document ID
            ...doc.data() // Get the document data
          }));
  
          setPosts(fetchedPosts); // Update the posts state
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
         
        }
      };
  
      fetchPosts();
    }, [user]);

      const text="Money is a tool that can bring comfort and security, but true happiness comes from the richness of experiences and relationships.  ";
    return(
        <div style={{zIndex:"10"}}>
 

        <Layout>
        <div  className="Sp_main bg- position-relative" style={{zIndex:"15",flexGrow:"1"}}>
        <div  className='Profile_margin position-relative'>
          <div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",right:"0px",zIndex:"10002"}} className='d-md-none bg-white d-block position-fixed w-100 d-flex align-items-center justify-content-between '>
            <div className='cr'  onClick={()=>navigate("/EditProfile")} ><Setting/></div>
            <div className='d-flex gap-2 align-items-center'>
            {data && (<span style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}}>{data.username}</span>)}
              <Down/>
              </div>
            <div className='cr'><AAa/></div>
          </div>
<div className="header bg-  d-flex flex-column mt-4 mt-md-0 px-3 pt-3">
    <div className='d-flex mt-1 align-items-center'>
   
{data && ( <img src={data.proimg} alt="pro_img"  className='profile_img'/>)}

   
   
        <div style={{marginLeft:"36px"}} >
        <div className='userName_class d-flex flex-column flex-md-row gap-md-4 gap-2 mt-2 mb-4 ' >
            
 {data && (<span style={{fontSize:"20px",color:"#000000",cursor:"pointer"}}>{data.username}</span>)}
<div className='d-flex flex-md-row flex-column gap-2'>
<div className='d-flex flex-row gap-2'>
<div style={{height:"32px",padding:"7px 16px",background:"#efefef",fontSize:"14px",borderRadius:"8px",fontWeight:"600",cursor:"pointer",color:"#000000"}} className='DALJU d-md-block d-none' onClick={()=>navigate("/EditProfile")}>Edit Profile</div>
<div style={{height:"32px",padding:"7px 16px",background:"#efefef",fontSize:"14px",borderRadius:"8px",fontWeight:"600",cursor:"pointer",color:"#000000"}} className='DALJU d-md-none d-block ' onClick={()=>navigate("/EditProfile3")}>Edit Profile</div>
<div style={{fontSize:"14px",background:"#efefef",padding:"0px 16px",borderRadius:"8px",height:"32px",cursor:"pointer",fontWeight:"600",color:"#000000"}} className='DALJU  '>View archive</div>
</div>
<div  className='DALJU tool '>Ad tools</div>
<div style={{cursor:"pointer"}} className='DALJU d-md-block d-none' onClick={handleClose}><Setting /></div>        
        </div>
        </div>
        <div className='d-md-block d-none'>
        <ul className='Follow_class d-flex gap-3 p-0 mb-0 ' style={{listStyle:"none"}}> 
<li>
    <span style={{fontWeight:"600",fontSize:"16px"}}>{posts.length} </span>
    posts
</li>
<li onClick={handleFollower} className='cr'>
    <a>
    <span style={{fontWeight:"600",fontSize:"16px"}} className='followers'>{followers}  </span>
    followers
    </a>
</li>
<li className='cr' onClick={handleFollowing}>
    <a>
    <span style={{fontWeight:"600",fontSize:"16px"}}>{followingg}  </span>
    following
    </a>
</li>
        </ul>
        </div>
      <div className='d-md-block d-none'>
      {data && ( <div style={{fontSize:"14.1px",fontWeight:"600",color:"#000000"}} className='pt-2'>{data.fullname}</div>)}
        <div style={{fontSize:"14px",color:"#737373"}}>Education</div>
        <div className='d-flex'>
        <div style={{width:"80%",
        display: showText,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        // textOverflow: 'ellipsis',
        // whiteSpace: isExpanded ? 'normal' : 'nowrap',
        WebkitLineClamp: isExpanded ? "none" : 1,
        fontSize:"14px",
        // color:"red",

        color:"#000000",
        // overflowWrap:"breakWord"
        }}
        
        >{data?.bio}
    </div>
    <div onClick={()=>{setIsExpanded(!isExpanded); setShowText(isExpanded? "block":"-webkit-box")}} style={{fontSize:"14px",color:"#737373",cursor:"pointer"}}>{isExpanded? "  more": "...less"}</div></div>
      </div>
    </div>
    </div>
    <div className='d-md-none d-block'>
      {data && ( <div style={{fontSize:"14.1px",fontWeight:"600",color:"#000000"}} className='pt-2'>{data.fullname}</div>)}
        <div style={{fontSize:"14px",color:"#737373"}}>Education</div>
        <div className='d-flex'>
        <div style={{width:"80%",
        display: showText,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        // textOverflow: 'ellipsis',
        // whiteSpace: isExpanded ? 'normal' : 'nowrap',
        WebkitLineClamp: isExpanded ? "none" : 1,
        fontSize:"14px",
        // color:"red",

        color:"#000000",
        // overflowWrap:"breakWord"
        }}
        
        >{data?.bio}
    </div>
    <div onClick={()=>{setIsExpanded(!isExpanded); setShowText(isExpanded? "block":"-webkit-box")}} style={{fontSize:"14px",color:"#737373",cursor:"pointer"}}>{isExpanded? "  more": "...less"}</div></div>
      </div>
    
    <ul className='Add_hiligit w-100 d-flex gap-5 ms-lg-2 p-0' style={{marginTop:"40px",textDecoration:"none"}}>
    <li  className='DALJU flex-column profile_ul_li' >
        <div  className='DALJU Profile_hili'>
        <div className='w-100 h-100 DALJU bg- rounded-circle'>
      <Plus/>
        </div>
        </div>
        <span style={{fontSize:"12px",color:"#000000",fontWeight:"600"}} className='mt-2'>New</span>
    </li>

    </ul>
</div>
<hr style={{background:"#65686c",marginBottom:"0px"}} className='mt-md-4 mt-1 w-100'></hr>
<ul style={{height:"55px",padding:"16px 0px"}} className='w-100 d-flex align-items-center justify-content-around m-0 d-md-none d-block'>
<li className='text-center d-flex flex-column '>
<span style={{fontSize:"14px",fontWeight:"600",color:"#000000"}}>{posts.length}</span>
<span style={{fontSize:"14px",fontWeight:"600",color:"#737373"}}>posts</span>
</li>
<li className='text-center d-flex flex-column cr'  onClick={handleFollower}>
<span style={{fontSize:"14px",fontWeight:"600",color:"#000000"}}>{followers}</span>
<span style={{fontSize:"14px",fontWeight:"600",color:"#737373"}}>followers</span>
</li>
<li className='text-center d-flex flex-column cr' onClick={handleFollowing}>
<span style={{fontSize:"14px",fontWeight:"600",color:"#000000"}}>{followingg}</span>
<span style={{fontSize:"14px",fontWeight:"600",color:"#737373"}}>following</span>
</li>
</ul>
<hr style={{background:"#65686c",marginBottom:"0px"}} className='mt-md-4 mt-1 w-100 d-md-none d-block'></hr>

<div className='d-md-none d-block'>
<Tabs >
<TabList className='Reel_sections d-flex align-items-center justify-content-around gap-5 px-4 m-0'>
<Tab href='#' style={{textDecoration:"none",color:"black",height:"52px"}} className="DALJU cr "><Posts/></Tab>
<Tab href='#' style={{textDecoration:"none",color:"black",height:"52px"}} className="DALJU cr"><Reel/></Tab>
<Tab href='#' style={{textDecoration:"none",color:"black",height:"52px"}} className="DALJU cr"><Saveee/></Tab>
</TabList>
<hr style={{background:"#65686c",marginBottom:"0px"}} className='mt-md-4 mt-1 w-100'></hr>
<TabPanel >
              <PostPage />
 </TabPanel>
<TabPanel>
              <ReelsPage />
 </TabPanel>
<TabPanel>
              <Save />
 </TabPanel>
</Tabs>
</div>
<div className='d-md-block d-none'>
<Tabs>
<TabList className='Reel_sections d-flex align-items-center justify-content-center gap-5'>
<Tab href='#' style={{textDecoration:"none",color:"black",height:"52px"}} className="DALJU cr "><Boxes/><span style={{fontSize:"12px",color:"#000000",marginLeft:"6px",fontWeight:"600"}}>POSTS</span></Tab>
<Tab href='#' style={{textDecoration:"none",color:"black",height:"52px"}} className="DALJU cr"><SmallRell/><span style={{fontSize:"12px",color:"#000000",marginLeft:"6px",fontWeight:"600"}}>RELLS</span></Tab>
</TabList>
<TabPanel >
              <PostPage />
 </TabPanel>
<TabPanel>
              <ReelsPage />
 </TabPanel>
</Tabs>
</div>
    </div>
    </div>
  
    </Layout>
    {seeting? <ActiveSettingpage/>:null}
    {follower?<FollowersPage/>:null}
    {following?<FollowingPage/>:null}
        </div>
    )
}
