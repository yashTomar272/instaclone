import { useState, useEffect, useRef } from "react"; 
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, setDoc, onSnapshot } from "firebase/firestore";
import { database, useFirebase } from "./Firebase";
import Layout from "./Layout";
import { Music, Like, Comment, Send, Savee, Dot, Saved, Red } from './MoreSvg';
import Loader from './Loader';
import useIntersectionObserver from "./useIntersectionObserver";
import { useNavigate } from "react-router-dom";

export default function ReelPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebase = useFirebase();
  const { user, followUser, unfollowUser } = firebase;
  const [followingList, setFollowingList] = useState([]);
  const [savedPosts, setSavedPosts] = useState({});
  const [userr, setUser] = useState(null);
  const navigate=useNavigate()
  const [isMuted, setIsMuted] = useState(false); // State to track mute status

console.log("user.uid",user.uid)
  




const toggleMute = () => {
  setIsMuted(prev => !prev); // Toggle mute status
};
  
  useEffect(() => {
    // Real-time listener to fetch userdata faster
    const fetchUserData = () => {
      if (firebase && firebase.auth && firebase.auth.currentUser) {
        const userId = firebase.auth.currentUser.uid; // Get current user's UID
        const userRef = doc(database, "users", userId);
  
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            setUser(userData.userId);
          } else {
            console.log("User data not found in Firestore.");
          }
        });
  
        // Cleanup function to unsubscribe the listener
        return () => unsubscribe();
      } else {
        console.log("User not authenticated.");
      }
    };
  
    fetchUserData();
  }, [firebase]);
  
  

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
    const fetchAllReels = async () => {
      const usersRef = collection(database, "users");
  
      // Using onSnapshot for real-time updates
      const unsubscribe = onSnapshot(usersRef, async (usersSnapshot) => {
        let allReels = [];
  
        // Create an array of promises for fetching posts concurrently
        const fetchReelsPromises = usersSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
  
          // Skip reels of the logged-in user
          if (userId === user.uid) return [];
  
          const postsRef = collection(database, "users", userId, "posts");
          const postsSnapshot = await getDocs(postsRef);
  
          // Filter and map posts to reels, fetching only video posts
          return postsSnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              username: userDoc.data().username,
              fullname: userDoc.data().fullname,
              userProfilePic: userDoc.data().proimg,
              userID: userDoc.data().userId
            }))
            .filter(post => post.type === "video");
        });
  
        // Wait for all promises to resolve
        const reelsResults = await Promise.all(fetchReelsPromises);
        allReels = reelsResults.flat(); // Flatten the array of arrays
  
        setReels(allReels);
        setLoading(false);
      });
  
      return () => unsubscribe();
    };
  
    fetchAllReels();
  }, []);
  

  
 console.log("reels",reels)

  return (
    <Layout>
      <div className=" w-100 DALJU flex-column h-100 " >
        {loading ? (
          <Loader />
        ) : (
          reels.map((reel, index) => {
            const isLiked = reel.likes && reel.likes.includes(user?.uid);
          console.log("isLiked",isLiked)

           return(
           
            <div 
              key={reel.id}
              className=" position-relative d-flex  h-100 " 
              style={{ MaxWidth: "390px" }}>
              
              <div className=" h-100 Main_reelss">
                <div className="position-relative w-100 h-100">
                <div className="w-100 h-100 DALJU position-relative HELLO" onClick={toggleMute} style={{height:"auto"}}> {/* Add onClick event */}
                      <VideoComponent src={reel.url} vol={!isMuted} /> {/* Pass mute status */}
                    </div>
                  <div style={{ position: "absolute", bottom: "3px", padding: "0 16px" }} className="w-100 gap-2 d-flex flex-column">
                    <span className="d-flex align-items-center gap-2">
                     <img src={reel.userProfilePic} style={{ height: "32px", width: "32px", borderRadius: "50%" }} className="cr" onClick={()=> navigate(`/SearchProfile/${reel.userID}`)}/>
                      <span style={{ fontSize: "14px", color: "white" }}>{reel.username}</span>
                      { followingList.includes(reel.userID) ? (
                        <button onClick={(event) => handleFollow(event, reel.userID)} className="cr p-1 DALJU" style={{ fontWeight: "500", fontSize: "14px", color: "#ffffff", border: "1px solid white", borderRadius: "8px", outline: "none", background: "none" }}>
                          Unfollow
                        </button>
                      ) : (
                        <button onClick={(event) => handleFollow(event, reel.userID)} className="cr p-1 DALJU" style={{ fontWeight: "500", fontSize: "14px", color: "#ffffff", border: "1px solid white", borderRadius: "8px", outline: "none", background: "none" }}>
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
                      <span style={{fontSize:"15px"}}>.  Original audio</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Reel_side h-100 px-3  py-2 d-flex flex-column justify-content-end" >
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex flex-column align-items-center"> 
                  <div onClick={() => handleLike(reel.id, reel.userID)}>
                                                {isLiked ? <div style={{ color: "red" }} className='cr'><Red /></div> : <div className='cr'><span className="text-white d-sm-none d-block"><Like /></span> <span className=" d-sm-block d-none"><Like /></span></div>}
                                            </div>
                    <span style={{fontSize:"12px"}} className='Reel_icon'>{reel.likes ? reel.likes.length : 0}</span>       
                  </div>
                  <span className='Reel_icon'><Comment /></span>
                  <span className='Reel_icon'><Send/></span>
                  <span onClick={() => handleSave(reel.id, reel.userID,reel.url,reel.likes, reel.comments)}>
            {savedPosts[reel.id] ?<div className='cr'><span className="text-white d-sm-none d-block"><Saved /></span> <span className=" d-sm-block d-none"><Saved /></span></div> :<div className='cr '> <span className="text-white d-sm-none d-block"><Savee /></span> <span className=" d-sm-block d-none"><Savee /></span></div>}
          </span>
                  <span className='Reel_icon'><Dot/></span>
                  <img src={reel.userProfilePic} alt="small_img" style={{height:"24px",width:"24px",border:"0.3px solid black",borderRadius:"3px"}}/>
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
    <div ref={videoContainerRef}>
      <video ref={videoRef} src={src} volume={vol ? 1 : 0} onEnded={handleVideoEnd} muted={!vol} autoPlay loop style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
