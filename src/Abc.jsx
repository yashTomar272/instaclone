import boy from './imgs/boy.jpg'; // Fallback image
import { Smiles, Dot, Like, Comment, Send, Savee, Red, Playing, Muted ,Saved} from './MoreSvg';
import { database } from './Firebase';
import { useFirebase } from './Firebase';
import { addDoc, collection, doc, getDoc, updateDoc, getDocs, deleteDoc,setDoc } from 'firebase/firestore';

import React, { useRef, useEffect, useState } from "react";
import useIntersectionObserver from "./useIntersectionObserver";
import { TiPlus } from "react-icons/ti";
import { useNavigate  } from 'react-router-dom';
import CreateStory from './CreateStory'
import Loader from './Loader';
import vid1 from './imgs/vid1.mp4'
import vid2 from './imgs/vid2.mp4'
import vid3 from './imgs/vid3.mp4'
import instaImg from './imgs/insta.jpg'



export default function MainPage() {
  const navigate = useNavigate(); 
  const [followingIds, setFollowingIds] = useState([]); // State to store following user IDs
  const [followingPosts, setFollowingPosts] = useState([]); // State to store posts of followed users
  const [loading, setLoading] = useState(true); // State for loading indicator
  const firebase = useFirebase();
  const fileURL = useRef(null);
  const [Color,setColor]=useState("red");
  const [posts, setPosts] = useState([]);
const [selectedFile, setSelectedFile] = useState(); // Selected file
const [hii,setHii]=useState([])

  const { user,setStory,allShow,setAllShow,navv,setNavv,SsetFollowing,SsetFollower,setFollowing,setFollower } = firebase;
  const [vol, setVol] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userr, setUser] = useState(null);
  
  const [fileType, setFileType] = useState(null); // 'image' ya 'video'
  const [followingStories,setFollowingStories]=useState();
 
 
        SsetFollowing(false);
        SsetFollower(false);
        setFollowing(false);
        setFollower(false);
        setNavv(" ")

const instaArr=[
  {video:vid1},
  {video:vid2},
  {video:vid3},
]
  const [savedPosts, setSavedPosts] = useState({});

  const handleSave = async (postId, postOwnerId, postUrl, likes = [], comments = []) => {
    if (!user || !user.uid) return;

    try {
        const savedRef = doc(database, 'users', user.uid, 'savedPosts', postId);
        const savedDoc = await getDoc(savedRef);

        if (savedDoc.exists()) {
            // Agar post pehle se saved hai, to delete kar do
            await deleteDoc(savedRef);
            setSavedPosts(prevSavedPosts => ({ ...prevSavedPosts, [postId]: false }));
            console.log("Post unsaved:", postId);
        } else {
            // Naya post save karna aur post ki additional information add karna
            await setDoc(savedRef, {
                postId: postId,
                postOwnerId: postOwnerId,
                postUrl: postUrl,      // Post URL
                likes: likes,          // Likes array
                comments: comments     // Comments array
            });
            setSavedPosts(prevSavedPosts => ({ ...prevSavedPosts, [postId]: true }));
            console.log("Post saved:", postId);
        }
    } catch (error) {
        console.error("Error saving/unsaving post:", error);
    }
};
// 
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
    fetchSavedPosts();
}, [user]);

// fetch story of following users
useEffect(() => {
  const fetchFollowingIds = async () => {
    if (!user || !user.uid) return; // Check if user is logged in

    try {
      const userRef = doc(database, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const following = userSnapshot.data().following || [];
        setFollowingIds(following); // Storing following IDs

        if (following.length > 0) {
          // Check stories in parallel
          await checkIfStoriesExist(following); 
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching following IDs:', error);
      setLoading(false);
    }
  };

  const checkIfStoriesExist = async (followingIds) => {
    try {
      const storyPromises = followingIds.map(async (userId) => {
        const storiesRef = collection(database, 'users', userId, 'Story');
        const storySnapshots = await getDocs(storiesRef);

        if (!storySnapshots.empty) {
          // If the user has stories, fetch user data and stories
          const userRef = doc(database, 'users', userId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const userStories = storySnapshots.docs.map(storyDoc => ({
              id: storyDoc.id,
              ...storyDoc.data(),
            }));

            return {
              userId: userId,
              username: userData.username,
              proimg: userData.proimg || boy, // Default image if not available
              stories: userStories,
            };
          }
        }
        return null; // Return null if no stories
      });

      // Wait for all promises to resolve
      const storiesData = (await Promise.all(storyPromises)).filter(Boolean);

      setFollowingStories(storiesData); // Storing stories of followed users
      setLoading(false);
    } catch (error) {
      console.error('Error checking stories:', error);
      setLoading(false);
    }
  };

  if (user) {
    fetchFollowingIds();
  }
}, [user]);



  useEffect(() => {
    const data = firebase.userdata;
    // console.log("hhhh", data);
    setUser(data);
     
  }, [firebase.userdata]);

   

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(database, "users", user?.uid, "Story");
        const querySnapshot = await getDocs(postsRef);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user]);

  

 

 
 


const handleLike = async (postId, postOwnerId) => {
  if (!user || !user.uid) return;

  try {
    const postRef = doc(database, "users", postOwnerId, "posts", postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const post = postSnapshot.data();
      const isLiked = post.likes?.includes(user.uid);
      const newLikes = isLiked
        ? post.likes.filter((like) => like !== user.uid) // Unlike logic
        : [...(post.likes || []), user.uid]; // Like logic

      // Firebase में लाइक्स अपडेट करें
      await updateDoc(postRef, { likes: newLikes });

      

      // यूजर की `likedPosts` को भी अपडेट करें
      const userLikedPostRef = doc(database, "users", user.uid, "likedPosts", postId);
      if (isLiked) {
        // Unlike करने पर डिलीट करें
        await updateDoc(userLikedPostRef, { id: doc.id });
      } else {
        // Like करने पर नया एंट्री बनाएं
        await updateDoc(userLikedPostRef, { id: postId });
      }

      console.log(isLiked ? "Post unliked" : "Post liked");
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
  }
};




    
  

  useEffect(() => {
    const fetchFollowingIds = async () => {
      if (!user || !user.uid) return; // Check if user is available
  
      try {
        const userRef = doc(database, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);
  
        if (userSnapshot.exists()) {
          const following = userSnapshot.data().following || [];
          setFollowingIds(following);
  
          if (following.length > 0) {
            // Fetch posts of followed users in parallel
            await fetchPostsOfFollowedUsers(following);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching following IDs:', error);
        setLoading(false);
      }
    };
  
    const fetchPostsOfFollowedUsers = async (followingIds) => {
      try {
        // Use Promise.all to fetch all data in parallel
        const postPromises = followingIds.map(async (userId) => {
          const userRef = doc(database, 'users', userId);
          const userSnapshot = await getDoc(userRef);
  
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const postSnapshots = await getDocs(collection(database, 'users', userId, 'posts'));
  
            const userPosts = postSnapshots.docs.map(postDoc => ({
              id: postDoc.id,
              ...postDoc.data(), // Post data
            }));
  setHii(userPosts)
            return {
              userId: userId,
              username: userData.username,
              proimg: userData.proimg || boy, // Fallback image
              posts: userPosts,
            };
          }
          return null; // Return null if user doesn't exist

        });
  
       

        // Wait for all promises to resolve
        const postsData = (await Promise.all(postPromises)).filter(Boolean); // Filter out null values
        // const shuffledPosts = postsData.sort(() => Math.random() - 0.5);
        const allPosts = postsData.flatMap((item) =>
          item.posts.map((post) => ({
            ...post,
            userId:item.userId,
            proimg: item.proimg,
            username: item.username,
          }))
        );
  console.log(allPosts)
        // Shuffle the posts array
        const shuffledPosts = allPosts.sort(() => Math.random() - 0.5);
        setFollowingPosts(shuffledPosts);
       

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
  
    if (user) {
      fetchFollowingIds();
    }
  }, [user]);
  
  const TruncateText = ({ text }) => {
    if (text.length <= 10) {
      return <span>{text}</span>;
    } else {
      return <span>{text.substring(0, 10)}...</span>;
    }
  };

  // File input open karne ke liye
  const handlePickImg = () => {
    document.getElementById("fileInputt").click();
};

 // File change hone par
 const handleFileChange = (event) => {
  const file = event.target.files[0];
  console.log("file2",file)

  if (file) {
      setSelectedFile(file);
     

      setFileType(file.type.startsWith("image/") ? "image" : "video");
      // Save the file URL in the ref, to avoid reloading on re-renders
      fileURL.current = URL.createObjectURL(file);
     const storyData = {
  file:file,
 
  fileURL: fileURL,
  fileType:file.type.startsWith("image/") ? "image" : "video",
};

// Navigate to CreateStory page with props (data)
navigate('/CreateStory', { state: storyData });
  }
};


const navStory=()=>{
navigate(`/StoryPage/${userr.userId}`)
setStory(true);
setColor("green");

}

  return (
    <div className="w-100 h-100 d-flex align-items-center flex-column bg- mt-5 mt-md-0 bg- ">
      <div className="DALJU flex-column bg Main_main" >

        <div style={{  margin: '20px 0', padding: '8px 0px', height: '100px' }} className="bg- Cath_main w-100">
          <ul
            className=" Cath_main  align-items-center m-0 px-2 gap-3 bg  d-flex w-100"
            style={{  overflowX: "scroll", scrollbarWidth: "none", height: "84px", listStyleType: "none" }}
          >
            <li className="text-center cr bg- h-100"  >
              <div className=" d-flex align-items-center justify-content-center Cath_circ position-relative" style={{ width: "65px", height: "65px" }}>
                {
             posts.length>0? <div className='BORDER DALJU' style={{ width: "62px", height: "62px", borderRadius: "50%",border:`2px solid  ${Color}`}}>  <img onClick={navStory} src={userr?.proimg} alt="Profile_img" style={{ width: "60px", height: "60px", borderRadius: "50%", textDecoration: "none", border: "2px solid white" }} /></div>
                  :  <img onClick={handlePickImg} src={userr?.proimg} alt="Profile_img" style={{ width: "60px", height: "60px", borderRadius: "50%", textDecoration: "none", border: "2px solid white" }} />
                }
                <input
                                type="file"
                                id="fileInputt"
                                style={{ display: "none" }}
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                <div style={{position:"absolute",bottom:"0px",right:"0px",width:"25px",height:"25px",borderRadius:"50%",background:"white"}} className='DALJU '><div className='bg-primary DALJU text-white' style={{width:"22px",height:"22px",borderRadius:"50%"}}  onClick={handlePickImg}><TiPlus/></div></div>
              </div>
              <div className=" bg-L" style={{ fontSize: "12px", fontWeight: "400" }}>
                <TruncateText text="Your story" />
              </div>

            </li>

           
           


       {followingStories && followingStories.length > 0 &&
    followingStories.map((followedUser) => (
      <li className="text-center cr bg- h-100" key={followedUser.userId}>
        <div className="d-flex align-items-center justify-content-center Cath_circ position-relative" style={{ width: "65px", height: "65px" }}>
          <div className='BORDER DALJU' style={{ width: "62px", height: "62px", borderRadius: "50%", border: `2px solid  ${Color}` }}>
            <img
              onClick={() => navigate(`/StoryPage/${followedUser.userId}`)}
              src={followedUser.proimg}
              alt="imgs"
              style={{ width: "60px", height: "60px", borderRadius: "50%", textDecoration: "none", border: "2px solid white" }}
            />
          </div>
        </div>
        <div className="bg-L" style={{ fontSize: "12px", fontWeight: "400" }}>
          <TruncateText text={followedUser.username} />
        </div>
      </li>
    ))
  } 
          </ul>
        </div>
      
     


       
     
         {loading?
        <div className='w-100  DALJU ' style={{height:"80vh"}}><Loader/></div> 
        :
        (
          <>
           {
        hii.length>0?(
          <>
            
             
      {followingPosts.map((post, index) => {
          const isLiked = post.likes && post.likes.includes(user?.uid);
          console.log("isLiked",isLiked)
        return(
          <div className="Post_Secssion" style={{ maxWidth: '468px' }} key={post.id}>
          <div
            className="w-100 bg- d-flex align-items-center justify-content-between"
            style={{ padding: '0px 0px 0px 4px', height: '48px' }}
          >
            <div className="DALJU h-100 gap-1 cr">
              <div
                style={{ width: '42px', height: '42px', borderRadius: '50%' }}
                className="DALJU"
                onClick={() => navigate(`/SearchProfile/${post.userId}`)}
              >
                <img
                  src={post.proimg}
                  className="proimg"
                  alt="img"
                  style={{ height: '32px', width: '32px', borderRadius: '50%' }}
                />
              </div>
              <span className="d-flex flex-column">
                <span className="DALJU h-100 gap-1">
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {post.username}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>.</span>
                  <span style={{ fontSize: '14px', fontWeight: '400', color: '#737373' }}>
                    New
                  </span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: '400' }}>Original audio</span>
              </span>
            </div>
            <span className="cr">
              <Dot />
            </span>
          </div>
      
          {post.type === 'image' ? (
            <div className="DALJU bg-dark Main_video">
              <img
                src={post.url}
                className="h-100 w-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="Main_video DALJU bg-dark position-relative">
              <VideoComponent src={post.url} vol={vol} setVol={setVol} />
              <div 
                className="soundBtnReels position-absolute fs-3 rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => setVol(!vol)}
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  zIndex: '2',
                  height: '35px',
                  width: '35px',
                }}
              >
                {vol ? (
                  <button
                    className="DALJU"
                    style={{
                      zIndex: '1000',
                      color: 'white',
                      border: 'none',
                      outline: 'none',
                      width: '28px',
                      aspectRatio: '1',
                      background: 'rgba(38,38,38)',
                      borderRadius: '50%',
                    }}
                  >
                    <Playing />
                  </button>
                ) : (
                  <button
                    className="DALJU"
                    style={{
                      zIndex: '1000',
                      color: 'white',
                      border: 'none',
                      outline: 'none',
                      width: '28px',
                      aspectRatio: '1',
                      background: 'rgba(38,38,38)',
                      borderRadius: '50%',
                    }}
                  >
                    <Muted />
                  </button>
                )}
              </div>
            </div>
          )}
      
          <div
            className="w-100 bg- d-flex align-items-center justify-content-between py-1"
            style={{ padding: '0px 12px 6px' }}
          >
            <div className="DALJU gap-4">
        
         <div>
          {
            isLiked?(
              <div className="like-button" onClick={() => handleLike(post.id, post.userId)}>
              <Red/>
             </div>
            ):(
              <div className="like-button" onClick={() => handleLike(post.id, post.userId)}>
              <Like/>
             </div>
            )
          }
        
            </div>
              
              <span className="cr">
                <Comment />
              </span>
              <span className="cr">
                <Send />
              </span>
            </div>
            <span onClick={() => handleSave(post.id, post.userId, post.url, post.likes, post.comments)}>
              {savedPosts[post.id] ? (
                <div className="cr">
                  <Saved />
                </div>
              ) : (
                <div className="cr">
                  <Savee />
                </div>
              )}
            </span>
          </div>
      
          <div style={{ margin: '0 4px', fontSize: '14px', fontWeight: '600' }} className="px-2">
            {post.likes ? post.likes.length : 0} likes
          </div>
          <div className="d-flex gap-2 px-3" style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
              {post.username}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '400', color: '#000000' }}>
              {post.description}
            </span>
          </div>
          <span
            style={{ fontSize: '14px', fontWeight: '600', color: '#737373', marginTop: '8px' }}
            className="px-3"
          >
            View all 287 comments
          </span>
          <div className="Teaxt_area d-flex px-3 " style={{ marginTop: '8px' }}>
            <textarea
              placeholder="Add a comment..."
              style={{
                width: '451px',
                maxHeight: '80px',
                border: 'none',
                outline: 'none',
                resize: 'none',
              }}
            ></textarea>
            <Smiles />
          </div>
          <hr className="m-0 p-0"></hr>
        </div>
        )
      })}

      </>
        ):(
          <>
       {
        followingPosts?    (
          <>
           {
  instaArr.map((val,id)=>{
         return(
          <div className="Post_Secssion" style={{ maxWidth: '468px' }} key={id}>
        
         
          <div className="w-100 bg- d-flex align-items-center justify-content-between" style={{ padding: '0px 0px 0px 4px', height: '48px' }}>
            <div className="DALJU h-100 gap-1 cr">
              <div style={{ width: '42px', height: '42px', borderRadius: '50%',border:"1px solid #e8e3e3" }} className="DALJU" >
                <img src={instaImg} className="proimg" alt="img" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
              </div>
              <span className="d-flex flex-column">
                <span className="DALJU h-100 gap-1">
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>instagram</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>.</span>
                  <span style={{ fontSize: '14px', fontWeight: '400', color: '#737373' }}>New</span>
                </span>
                <span style={{ fontSize: '12px', fontWeight: '400' }}>Original audio</span>
              </span>
            </div>
            <span className="cr">
              <Dot />
            </span>
          </div>

            <div className="Main_video DALJU bg-dark position-relative">
              <VideoComponent src={val.video} vol={vol} setVol={setVol} />
              <div
                className="soundBtnReels position-absolute fs-3 rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => setVol(!vol)}
                style={{
                  position: "absolute", bottom: "15px", right: "15px",
                  zIndex: "2",
                  height: "35px",
                  width: "35px",
                }}
              >
                {vol ? (
                  <button className='DALJU'
                    style={{
                      zIndex: "1000"
                      , color: "white", border: "none", outline: "none", width: "28px", aspectRatio: "1",
                      background: "rgba(38,38,38)", borderRadius: "50%"
                    }}><Playing /></button>
                ) : (
                  <button className='DALJU'
                    style={{
                      zIndex: "1000"
                      , color: "white", border: "none", outline: "none", width: "28px", aspectRatio: "1",
                      background: "rgba(38,38,38)", borderRadius: "50%"
                    }}><Muted /></button>
                )}
              </div>
            </div>
       

          <div className="w-100 bg- d-flex align-items-center justify-content-between py-1" style={{ padding: '0px 12px 6px' }}>
            <div className="DALJU gap-4">
            <div >
                               <div className='cr'><Like /></div>
                                    </div>
              <span className=" cr"><Comment /></span>
              <span className=" cr"><Send /></span>
            </div>
            <span >
      <div className='cr'> <Savee /></div>
    </span>
          </div>

          <div style={{ margin: '0 4px', fontSize: '14px', fontWeight: '600' }} className='px-2'>23k likes</div>
                            <div className="d-flex gap-2 px-3" style={{ marginTop: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>instagram</span>
                                <span style={{ fontSize: '14px', fontWeight: '400', color: '#000000' }}>this is official account video enjoy..</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#737373', marginTop: '8px' }} className='px-3'>View all 287 comments</span>
                            <div className="Teaxt_area d-flex px-3 " style={{ marginTop: '8px' }}>
                                <textarea placeholder="Add a comment..." style={{ width: '451px', maxHeight: '80px', border: 'none', outline: 'none', resize: 'none' }}></textarea>
                                <Smiles />
                            </div>
                            <hr className='m-0 p-0'></hr>
        
      

    </div>
         )
        })
       } 
          </>
        ):null
    
       }
          </>
        )
      }</>
        )
        }
       
       
       
      </div>
    </div>
  );
}




