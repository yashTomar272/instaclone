// import React, { useEffect, useState } from "react";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { database, storage } from "./Firebase";
// import { useContext } from "react";
// import { DataContext } from "./Context/DataContext";
// import Carousel from 'react-bootstrap/Carousel';
// import ProfileImg from './imgs/profile.jpg';
// import { Video, Back } from "./MoreSvg";

// function CreatePost() {
//   const [show, setShow] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [mediaType, setMediaType] = useState("");
//   const { setHandleCreatePostCloseButton, handleCreatePostCloseButton, user } = useContext(DataContext);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [postText, setPostText] = useState("");
//   const [videoFile, setVideoFile] = useState(null);
//   const [userId, setUserId] = useState();

//   useEffect(() => {
//     if (user && user.userId) {
//       setUserId(user.userId);
//     }
//   }, [user]);

//   const uploadVideoToFirebase = async () => {
//     if (!videoFile || !userId) {
//       console.error("Missing video file or user ID.");
//       return;
//     }

//     try {
//       setActiveIndex(2);
//       const storageRef = ref(storage, `videos/${userId}_${videoFile.name}`);
//       await uploadBytes(storageRef, videoFile);
//       const downloadURL = await getDownloadURL(storageRef);
//       const fileType = videoFile.type;

//       const userRef = doc(database, "users", userId);
//       const userDoc = await getDoc(userRef);

//       if (!userDoc.exists()) {
//         console.error("User does not exist!");
//         return;
//       }

//       const existingVideos = userDoc.data().videos || [];
//       const newVideo = {
//         src: downloadURL,
//         type: fileType,
//         desc: postText,
//       };

//       await updateDoc(userRef, {
//         videos: [...existingVideos, newVideo],
//       });

//       console.log("Video uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading video or updating Firestore:", error);
//     }
//   };

//   useEffect(() => {
//     setShow(handleCreatePostCloseButton);
//   }, [handleCreatePostCloseButton]);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setVideoFile(file);

//     if (file) {
//       const reader = new FileReader();
//       if (file.type.startsWith("image/")) {
//         setMediaType("image");
//       } else if (file.type.startsWith("video/")) {
//         setMediaType("video");
//       } else {
//         alert("Please upload an image or a video.");
//         return;
//       }

//       reader.onloadend = () => {
//         setSelectedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const pauseAllVideos = () => {
//     const videos = document.querySelectorAll("video");
//     videos.forEach((video) => video.pause());
//   };

//   const inputClicked = () => {
//     document.getElementById("file-upload").click();
//   };

//   return (
//     <div style={{ ...styles.overlay, zIndex: "2001" }} className={`${show ? "" : "d-none"}`}>
//       <button
//         style={styles.closeButton}
//         onClick={() => {
//           setHandleCreatePostCloseButton(false);
//           setSelectedImage(null);
//           setActiveIndex(0);
//         }}
//       >
//         &times;
//       </button>
//       <Carousel slide={false} interval={null} activeIndex={activeIndex} className="bg-white">
//         <Carousel.Item>
//           <div style={{ width: "431px", height: "474px", borderRadius: "8px", position: "relative" }} className="d-flex align-items-center bg-white flex-column">
//             {selectedImage ? (
//               <div className="w-100 h-100">
//                 <div className="d-flex justify-content-between w-100 px-2 align-items-center">
//                   <div className="cr" onClick={() => setSelectedImage(null)}> <Back /></div>
//                   <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }}>Crop</span>
//                   <div style={{ color: "#0095f6", fontSize: "14px", fontWeight: "600" }} className="cr" onClick={() => { setActiveIndex(1); pauseAllVideos(); }}>Next</div>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }}>Create new post</span>
//               </div>
//             )}

//             {!selectedImage && (
//               <div className="w-100 h-100">
//                 <div style={{ background: "#e2e5e9", width: "100%", height: "1px" }}></div>
//                 <div className="w-100 h-100 flex-column gap-2" style={{ padding: "24px" }}>
//                   <Video />
//                   <span style={{ fontSize: "20px", fontWeight: "400", color: "#000000" }}>Drag photo and videos here</span>
//                   <div className="pb-4" style={styles.buttonContainer}>
//                     <button
//                       onClick={inputClicked}
//                       style={{
//                         border: "none",
//                         background: "#0095f6",
//                         borderRadius: "8px",
//                         padding: "7px 16px",
//                         fontSize: "14px",
//                         fontWeight: "600",
//                         color: "white",
//                       }}
//                     >
//                       Select from computer
//                     </button>

//                     <input
//                       type="file"
//                       id="file-upload"
//                       onChange={handleFileChange}
//                       style={{ display: "none" }}
//                       accept="image/*,video/*"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//             {selectedImage && mediaType === "image" && (
//               <div className="h-100 w-100">
//                 <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', height: '100%', objectFit: "cover", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} />
//               </div>
//             )}
//             {selectedImage && mediaType === "video" && (
//               <video className="w-100 h-100" loop autoPlay style={{ objectFit: "cover" }}>
//                 <source src={selectedImage} type="video/mp4" />
//               </video>
//             )}
//           </div>
//         </Carousel.Item>

//         <Carousel.Item>
//           <div style={{ width: "771px", height: "474px", borderRadius: "8px", position: "relative" }} className="d-flex align-items-center flex-column">
//             <div className="d-flex justify-content-between w-100 px-3 align-items-center">
//               <div className="cr"> <Back /></div>
//               <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }}>Create new post</span>
//               <div style={{ color: "#0095f6", fontSize: "14px", fontWeight: "600" }} className="cr" onClick={uploadVideoToFirebase}>Share</div>
//             </div>
//             <div style={{ background: "#e2e5e9", width: "100%", height: "1px" }}></div>
//             <div className="w-100 h-100">
//               {selectedImage && mediaType === "image" && (
//                 <div style={{ width: "431px", height: "431px" }}>
//                   <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', height: '100%', objectFit: "cover", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} />
//                 </div>
//               )}
//               {selectedImage && mediaType === "video" && (
//                 <div style={{ width: "431px", height: "431px" }}>
//                   <video className="w-100 h-100" loop autoPlay style={{ objectFit: "cover" }}>
//                     <source src={selectedImage} type="video/mp4" />
//                   </video>
//                 </div>
//               )}
//               <div className="w-100" style={{ marginTop: "1rem" }}>
//                 <div className="d-flex align-items-start justify-content-center gap-2">
//                   <img src={ProfileImg} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
//                   <textarea
//                     value={postText}
//                     onChange={(e) => setPostText(e.target.value)}
//                     style={{ width: "100%", height: "60px", resize: "none" }}
//                     placeholder="Write a caption..."
//                   ></textarea>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Carousel.Item>

//         <Carousel.Item>
//           <div className="w-100 h-100"> {/* Placeholder for uploading status */}</div>
//         </Carousel.Item>
//       </Carousel>
//     </div>
//   );
// }

// const styles = {
//   overlay: {
//     position: "fixed",
//     width: "100vw",
//     height: "100vh",
//     top: 0,
//     left: 0,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   closeButton: {
//     position: "absolute",
//     right: "10px",
//     top: "10px",
//     fontSize: "30px",
//     color: "#fff",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//   },
//   buttonContainer: {
//     display: "flex",
//     justifyContent: "center",
//   },
// };

// export default CreatePost;
