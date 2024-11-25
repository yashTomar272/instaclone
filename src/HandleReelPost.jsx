import boy from './imgs/boy.jpg'; // Fallback image
import { Smiles, Dot, Like, Comment, Send, Savee, Red, Playing, Muted, Saved } from './MoreSvg';
import { database } from './Firebase';
import { useFirebase } from './Firebase';
import { Left  } from './MoreSvg';

import { addDoc, collection, doc, getDoc, updateDoc, getDocs, deleteDoc,setDoc } from 'firebase/firestore';
import React, { useRef, useEffect, useState } from "react";
import useIntersectionObserver from "./useIntersectionObserver";
import { useNavigate, useParams } from 'react-router-dom';
import Layout from "./Layout";

export default function HandleReelPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const firebase = useFirebase();

    const { user } = firebase;
    const [vol, setVol] = useState(false);
    const [userData, setUserData] = useState(null); 
    const [savedPosts, setSavedPosts] = useState({}); // Object to track saved state for each post
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
        const fetchUserData = async () => {
            try {
                const userRef = doc(database, 'users', id);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    setUserData(userSnapshot.data());
                } else {
                    console.error('No such user!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id]); 
    
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

                setPosts(prevPosts => 
                    prevPosts.map(p => 
                        p.id === postId ? { ...p, likes: newLikes } : p
                    )
                );
            } else {
                console.error('Post not found in Firestore.');
            }
        } catch (error) {
            console.error('Error liking/unliking post:", error');
        }
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRef = collection(database, "users", id, "posts");
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

    return (
        <Layout>
            <div className="w-100 h-100 d-flex align-items-center flex-column bg-">
            <div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",zIndex:"10002"}} className=' bg-white text-center position-fixed w-100 d-flex align-items-center justify-content-between '>
<div style={{ transform: "rotate(270deg)"}}  onClick={() => 
  navigate(-1)} className="cr d-md-none d-block"><Left/></div>
           
           <div style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}} className='text-center w-100 DALJU '>Posts</div>
             
            <div className='d-md-none d-block'></div>
          </div>
                <div className="DALJU flex-column Main_main ">
              
                    <div className="Post_Secssion mt-5" style={{ maxWidth: '468px' }}>
                        {posts.map((post) => {
                            const isLiked = post.likes && post.likes.includes(user?.uid);
                            const isSaved = savedPosts[post.id] || false; // Check saved state from savedPosts object
    
                            return (
                                <div key={post.id}>
                                    <div className="w-100 bg- d-flex align-items-center justify-content-between" style={{ padding: '0px 0px 0px 4px', height: '48px' }}>
                                        <div className="DALJU h-100 gap-1 cr">
                                            <div style={{ width: '42px', height: '42px', borderRadius: '50%' }} className="DALJU">
                                                <img src={userData.proimg} className="proimg" alt="img" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
                                            </div>
                                            <span className="d-flex flex-column">
                                                <span className="DALJU h-100 gap-1">
                                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{userData.username}</span>
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

                                    {post.type === 'image' ? (
                                                          <div className="DALJU bg-dark Main_video">
                                            <img src={post.url} className="h-100 w-100" style={{ objectFit: 'cover' }} />
                                        </div>
                                    ) : (
                                        <div className="Main_video DALJU bg-dark position-relative">
                                            <VideoComponent src={post.url} vol={vol} setVol={setVol} />
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
                                    )}

        <div className="w-100 bg- d-flex align-items-center justify-content-between py-1" style={{ padding: '0px 12px 6px' }}>
                                        <div className="DALJU gap-4">
                                            <div onClick={() => handleLike(post.id, id)}>
                                                {isLiked ? <div style={{ color: "red" }} className='cr'><Red /></div> : <div className='cr'><Like /></div>}
                                            </div>
                                            <span className=" cr"><Comment /></span>
                                            <span className=" cr"><Send /></span>
                                        </div>
                                        <span className="cr" onClick={() => handleSave(post.id, id, post.url, post.likes, post.comments)}>
    {isSaved ? <div className='cr'> <Saved /></div> :<div className='cr'> <Savee /></div>}
</span>
</div>
  
  <div style={{ margin: '0 4px', fontSize: '14px', fontWeight: '600' }} className='px-2'>{post.likes ? post.likes.length : 0} likes</div>
                    <div className="d-flex gap-2 px-3" style={{ marginTop: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Tomar___ji_</span>
                        <span style={{ fontSize: '14px', fontWeight: '400', color: '#000000' }}>{post.description}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#737373', marginTop: '8px' }} className='px-3'>View all 287 comments</span>
                    <div className="Teaxt_area d-flex px-3 " style={{ marginTop: '8px' }}>
                        <textarea placeholder="Add a comment..." style={{ width: '451px', maxHeight: '80px', border: 'none', outline: 'none', resize: 'none' }}></textarea>
                        <Smiles />
                    </div>
                    <hr className='m-0 p-0'></hr>
</div>
)
})}
</div>

</div>
</div>
</Layout>
);
}



const VideoComponent = ({ src, vol, setVol }) => {
const videoRef = useRef(null);
const [videoContainerRef, isIntersecting] = useIntersectionObserver({
threshold: 0.5,
});
const [showWatchAgain, setShowWatchAgain] = useState(false); // Watch Again button state

// Video ko play/pause karna jab wo viewport mein ho
useEffect(() => {
const video = videoRef.current;
if (isIntersecting && !showWatchAgain) {
video.play().catch((error) => {
console.error("Play failed", error);
});
} else {
video.pause();
}
}, [isIntersecting, showWatchAgain]);

// Jab video khatam ho jaye to "Watch Again" button show karna
const handleVideoEnd = () => {
setShowWatchAgain(true); // Video end hone ke baad button dikhana
};

// Watch Again button click par video ko reset karke dubara se play karna
const handleWatchAgain = async () => {
const video = videoRef.current;

// Video ko manually pause karte hain
video.pause();
// Video ko reset karte hain start position par
video.currentTime = 0;

// Thoda delay de kar video ko dobara play karte hain
setTimeout(() => {
video.play().then(() => {
setShowWatchAgain(false); // Watch Again button hide karna
}).catch((error) => {
console.error("Play failed", error);
});
}, 200); // 200ms ka delay to ensure video is properly paused
};

return (
<div ref={videoContainerRef} className="h-100 w-100 position-relative" style={{ objectFit: 'cover' }}>
<video
className="h-100 w-100"
style={{ objectFit: 'cover' }}
ref={videoRef}
src={src}
controls={false}
onEnded={handleVideoEnd} // Jab video khatam ho jaye
{...(vol ? {} : { muted: true })}
/>

{/* Jab video khatam ho jaye to "Watch Again" button dikhana */}
{showWatchAgain && (
<button
onClick={handleWatchAgain}
style={{
position: "absolute",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
backgroundColor: "rgba(0, 0, 0, 0.7)",
color: "white",
border: "none",
padding: "10px 20px",
borderRadius: "5px",
cursor: "pointer",
}}
>
Watch Again
</button>
)}
</div>
);
};
