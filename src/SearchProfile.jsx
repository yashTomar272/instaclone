import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Layout from "./Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Options, SimilarAccount, SmallRell, Boxes,Posts,Reel } from './ReelSvg';
import { useFirebase } from './Firebase';
import { getDocs, collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Sidebar from './Sidebar';
import SearchReelPage from './SearchReelPage';
import SearchPostPage from './SearchPostPage';
import { database } from './Firebase';
import SearchFollowing from './SearchFollowing';
import SearchFollowers from './SearchFollowers';
import { Left  } from './MoreSvg';





export default function SearchProfile() {
  const firebase = useFirebase();
  const { user,Sfollower,SsetFollower,Sfollowing,SsetFollowing } = firebase;
  const { id } = useParams();
  const [showText, setShowText] = useState("-webkit-box");
  const [isExpanded, setIsExpanded] = useState(false);
  const [userr, setUser] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0); // Followers count
  const [followingg, setFollowingg] = useState(0); // Following count'
  const [posts, setPosts] = useState([]); // Posts data ko store karne ke liye

const userIdd=id;




useEffect(() => {
  const fetchPosts = async () => {
    try {
      const postsRef = collection(database, "users", userIdd, "posts"); // Change to collection
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
  useEffect(() => {
    const fetchUser = async () => {
      const productDocRef = doc(database, "users", id);
      const productDoc = await getDoc(productDocRef);
  
      if (productDoc.exists()) {
        const productData = productDoc.data();
        setUser({ id: productDoc.id, ...productData });
        setFollowers(productData.followers ? productData.followers.length : 0); // Followers count
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [id, database]);

  // Fetch the logged-in user's followeing
useEffect(() => {
  const fetchMyFollowing = async () => {
      const userDocRef = doc(database, "users", id); // Get the logged-in user's document
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFollowingg(userData.following ? userData.following.length : 0); // Followers count
      } else {
        setUser(null);
      }
    
  };
  fetchMyFollowing();
}, [id, database]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (user) {
        const loggedInUserRef = doc(database, 'users', user.uid);
        const loggedInUserDoc = await getDoc(loggedInUserRef);
        const loggedInUserData = loggedInUserDoc.data();
  
        if (loggedInUserData.following && loggedInUserData.following.includes(id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    };
    checkIfFollowing();
  }, [user, id]);

  const handleFollowToggle = async () => {
    const loggedInUserRef = doc(database, 'users', user.uid);
    const targetUserRef = doc(database, 'users', id); // The profile being followed/unfollowed
  
    if (isFollowing) {
      // Unfollow the user
      await updateDoc(loggedInUserRef, {
        following: arrayRemove(id),
      });
      await updateDoc(targetUserRef, {
        followers: arrayRemove(user.uid),
      });
      setIsFollowing(false);
      setFollowers(followers - 1); // Decrease followers count
    } else {
      // Follow the user
      await updateDoc(loggedInUserRef, {
        following: arrayUnion(id),
      });
      await updateDoc(targetUserRef, {
        followers: arrayUnion(user.uid),
      });
      setIsFollowing(true);
      setFollowers(followers + 1); // Increase followers count
    }
  };

  useEffect(() => {
    setShowText(isExpanded ? "block" : "-webkit-box");
  }, [isExpanded]);

  const handleFollower=()=>{
    SsetFollower(true)
    console.log("Sfollowers",Sfollower)
}
const handleFollowing=()=>{
    SsetFollowing(true)
    console.log("Sfollowing",Sfollowing)
}
const text = "Money is a tool that can bring comfort and security, but true happiness comes from the richness of experiences and relationships.";
const navigate=useNavigate();

  return (
    <>
    <div style={{zIndex:"10"}}>
      <Layout>
        <div className="Sp_main position-relative" style={{ height: "100vh", width: "100%" }}>
        <div  className='Profile_margin position-relative'>
        <div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",right:"0px",zIndex:"10002"}} className='d-md-none bg-white d-block position-fixed w-100 d-flex align-items-center justify-content-between '>
            <div className='cr' style={{ transform: "rotate(270deg)"}}   onClick={()=>navigate(-1)} ><Left/></div>
           <span style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}}>{userr?.username}</span>
            <div ></div>
          </div>
<div className="header bg-  d-flex flex-column mt-5 mt-md-0 px-3 pt-3">
              <div className='d-flex mt-1  align-items-center'>
                
                    <img src={userr?.proimg} alt="pro_img" className='profile_img' />
                 
                <div style={{ marginLeft: "36px" }}>
                <div className='userName_class d-flex flex-column flex-md-row gap-md-4 gap-2 mt-2 mb-4 ' >
                  <div className='d-flex align-items-center gap-3'>
                    <span style={{ fontSize: "20px", color: "#000000", cursor: "pointer" }}>{userr?.username}</span>
                    <div style={{ width: "32px", aspectRatio: "1", fontWeight: "600" }} className='d-md-none d-block'><Options /></div>
                    </div>
                    <div className='d-flex flex-row gap-2'>
                      <button
                        onClick={handleFollowToggle}
                        style={{
                          border: "none",
                          fontSize: '14px',
                          background: isFollowing ? '#efefef' : '#0095f6',
                          color: isFollowing ? '#000' : '#fff',
                          padding: '0px 16px',
                          borderRadius: '8px',
                          height: '32px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                      <div style={{ fontSize: "14px", background: "#efefef", padding: "0px 16px", borderRadius: "8px", height: "32px", cursor: "pointer", fontWeight: "600" }} className='DALJU text-dark'>Message</div>
                      <div style={{ background: "#efefef", borderRadius: "8px", padding: "8px", fontSize: "16px", height: "32px", cursor: "pointer" }} className='DALJU'><SimilarAccount /></div>
                      <div style={{ width: "32px", aspectRatio: "1", fontWeight: "600" }} className='d-md-block d-none'><Options /></div>
                    </div>
                  </div>
                  <div className='d-md-block d-none'>
                  <ul className='Follow_class d-flex gap-3 p-0 mb-0' style={{ listStyle: "none" }}>
                    <li>
                      <span style={{ fontWeight: "600", fontSize: "16px" }}>{posts?.length}</span> posts
                    </li>
                    <li className='cr' onClick={handleFollower}>
                      <a>
                        <span style={{ fontWeight: "600", fontSize: "16px" }} className='followers cr' >{followers}</span> followers
                      </a>
                    </li>
                    <li className='cr' onClick={handleFollowing}>
                      <a>
                        <span style={{ fontWeight: "600", fontSize: "16px" }}  >{followingg}</span> following
                      </a>
                    </li>
                  </ul>
                  </div>

                  <div className='d-md-block d-none'>
                  <div style={{ fontSize: "14.1px", fontWeight: "600", color: "#000000" }} className='pt-2'>{userr?.fullname}</div>
                  <div style={{ fontSize: "14px", color: "#737373" }}>Education</div>
                  <div className='d-flex'>
                    <div style={{
                      width: "80%",
                      display: showText,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      WebkitLineClamp: isExpanded ? "none" : 1,
                      fontSize: "14px",
                      color: "#000000",
                    }}>
                      {userr?.bio}<span onClick={() => setIsExpanded(false)} style={{ fontSize: "14px", color: "#737373", cursor: "pointer" }}>{isExpanded ? "...less" : ""}</span>
                    </div>
                    <div onClick={() => { setIsExpanded(true) }} style={{ fontSize: "14px", color: "#737373", cursor: "pointer" }}>{isExpanded ? "" : "more"}</div>
                  </div>
                  </div>

                </div>
              </div>
              <div className='d-md-none d-block'>
                  <div style={{ fontSize: "14.1px", fontWeight: "600", color: "#000000" }} className='pt-2'>{userr?.fullname}</div>
                  <div style={{ fontSize: "14px", color: "#737373" }}>Education</div>
                  <div className='d-flex'>
                    <div style={{
                      width: "80%",
                      display: showText,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      WebkitLineClamp: isExpanded ? "none" : 1,
                      fontSize: "14px",
                      color: "#000000",
                    }}>
                      {userr?.bio}<span onClick={() => setIsExpanded(false)} style={{ fontSize: "14px", color: "#737373", cursor: "pointer" }}>{isExpanded ? "...less" : ""}</span>
                    </div>
                    <div onClick={() => { setIsExpanded(true) }} style={{ fontSize: "14px", color: "#737373", cursor: "pointer" }}>{isExpanded ? "" : "more"}</div>
                  </div>
                  </div>

            </div>
<hr style={{background:"#65686c",marginBottom:"0px"}} className='mt-md-4 mt-1 w-100 d-md-none d-block'></hr>
<ul style={{height:"55px",padding:"16px 0px"}} className='w-100 d-flex align-items-center justify-content-around m-0 d-md-none d-block'>
<li className='text-center d-flex flex-column '>
<span style={{fontSize:"14px",fontWeight:"600",color:"#000000"}}>{posts?.length}</span>
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
<hr style={{background:"#65686c",marginBottom:"0px"}} className='mt-md-4 mt-1 w-100'></hr>



<div className='d-md-block d-none'>
           <Tabs>
              <TabList className='Reel_sections d-flex align-items-center justify-content-center gap-5'>
                <Tab href='#' style={{ textDecoration: "none", color: "black", height: "52px" }} className="DALJU "><Boxes /><span style={{ fontSize: "12px", color: "#000000", marginLeft: "6px", fontWeight: "600" }}>POSTS</span></Tab>
                <Tab href='#' style={{ textDecoration: "none", color: "black", height: "52px" }} className="DALJU"><SmallRell /><span style={{ fontSize: "12px", color: "#000000", marginLeft: "6px", fontWeight: "600" }}>RELLS</span></Tab>
              </TabList>
              <TabPanel>
                <SearchPostPage userIdd={userIdd}  />
              </TabPanel>
              <TabPanel>
                <SearchReelPage userIdd={userIdd} />
              </TabPanel>
            </Tabs>
           </div>

           <div className='d-md-none d-block'>
           <Tabs>
              <TabList className='Reel_sections d-flex align-items-center justify-content-around m-0 p-0 gap-5'>
                <Tab href='#' style={{ textDecoration: "none", color: "black", height: "52px" }} className="DALJU "><Posts /></Tab>
                <Tab href='#' style={{ textDecoration: "none", color: "black", height: "52px" }} className="DALJU"><Reel /></Tab>
              </TabList>
              <TabPanel>
                <SearchPostPage userIdd={userIdd}  />
              </TabPanel>
              <TabPanel>
                <SearchReelPage userIdd={userIdd} />
              </TabPanel>
            </Tabs>
           </div>

          </div>
        </div>
      </Layout>
      {Sfollower ? <SearchFollowers userIdd={userIdd} /> : null}
    {Sfollowing?<SearchFollowing userIdd={userIdd}/>:null}
    </div>
    </>
  );
}
