import Layout from "./Layout"
import { Chat, Heart } from "./ReelSvg";
import { Reel } from './ReelSvg';
import { useState, useEffect, useRef } from "react"; 
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, setDoc, onSnapshot } from "firebase/firestore";
import { database, useFirebase } from "./Firebase";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";



export default function Explore(){
    const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const firebase = useFirebase();
  const { user } = firebase;
  const navigate=useNavigate()
console.log("k45434",user?.uid)
 

console.log("reels",reels)
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
              if (userId === user?.uid) return [];
      
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
      
    return(
        <>

        <div className="d-sm-block d-none">
        <Layout>
        <div className='Post_Rell_section w-100 d-flex align-items-center justify-content-center flex-wrap bg- p-md-5 p-0'>
        {loading ? (
          <div className="w-100 h-100 DALJU">
            <Loader />
          </div>
        ) : (
         

              reels.map((reel,index)=>{
                return(
                  <div className='bg- col-3 position-relative' style={{ width: "33%", aspectRatio: "1",padding:"1px" }} key={reel.id}>
                    <div className="w-100 h-100 postion-relative">
                      <video src={reel.url} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
                    </div>
                    <div className="caption d-flex DALJU gap-3" onClick={()=>navigate(`/ReelSecond/${reel.userID}/${reel.id}`)}>
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Heart />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}> {reel.likes ? reel.likes.length : 0}</span>
                        </span>
                      </div>
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Chat />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{reel.comment ? reel.comment.length : 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
                 
                 
                
            </div>
        </Layout>
        </div>


        <div className="d-block d-sm-none " style={{marginTop:"65px"}}>
      
        <div className='Post_Rell_section w-100 d-flex align-items-center justify-content-center flex-wrap bg- p-md-5 p-0'>
        {loading ? (
          <div className="w-100 h-100 DALJU">
            <Loader />
          </div>
        ) : (
          
          
         

              reels.map((reel,index)=>{
                return(
                  <div className='bg- col-3 position-relative' style={{ width: "33%", aspectRatio: "1",padding:"1px" }} key={reel.id}>
                    <div className="w-100 h-100 postion-relative">
                      <video src={reel.url} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
                    </div>
                    <div className="caption d-flex DALJU gap-3" onClick={()=>navigate(`/ReelSecond/${reel.userID}/${reel.id}`)}>
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Heart />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}> {reel.likes ? reel.likes.length : 0}</span>
                        </span>
                      </div>
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Chat />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>{reel.comment ? reel.comment.length : 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
                 
                 
                
            </div>
        
        </div>
        </>
    )
}