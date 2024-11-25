import Layout from './Layout'
import {LargeSave} from './ReelSvg'
import Loader from './Loader';
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Updated import
import { database, useFirebase } from "./Firebase"; 
import { Chat, Heart } from "./ReelSvg";
import { Reel } from './ReelSvg';
import { useNavigate } from 'react-router-dom';


export default function Save(){
  const navigate=useNavigate()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const firebase = useFirebase();
    const { user } = firebase;
    console.log("343",posts)
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const postsRef = collection(database, "users", user.uid, "savedPosts"); // Change to collection
          const querySnapshot = await getDocs(postsRef); // Use getDocs instead of getDoc
  
          const fetchedPosts = querySnapshot.docs.map(doc => ({
            id: doc.id, // Get the document ID
            ...doc.data() // Get the document data
          }));
  
          setPosts(fetchedPosts); // Update the posts state
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, [user]);
    return(
        <>
        
        <Layout>
<div className='px-md-5 w-100 pt-2 d-flex flex-column' style={{height:"100vh"}}>
<span style={{fontSize:"16px",fontWeight:"500",color:"#737373"}} className='mt-5 d-md-block d-none'>Saved</span>
{loading ? (
        <div className='w-100 h-100 DALJU'><Loader /></div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className='Post_Rell_section w-100 d-flex align-items-center justify-content-center flex-wrap bg-'>
            {posts.map((post, id) => (
              <div className='bg- col-3 position-relative' style={{ width: "33%", aspectRatio: "1",padding:"1px" }} key={post.id}>
                {post.type === "image" ? (
                  <div className="w-100 h-100">
                    <img src={post.postUrl} alt="Post" className="w-100 h-100" />
                  </div>
                ) : (
                  <div className="w-100 h-100 postion-relative">
                    <video src={post.postUrl} className="w-100 h-100" style={{ objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
                  </div>
                )}
                
                <div className="caption d-flex DALJU gap-3"  onClick={()=>navigate(`/HandleReelPost/${post.postOwnerId}/${post.postId}`)}>
                  <div className="DALJU">
                    <span className="text-white d-flex gap-1 DALJU">
                      <Heart />
                      <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.likes ? post.likes.length : 0}</span>
                    </span>
                  </div>
                  <div className="DALJU">
                    <span className="text-white d-flex gap-1 DALJU">
                      <Chat />
                      <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.comment ? post.comment.length : 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
            // <div className='Post_Rell_section w-100 d-flex  align-items-center justify-content-center flex-wrap h-100 mt-4'>
            //   {posts.map((post, id) => (
            //     <div className='bg- col-3 position-relative' style={{ width: "33%", aspectRatio: "1",padding:"1px"}} key={post.id}>
            //       {post.type === "image" ? (
            //         <div className="w-100 h-100">
            //           <img src={post.postUrl} alt="Post" className="w-100 h-100" />
            //         </div>
            //       ) : (
            //         <div className="w-100 h-100 postion-relative">
            //           <video src={post.postUrl} className="w-100 h-100" style={{ objectFit: "cover" }} />
            //           <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
            //         </div>
            //       )}
            //       <div className="caption d-flex DALJU gap-3" onClick={()=>navigate(`/HandleReelPost/${post.postOwnerId}/${post.postId}`)}>
            //         <div className="DALJU">
            //           <span className="text-white d-flex gap-1 DALJU">
            //             <Heart />
            //             <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.likes ? post.likes.length : 0}</span>
            //           </span>
            //         </div>
            //         <div className="DALJU">
            //           <span className="text-white d-flex gap-1 DALJU">
            //             <Chat />
            //             <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.comment ? post.comment.length : 0}</span>
            //           </span>
            //         </div>
            //       </div>
            //     </div>
            //   ))}
            // </div>
          ) : (
            <div className='w-100 DALJU flex-column text-center share_photo bg-' style={{ height: "100vh" }}>
              <LargeSave />
              <span style={{ fontSize: "30px", color: '#000000', fontWeight: "800" }}>Start Saving</span>
              <span style={{ fontSize: "14px", color: '#000000', fontWeight: "400" }}>Save photos and videos to your collection.</span>
              <div className='share_text cr'>Add to Collection</div>
            </div>
          )}
        </>
      )}
</div>
        </Layout>
        </>
    )
}