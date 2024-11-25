import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, deleteDoc, getDoc, getDocs } from "firebase/firestore"; 
import { database, useFirebase } from "./Firebase";
import pro from './imgs/profile.jpg';
import { FaArrowTrendUp } from "react-icons/fa6";
import { BiHeartCircle } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Cross, Send, Red, Like,Dot } from './MoreSvg';
import {InstaLogo} from './ReelSvg'


export default function StoryPage() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const { id } = useParams();
  const userIdd = id;
  const [posts, setPosts] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({ username: '', proimg: '' });
  const [red, setRed] = useState(false);
  const [delet, setdelet] = useState(false);
  const [userid, setUserid] = useState(null);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  const handleRed = () => setRed(!red);
  const handleDelet = () => setdelet(!delet);
  
  const handleDelett = async (storyId) => {
    try {
      const storyDocRef = doc(database, "users", userIdd, "Story", storyId);
      await deleteDoc(storyDocRef); 
      setPosts(posts.filter(post => post.id !== storyId)); 
      alert("Story deleted successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = firebase.userdata;
  
        if (data && data.userId) { // Check if data and userId exist
          setUserid(data.userId);
        }
        const userDocRef = doc(database, "users", userIdd); // Reference to the user document
        const userDocSnap = await getDoc(userDocRef); // Fetch user data

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserInfo({
            username: userData.username || "Unknown User", // Default value if not found
            proimg: userData.proimg || pro // Default profile image if not found
          });
        } else {
          console.error("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchPosts = async () => {
      const postsRef = collection(database, "users", userIdd, "Story");
      const querySnapshot = await getDocs(postsRef);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    };

    fetchUserInfo();
    fetchPosts();
  }, [userIdd]);

  const startStoryTimer = (duration) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (progressRef.current) { // Null check
      progressRef.current.style.transition = `width ${duration}s linear`;
      progressRef.current.style.width = '100%';
    }

    timerRef.current = setTimeout(() => {
      handleNextStory();
    }, duration * 1000);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < posts.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      navigate(-1);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleVideoProgress = (e) => {
    startStoryTimer(e.target.duration);
  };

  useEffect(() => {
    if (posts.length > 0) {
      const currentPost = posts[currentStoryIndex];
      
      // Ensure progress bar is reset
      if (progressRef.current) {
        progressRef.current.style.width = '0%';
      }

      if (currentPost?.type === "image") {
        startStoryTimer(15); 
      }
    }
  }, [currentStoryIndex, posts]);
  return(
    <>
    <div className="hhh w-100 DALJU  position-relative" style={{ background: "rgba(0,0,0,0.65)"}}>
        <div style={{ zIndex: "2001", position: "absolute", top: "15px", left: "15px", color: "white" }} className="cr d-md-block d-none">
         <div><InstaLogo/></div>
        </div>
        <div style={{ zIndex: "2001", position: "absolute", top: "15px", right: "15px", color: "white" }} className="cr d-md-block d-none" onClick={() => navigate(-1)}>
          <Cross />
        </div>

        <div className="Story_main  position-relative d-flex justify-content-center flex-column">
          <div style={{ height: "102px", padding: "20px 16px 32px", zIndex: "2005", position: "absolute", top: "0px" }} className="bg- w-100 ">
          <div className="White w-100 d-flex gap-1" style={{ display: "flex" }} ref={progressRef}> 
            {posts.map((_, idx) => (
              <div key={idx} style={{ flex: 1, height: "2px", background: idx === currentStoryIndex ? "white" : "gray" }} ></div>
            ))}
          </div>
          <div className="d-flex align-items-center justify-content-between w-100">
            <div style={{ marginTop: "8px", height: "40px" }} className="d-flex align-items-center gap-2">
              <img src={userInfo.proimg || pro} style={{ width: "32px", height: "32px", borderRadius: "50%" }} alt="Profile" />
              <div style={{ fontWeight: "400", fontSize: "14px" }} className="text-white">{userInfo.username}</div>
              <div style={{ fontWeight: "400", fontSize: "14px", opacity: "0.6" }} className="text-white">Now</div>
            </div>
            <div className="d-md-none d-block d-flex gap-2 align-items-center text-white cr">
              <Dot/>
             <div onClick={() => navigate(-1)}> <Cross/></div>
            </div>
          </div> 
          </div> 
          <div className="w-100 h-100 position-relative DALJU flex-column">
          {posts[currentStoryIndex]?.type === "image" && posts[currentStoryIndex]?.url ? (
             <div className="w-100 h-75 DALJU ">
    <img src={posts[currentStoryIndex].url} alt="Post" className="w-100 h-100" />
    </div>
) : posts[currentStoryIndex]?.type === "video" && posts[currentStoryIndex]?.url ? ( 
  <div className="w-100 h-100 position-relative">
    <video
        src={posts[currentStoryIndex].url}
        className="w-100 h-100"
        style={{ objectFit: "cover" ,
          borderRadius:"9px"
        }}
        autoPlay
        onLoadedMetadata={handleVideoProgress}
        onEnded={handleNextStory}
    />
    </div>
) : null} 

  {
                userid===id?
                <div className="w-100 position-absolute py-4 px-2 d-flex justify-content-around align-items-center" style={{ padding: "16px", bottom: "0px", right: "0px" }}>
               <div className='d-flex gap-3 bg- position-absolute' style={{width:"230px",right:"0px",bottom:"30px"}}>
              <div className='d-flex flex-column text-center '>
                <div className='fs-5 cr text-white'><FaArrowTrendUp/></div>
                <span  style={{ fontWeight: "400", fontSize: "14px" }}  className='text-white'>Boost</span>
                </div> 
              <div className='d-flex flex-column text-center '>
                <div className='fs-5 cr text-white'><BiHeartCircle/></div>
                <span  style={{ fontWeight: "400", fontSize: "14px" }}  className='text-white'>Highlight</span>
                </div> 
              <div className='d-flex flex-column text-center '>
                <div className='fs-5 cr text-white'><Send/></div>
                <span  style={{ fontWeight: "400", fontSize: "14px" }}  className='text-white'>Send</span>
                </div> 
              <div className='d-flex flex-column text-center position-relative'  >
                <div className='fs-5 cr text-white' onClick={handleDelet}><BsThreeDotsVertical/></div>
                <span  style={{ fontWeight: "400", fontSize: "14px" }}  className='text-white'>More</span>
                <div onClick={() => handleDelett(posts[currentStoryIndex].id)} 
     style={{ zIndex:"1000",position: "absolute", display: delet ? "block" : "none", bottom: "53px", fontWeight: "500", right: "10px", fontSize: "15px", background: "white", borderRadius: "7px" }} 
     className='text-danger px-3 cr py-2'>
    Delet
</div>

                
              
                </div> 
              
              
                
               </div>
               </div>:
               <div className="w-100 position-absolute py-4 px-2 d-flex justify-content-around align-items-center" style={{ padding: "16px", bottom: "0px", right: "0px" }}>
               <textarea style={{ width: "190px", height: "44px", borderRadius: "50px", border: "1px solid white", outline: "none", padding: "8px 17px 8px 19px", resize: 'none', color: "#dbdbdb", background: "transparent" }} className="bg-" placeholder="Message....."></textarea>
               <div className="text-white" onClick={handleRed}>{red?<div style={{color:"red"}} className='cr'> <Red /> </div>: <div className='cr'> <Like /></div>}</div>
   
               <div className="text-white"><Send /></div>
             </div>
              }
          <div className="w-100 d-flex justify-content-between position-absolute" style={{ top: "50%", transform: "translateY(-50%)" }}>
            <button onClick={handlePrevStory} style={{height:"400px",border:"none",outline:"none",width:"130px",background:"transparent"}}></button>
           <button onClick={handleNextStory}  style={{height:"400px",border:"none",outline:"none",width:"130px",background:"transparent"}}></button>
          </div>
            </div>

          </div>
          </div>
    </>
  )
}




