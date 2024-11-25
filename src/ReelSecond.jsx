import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, setDoc, onSnapshot } from "firebase/firestore";
import { database, useFirebase } from "./Firebase";
import Layout from "./Layout";
import { Music, Like, Comment, Send, Savee, Dot, Saved, Red } from './MoreSvg';
import Loader from './Loader';
import useIntersectionObserver from "./useIntersectionObserver";
import { useNavigate, useParams } from "react-router-dom";

export default function ReelSecond() {
  const { id, reelsId } = useParams();  // Fetch userId and reelsId from URL
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebase = useFirebase();
  const { user, followUser, unfollowUser } = firebase;
  const [followingList, setFollowingList] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [userr, setUser] = useState(null);
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };


  const handleLike = async (postId, postOwnerId) => {
   
    if (!user || !user.uid) return;

    try {
      const postRef = doc(database, 'users', postOwnerId, 'posts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const post = postSnapshot.data();
        const isLiked = post.likes && post.likes.includes(user.uid);
        const newLikes = isLiked 
          ? post.likes.filter(like => like !== user.uid)
          : [...(post.likes || []), user.uid];

        await updateDoc(postRef, { likes: newLikes });
        setReels(prevReels => 
          prevReels.map(reel => 
            reel.id === postId ? { ...reel, likes: newLikes } : reel
          )
        );
      } else {
        console.error('Post not found in Firestore.');
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };


  const handleSave = async (postId, postOwnerId, postUrl, likes = [], comments = []) => {
    if (!user || !user.uid) return;

    try {
        const savedRef = doc(database, 'users', user.uid, 'savedPosts', postId);
        const savedDoc = await getDoc(savedRef);

        if (savedDoc.exists()) {
            await deleteDoc(savedRef);
            setSavedPosts(prevSavedPosts => ({ ...prevSavedPosts, [postId]: false }));
        } else {
            await setDoc(savedRef, {
                postId: postId,
                postOwnerId: postOwnerId,
                postUrl: postUrl,
                likes: likes,
                comments: comments
            });
            setSavedPosts(prevSavedPosts => ({ ...prevSavedPosts, [postId]: true }));
        }
    } catch (error) {
        console.error("Error saving/unsaving post:", error);
    }
  };

  const fetchSavedPosts = async () => {
    if (!user || !user.uid) return;

    try {
      const savedPostsRef = collection(database, 'users', user.uid, 'savedPosts');
      const savedPostsSnapshot = await getDocs(savedPostsRef);

      const savedPostIds = savedPostsSnapshot.docs.map(doc => doc.data().postId);
      setSavedPosts(savedPostIds.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

  useEffect(() => {
    const fetchUserData = () => {
      if (id) {  // URL params se jo 'id' mili hai uske hisaab se user data fetch karenge
        const userRef = doc(database, "users", id);
  
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            setUser(userData); // Yahaan aap 'userData' ko seedha 'setUser' mein set kar sakte hain
          } else {
            console.log("User data not found in Firestore.");
          }
        });
  
        return () => unsubscribe();
      } else {
        console.log("Invalid user ID in URL params.");
      }
    };
  
    fetchUserData();
  }, [id]); // 'id' ko dependency mein add karenge, taaki jab bhi URL ka 'id' change ho to data reload ho
  
  

  useEffect(() => {
    const fetchAllReels = async () => {
      const userRef = doc(database, "users", id); // Get specified user
      const postsRef = collection(userRef, "posts");
      const postsSnapshot = await getDocs(postsRef);

      // Filter for specific reel by reelsId
      const userReels = postsSnapshot.docs
        .filter(doc => doc.id === reelsId && doc.data().type === "video")
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

      setReels(userReels);
      setLoading(false);
    };

    fetchAllReels();
  }, [id, reelsId]);
  
 console.log("reels",reels);

 const handleFollow = async (event, userIdToFollow) => {
  event.preventDefault();

  if (followingList.includes(userIdToFollow)) {
    await unfollowUser(user?.uid, userIdToFollow, 'unfollow');
    setFollowingList(followingList.filter(id => id !== userIdToFollow));
  } else {
    await followUser(user?.uid, userIdToFollow, 'follow');
    setFollowingList([...followingList, userIdToFollow]);
  }
};

useEffect(() => {
  const fetchFollowingList = async () => {
    try {
      const userRef = doc(database, "users", user.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const followingIds = userSnapshot.data().following || [];
        setFollowingList(followingIds);
      }
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  };

  if (user) {
    fetchFollowingList();
  }
}, [user]);
  return (
    <Layout>
    <div className="Reel_main w-100 DALJU flex-column bg" >
        {loading ? (
          <Loader />
        ) : (
          reels.map((reel, index) => {
            const isLiked = reel.likes && reel.likes.includes(user?.uid);
           return(
           
            <div
            key={reel.id}
            className="Reel_centerrr position-relative d-flex justify-content-center align-items-center  h-100 "
            
          >
              
              <div className="Main_reelss h-100" >


                <div className="position-relative w-100 h-100">
                <div
                  className="w-100 h-100 DALJU position-relative HELLO bg-danger"
                  onClick={toggleMute}
                >
                  <VideoComponent src={reel.url} vol={!isMuted} />
                </div>
                  <div style={{ position: "absolute", bottom: "3px", padding: "0 16px" }} className="w-100 bg- gap-2 d-flex flex-column">
                    <span className="d-flex align-items-center gap-2">
                     <img src={userr?.proimg} style={{ height: "32px", width: "32px", borderRadius: "50%" }} className="cr" onClick={()=> navigate(`/SearchProfile/${userr?.userId}`)}/>
                      <span style={{ fontSize: "14px", color: "white" }}>{userr?.username}</span>
                      { followingList.includes(userr?.userId) ? (
                        <button onClick={(event) => handleFollow(event, userr?.userId)} className="cr p-1 DALJU" style={{ fontWeight: "500", fontSize: "14px", color: "#ffffff", border: "1px solid white", borderRadius: "8px", outline: "none", background: "none" }}>
                          Unfollow
                        </button>
                      ) : (
                        <button onClick={(event) => handleFollow(event, userr?.userId)} className="cr p-1 DALJU" style={{ fontWeight: "500", fontSize: "14px", color: "#ffffff", border: "1px solid white", borderRadius: "8px", outline: "none", background: "none" }}>
                          Follow
                        </button>
                      )}
                    </span>
                    <div>
                      <span style={{ fontSize: "15px", color: "white" }}>{reel.description}</span>
                      <span style={{ fontSize: "14px" }}> ...more </span>
                    </div>
                    <div className="d-flex align-items-center gap-1 w-sm-100 w-75" style={{height:"31px",padding:"5px 10px",backgroundColor:"rgba(219,219,219,.09)",border:"1px solid rgba(225,225,225,.04)",borderRadius:"20px",cursor:"pointer",color:"white"}} >
                      <Music/>
                      <span style={{fontSize:"15px"}}>{reel.fullname}  .  Original audio</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="Reel_side h-100 px-3 pb-2 d-flex flex-column justify-content-end" >
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex flex-column align-items-center"> 
                  <div onClick={() => handleLike(reel.id,userr?.userId)}>
                                                {isLiked ? <div style={{ color: "red" }} className='cr'><Red /></div> : <div className='cr'><span className="text-white d-sm-none d-block"><Like /></span> <span className=" d-sm-block d-none"><Like /></span></div>}
                                            </div>
                    <span style={{fontSize:"12px"}} className='Reel_icon'>{reel.likes ? reel.likes.length : 0}</span>       
                  </div>
                  <span className='Reel_icon'><Comment /></span>
                  <span className='Reel_icon'><Send/></span>
                  <span onClick={() => handleSave(reel.id,  userr?.userId,reel.url,reel.likes, reel.comments)}>
            {savedPosts[reel.id] ?<div className='cr'><span className="text-white d-sm-none d-block"><Saved /></span> <span className=" d-sm-block d-none"><Saved /></span></div> :<div className='cr '> <span className="text-white d-sm-none d-block"><Savee /></span> <span className=" d-sm-block d-none"><Savee /></span></div>}
          </span>
                  <span className='Reel_icon'><Dot/></span>
                  <img src={userr?.proimg} alt="small_img" style={{height:"24px",width:"24px",border:"0.3px solid black",borderRadius:"3px"}}/>
                </div>
              </div>
            </div>
           )
})
        )}
      </div>
    </Layout>
  );
}

const VideoComponent = ({ src, vol }) => {
  const videoRef = useRef(null);
  const [videoContainerRef, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });

  useEffect(() => {
    const video = videoRef.current;
    if (isIntersecting) {
      video.play().catch(error => console.error("Play failed", error));
    } else {
      video.pause();
    }
  }, [isIntersecting]);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    video.currentTime = 0;
    video.play().catch(error => console.error("Replay failed", error));
  };

  return (
    <div ref={videoContainerRef} className="w-100 h-100">
      <video
        ref={videoRef}
        src={src}
        volume={vol ? 1 : 0}
        onEnded={handleVideoEnd}
        muted={!vol}
        autoPlay
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
