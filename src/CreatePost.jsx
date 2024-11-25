import { Video,Cross,Back,Copy,Smile,Location,Down,Collab } from "./MoreSvg"
import { BackArrow, Crop, Zoom, ManLogo,DownChevron,AddColloborator } from "./ReelSvg";
import { useState, useRef ,useEffect} from "react";
import { useFirebase } from "./Firebase"; // Firebase ka context
import { storage, database } from "./Firebase"; // Firebase storage aur Firestore ka import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Storage functions
import { doc, setDoc, getDoc,collection,addDoc } from "firebase/firestore"; // Firestore functions
import ProfileImg from './imgs/profile.jpg'
import allimg from './imgs/allimg.png'
import Loader from './Loader'
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const navigate=useNavigate();
    const [selectedFile, setSelectedFile] = useState(null); // Selected file
    const [fileType, setFileType] = useState(null); // 'image' ya 'video'
    const [description, setDescription] = useState(""); // Description field
    const [currentStep, setCurrentStep] = useState(1); // Current step track karne ke liye
    const [isUploading, setIsUploading] = useState(false); // Upload status
    const [loader,setLoader]=useState(false)
    const [userr, setUser] = useState(null);


const allimgg=allimg;
    const firebase = useFirebase();
    const { user } = firebase;

    // Ref to store the file URL, to avoid re-render issues
    const fileURL = useRef(null);

    // File change hone par
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileType(file.type.startsWith("image/") ? "image" : "video");
            // Save the file URL in the ref, to avoid reloading on re-renders
            fileURL.current = URL.createObjectURL(file);
            setCurrentStep(2); // Step 2 par jana
        }
    };

    // File input open karne ke liye
    const handlePickImg = () => {
        document.getElementById("fileInput").click();
    };

    // Next step ke liye
    const handleNextStep = () => {
        setCurrentStep(3);
    };
    const handleSecond=()=>{
        setCurrentStep(2)
    }
    const handleFirst=()=>{
        setCurrentStep(1)
    }
    // Share button click hone par file upload karna
    const handleShare = async () => {
        if (!selectedFile || !description) return;
        setCurrentStep(4);
        setIsUploading(true);
    
        try {
            const fileRef = ref(storage, `posts/${user.uid}/${selectedFile.name}`);
    
            // File upload करना
            const uploadTask = uploadBytesResumable(fileRef, selectedFile);
    
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Upload progress (optional)
                },
                (error) => {
                    console.error("Upload failed:", error);
                    setIsUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    
                    // Firestore में user के अंदर posts collection का document reference
                    const postsRef = collection(database, "users", user.uid, "posts");
    
                    const newPost = {
                        url: downloadURL,
                        description: description,
                        type: fileType, // 'image' या 'video'
                        likes: "0", // Likes null से initialize होंगे
                        comment: "0",
                    };
    
                    // नया document create करना और automatic unique ID generate करना
                    await addDoc(postsRef, newPost);
    
                    setIsUploading(false);
                    setLoader(true);
                    alert("Post shared successfully!");
                    
                }
            );
        } catch (error) {
            console.error("Error sharing post:", error);
            setIsUploading(false);
        }
    };
    useEffect(() => {
        const data = firebase.userdata;
        // console.log("hhhh", data);
        setUser(data);
      }, [firebase.userdata]);
      const {createpost,setCreatepost}=firebase;

    return (
        <>
            <div  className={`${createpost? "":"d-none"} w-100 bg- DALJU position-fixed `} style={{overflow:"hidden",zIndex:"2001", height: "100vh",background: "rgba(0,0,0,0.65)" }}>
                <div onClick={()=>setCreatepost(false)} style={{zIndex:"2001", position: "absolute", top: "15px", right: "15px", color: "white" }} className="d-md-block d-none cr">
                    <Cross />
  
                </div>

                {/* Step 1: File Selection */}
                {currentStep === 1 && (
                    <div style={{ width: "431px", height: "474px", borderRadius: "8px" }} className="d-flex align-items-center bg-white flex-column">
                        <div className="d-flex align-items-center justify-content-between w-100 px-2" style={{height:"42px"}}>
                            <div className="d-md-none d-block cr" onClick={()=>setCreatepost(false)}><Back/></div>
                            <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }} className="DALJU text-center w-100">
                            Create new post
                        </span>
                        <div></div>
                        </div>
                        <div style={{ background: "#e2e5e9", width: "100%", height: "1px" }}></div>
                        <div className="w-100 h-100 DALJU flex-column gap-2" style={{ padding: "24px" }}>
                            <Video />
                            <span  style={{ fontSize: "20px", fontWeight: "400", color: "#000000" }}>
                                Drag photo and videos here
                            </span>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={handlePickImg}
                                style={{
                                    border: "none",
                                    background: "#0095f6",
                                    borderRadius: "8px",
                                    padding: "7px 16px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "white",
                                }}
                            >
                                Select from computer
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Image/Video Preview and Next Button */}
                {currentStep === 2 && (
                    <div  style={{ maxWidth: "431px", height: "474px", borderRadius: "8px", position: "relative" }} className="d-flex align-items-center bg-white flex-column ">
                        <div className="d-flex justify-content-between w-100 px-2 align-items-center">
                            <div className="cr"  onClick={handleFirst}>
                                <Back />
                            </div>
                            <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }} className="DALJU">
                                Crop
                            </span>
                            <div
                                style={{ color: "#0095f6", fontSize: "14px", fontWeight: "600" }}
                                className="cr"
                                onClick={handleNextStep}
                            >
                                Next
                            </div>
                        </div>
                        <div style={{ background: "#e2e5e9", width: "100%", height: "1px" }}></div>
                        <div className="w-100 h-100 DALJU flex-column gap-2">
                            <div style={{height:"432px"}} className="w-100">
                                {fileType === "image" ? (
                                    <img
                                        src={fileURL.current} // Using ref to persist image URL
                                        alt="Selected"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderBottomLeftRadius: "8px",
                                            borderBottomRightRadius: "8px",
                                        }}
                                    />
                                ) : (
                                    <div style={{height:"432px"}} className="w-100">
                                    <video
                                   
                                    className="w-100 h-100 "
                                       
                                        autoPlay
                                        style={{
                                            objectFit: "cover",
                                            borderBottomLeftRadius: "8px",
                                            borderBottomRightRadius: "8px",
                                        }}
                                    > <source src={fileURL.current} type="video/mp4" /></video>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
<div style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(26,26,26,0.8)",position:"absolute",bottom:"15px",left:"15px"}} className="text-white DALJU cr" ><Crop/></div>
<div style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(26,26,26,0.8)",position:"absolute",bottom:"15px",left:"60px"}} className="text-white DALJU cr" ><Zoom/></div>
<div style={{width:"32px",height:"32px",borderRadius:"50%",background:"rgba(26,26,26,0.8)",position:"absolute",bottom:"15px",right:"15px"}} className="text-white DALJU cr" ><Copy/></div>
</div>
                    </div>
                )}

                {/* Step 3: Add Description and Share */}
                {currentStep === 3 && (
                    <div style={{ width: "771px", borderRadius: "8px", position: "relative",zIndex:"10001" }} className="Post_first w-xs-100  d-flex align-items-center bg-white flex-column">
                        <div className="d-flex justify-content-between w-100 px-3 align-items-center">
                            <div className="cr" onClick={handleSecond}>
                                <Back />
                            </div>
                            <span style={{ height: "42px", fontSize: "16px", fontWeight: "600" }} className="DALJU">
                                Create new post
                            </span>
                            <div
                                style={{ color: "#0095f6", fontSize: "14px", fontWeight: "600" }}
                                className="cr"
                                onClick={handleShare}
                            >
                                Share
                            </div>
                        </div>
                       

                        <div style={{ background: "#e2e5e9", width: "100%", height: "1px" }}></div>


                        
                        <div className="w-100 h-100 Post_Post " >
                            {/* Display selected image/video here */}
                                {fileType === "image" ? (
                             <div  className="DALJU w-100 w-xs-50 post_img_vid" >

                                    <img
                                        src={fileURL.current} // Persist the image URL
                                        alt="Selected"
                                        style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderBottomLeftRadius: "8px"
                                        }}
                                    />
                                    </div>
                                
                                ) : (
                                    <div   className="w-100 w-xs-50 post_img_vid">
                                        <video
                                            src={fileURL.current} // Persist the video URL
                                            
                                            style={{
                                               
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderBottomLeftRadius: "8px"
                                                
                                            }}
                                        />
                                    </div>
                                )}
                            
                            <div className="bg- scroll-container d-flex flex-column p-0 w-100 w-xs-50 post_caption" >
     
     <div style={{height:"60px",margin:"0px 16px"}} className="d-flex w-100 align-items-center gap-2 bg-">
  <img src={userr?.proimg} alt="Pro_img" style={{width:"28px",aspectRatio:"1",borderRadius:"50%"}}/>
  <span style={{fontSize:"14px",fontWeight:"600"}}>{userr?.username}</span>
</div>
<div s className="post_textarea">
<textarea
        placeholder="Write a caption..."
        value={description}
        maxLength={2200}
        onChange={(e) => setDescription(e.target.value)}
        className="w-100 h-100 "
        style={{border:"none",outline:"none"}}
      />
</div>
     
<div className="d-flex align-items-center justify-content-between" style={{height:"44px",padding:"0px 16px"}}>
  <Smile/>
  <span style={{color:"#c7c7c7",fontS:"12px",fontWeight:"400"}}>10/1000</span>
</div>
<hr className="m-0"></hr>
<div style={{height:"45px",padding:"0px 16px"}} className="w-100 d-flex align-items-center justify-content-between">
<span style={{fontSize:"16px",fontWeight:"400",color:"#737373"}}>Add Location</span>
<Location/>
</div>
<div style={{height:"44px",padding:"0px 16px"}} className="w-100 d-flex align-items-center justify-content-between">
<span style={{fontSize:"16px",fontWeight:"400",color:"#737373"}}>Add Collaboration</span>
<Collab/>
</div>
<div style={{height:"44px",padding:"14px 16px"}} className="w-100 d-flex align-items-center justify-content-between">
<span style={{fontSize:"16px",fontWeight:"400",color:"#000000"}}>Accessibility</span>
<Down/>
</div>
<div style={{height:"44px",padding:"14px 16px"}} className="w-100 d-flex align-items-center justify-content-between">
<span style={{fontSize:"16px",fontWeight:"400",color:"#000000"}}>Advanced Settings</span>
<Down/>
</div>
<hr></hr>

    </div>
                        </div>





                    </div>
                )}
{currentStep === 4 && (
    <div style={{width:"431px",height:"474px",borderRadius:"8px",position:"relative"}} className="d-flex align-items-center bg-white flex-column">
    <div style={{width:"431px",height:"474px",borderRadius:"8px"}} className="d-flex align-items-center bg-white flex-column" >
<span style={{height:"42px",fontSize:"16px",fontWeight:"600"}} className=" DALJU p-3">Post shared</span>
<div style={{background:"#e2e5e9",width:"100%",height:"1px"}}></div>
<div className="w-100 h-100 DALJU flex-row gap-2" style={{padding:"24px"}}>
   {loader?<><div className="d-flex DALJU flex-column gap-2">
    <span style={{backgroundRepeat: "no-repeat", backgroundPosition: "-244px 0px", height: "98px", width: "98px",backgroundImage:`url(${allimg})` }}></span>
   <span style={{fontSize:"20px",fontWeight:"400",color:"#000000"}}>Reel has been shared </span>
   </div></> 
   :<><Loader/></>}
    

</div>
</div>
</div>
)}



                
            </div>
        </>
    );
}
