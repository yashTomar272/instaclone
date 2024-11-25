import { IoIosArrowBack } from "react-icons/io";
import { LuUserCheck } from "react-icons/lu";
import { PiTextAaBold } from "react-icons/pi";
import { FaRegStickyNote } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Cross} from "./MoreSvg"
import prof from './imgs/profile.jpg'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef ,useEffect} from "react";
import { useFirebase } from "./Firebase"; // Firebase ka context
import { storage, database } from "./Firebase"; // Firebase storage aur Firestore ka import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Storage functions
import { collection,addDoc } from "firebase/firestore"; // Firestore functions
import Loader from './Loader'

export default function CreateStory(){
    const navigate=useNavigate();
const firebase=useFirebase();
const [userr, setUser] = useState(null);
const [isUploading, setIsUploading] = useState(false); // Upload status
const [loader,setLoader]=useState(false)

const { user } = firebase;

const {CreateStory,setCreateStory}=firebase;
const location = useLocation();
  const { file, fileURL, fileType } = location.state || {}; // Accessing the passed data
  
  
  
  

  // Share button click hone par file upload karna
  const handleShare = async () => {
    console.log("yash")
    if (!file ) return;
  
    setIsUploading(true);

    try {
        const fileRef = ref(storage, `Story/${user.uid}/${file.name}`);

        // File upload करना
        const uploadTask = uploadBytesResumable(fileRef, file);

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
                const postsRef = collection(database, "users", user.uid, "Story");

                const newPost = {
                    url: downloadURL,
                   
                    type: fileType, // 'image' या 'video'
                    likes: "0", // Likes null से initialize होंगे
                   
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

    return(
        <>
      <div className="ZZZZ w-100 DALJU p-sm-3 position-relative" style={{background: "rgba(0,0,0,0.65)"}}>

<div  style={{zIndex:"2001", position: "absolute", top: "15px", right: "15px", color: "white" }} className="cr d-md-block d-none"  onClick={() => navigate(-1)}>
            <Cross />
        </div>
<div  className="Create_main h-100 position-relative DALJU">
<div className="w-100 bg- m-0 d-flex  flex-column position-relative h-100" style={{borderRadius:"10px"}}>

<div className=" d-flex justify-content-between align-items-center bg- p-3  w-100"   style={{zIndex:"2005",position:"absolute",top:"0px"}} >
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"  onClick={() => navigate(-1)}><IoIosArrowBack/></div>
<div className="d-flex gap-2">
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><LuUserCheck/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><PiTextAaBold/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><FaRegStickyNote/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><BsStars/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><IoMusicalNotesOutline/></div>   
<div style={{height:"35px",width:"35px",borderRadius:"50%",background: "rgba(0,0,0,0.65)"}} className="DALJU text-white cr  fs-5"><BsThreeDots/></div>   
</div>
</div>

{isUploading && <div className="text-center w-100 position-absolute DALJU" style={{top:"50%",zIndex:"2009"}}><Loader/></div>}
{fileType === "image" ? (
                                    <img
                                        src={fileURL.current} // Using ref to persist image URL
                                        alt="Selected"
                                        style={{
                                             width: "100%",
                                             height: "89%",
                                            objectFit: "cover",
                                           position:"absolute"
                                        }}
                                    />
                                ) : (
                                    <div  className=" w-100" style={{ height: "89%"}}>
                                    <video
                                   
                                    className="w-100 h-100 "
                                       
                                        autoPlay
                                        style={{
                                            objectFit: "cover",
                                            
                                        }}
                                    > <source src={fileURL.current} type="video/mp4" /></video>
                                    </div>
                                )}

</div>
<div className="bg-dark w-100 position-absolute py-4 px-2 d-flex justify-content-between align-items-center" style={{bottom:"0px",right:"0px",height:"85px"}}>
<div className="py-2 px-3 gap-2 text-white DALJU cr" style={{borderRadius:"20px",background: "rgba(0,0,0,0.65)"}}>
<div tyle={{height:"23px",width:"23px",borderRadius:"50%",border:"1px solid white"}}><img src={userr?.proimg} style={{height:"23px",width:"23px",borderRadius:"50%"}}/></div>
<span style={{fontSize:"12px",fontWeight:"500"}}>Your stories</span>
</div>
<div className="py-2 px-3 gap-2 text-white DALJU cr" style={{borderRadius:"20px",background: "rgba(0,0,0,0.65)"}}>
<div style={{height:"23px",width:"23px",borderRadius:"50%",border:"1px solid white",background:"green"}} className="DALJU p-1"><FaStar/></div>
<span style={{fontSize:"12px",fontWeight:"500"}}>Close Friends</span>
</div>
<div style={{height:"40px",width:"40px",borderRadius:"50%"}} className="bg-white DALJU fs-5 cr" onClick={handleShare}><IoIosArrowForward/></div>
</div>
</div>
        </div>
        </>
    )
}