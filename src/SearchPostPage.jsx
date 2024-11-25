import { Reel } from './ReelSvg';
import Loader from './Loader';
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Updated import

import { database, useFirebase } from "./Firebase"; 
import { Chat, Heart } from "./ReelSvg";
import { Camera } from "./ReelSvg";
import { useNavigate } from 'react-router-dom';


export default function SearchPostPage({userIdd} ){
  const navigate=useNavigate();
  const [posts, setPosts] = useState([]); // Posts data ko store karne ke liye
  const [loading, setLoading] = useState(true); // Loading state to show loader
  const firebase = useFirebase();
  const { user } = firebase;

  
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
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <>
      {loading ? (
        <div className='w-100 h-100 DALJU'><Loader /></div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className='Post_Rell_section w-100 d-flex  align-items-center justify-content-center flex-wrap bg-'>
              {posts.map((post, id) => (
                <div className='bg- col-3 position-relative' style={{ width: "33%", aspectRatio: "1",padding:"1px" }} key={id}>
                  {post.type === "image" ? (
                    <div className="w-100 h-100">
                      <img src={post.url} alt="Post" className="w-100 h-100" />
                    </div>
                  ) : (
                    <div className="w-100 h-100 postion-relative">
                      <video src={post.url} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
                    </div>
                  )}
                  <div className="caption d-flex DALJU gap-3" onClick={()=>navigate(`/HandleReelPost/${userIdd}/${post.id}`)}>
                    <div className="DALJU">
                      <span className="text-white d-flex gap-1 DALJU">
                        <Heart />
                        <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.likes ? post.likes.length : 0}</span>
                      </span>
                    </div>
                    <div className="DALJU">
                      <span className="text-white d-flex gap-1 DALJU">
                        <Chat />
                        <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.Comment ? post.comment.length : 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // If no posts are available, show 'share photo' section
            <div className='w-100 DALJU flex-column text-center share_photo' style={{ height: "227px" }}>
              <Camera />
              <span style={{ fontSize: "30px", color: '#000000', fontWeight: "800" }}>No Post Yet</span>
             
            </div>
          )}
        </>
      )}
    </>
  );
}


