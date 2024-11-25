


import { Reel } from './ReelSvg';
import Loader from './Loader';
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Updated import
import { database, useFirebase } from "./Firebase"; 
import { Chat, Heart } from "./ReelSvg";
import { Camera } from "./ReelSvg";

export default function PostPage() {
  const [posts, setPosts] = useState([]); // Posts data ko store karne ke liye
  const [loading, setLoading] = useState(true); // Loading state to show loader
  const firebase = useFirebase();
  const { user } = firebase;

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
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);


  
  return (
    <>
      {loading ? (
        // Show loader when posts are being fetched
        <div className='w-100 h-100 DALJU'><Loader /></div>
      ) : (
        // Once loading is done, check if posts are available
        <>
          {posts.length > 0 ? (
            
            <div className='Post_Rell_section w-100 d-flex align-items-center justify-content-center flex-wrap bg-'>
               {
            posts
              .filter(post => post.type === "video") // Only filter out video posts
              .map((post, id) => {
                return (
                  <div className='bg- position-relative' style={{ width: "33%", aspectRatio: "1", padding:"1px" }} key={id}>
                    <div className="w-100 h-100 postion-relative">
                      <video src={post.url} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: "10px", right: "10px", color: "white" }}><Reel /></span>
                    </div>
                    <div className="caption d-flex DALJU gap-3">
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Heart />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.like ? post.like.length : 0}</span>
                        </span>
                      </div>
                      <div className=" DALJU">
                        <span className="text-white d-flex gap-1 DALJU">
                          <Chat />
                          <span style={{ fontSize: "14px", fontWeight: "600" }}> {post.comment ? post.comment.length : 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
          }
            </div>
          ) : (
            // If no posts are available, show 'share photo' section
            <div className='w-100 DALJU flex-column text-center share_photo' style={{ height: "227px" }}>
              <Camera />
              <span style={{ fontSize: "30px", color: '#000000', fontWeight: "800" }}>Share photos</span>
              <span style={{ fontSize: "14px", color: '#000000', fontWeight: "400" }}>When you share photos, they will appear on your profile.</span>
              <div className='share_text'>Share your first photo</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
