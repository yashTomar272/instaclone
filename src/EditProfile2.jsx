// import img1 from './imgs/profile.jpg'
import { useFirebase } from "./Firebase";
// import profileImg from './Imgs/profile.jpg'
import {deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { database, storage } from "./Firebase";
// import EditProLayout from "./Layout/EditProLayout";
import { TailSpin} from "react-loader-spinner";
import Button from 'react-bootstrap/Button';
export default function EditProfile2() {
  const firebase = useFirebase();
  const [data, setdata] = useState(null);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState("");
  const [profile, setProfile] = useState(null);
  // const userId= data.userId || firebase.userId;
const [showLoading,setshowLoading]= useState(false)
  // Function to update user data in Firebase
  const updateUserData = async (e) => {
    setshowLoading(true)
    e.preventDefault()
    const userId = data.userId; // Ensure userId is available
    const oldImageUrl = data.proimg; // Old image URL from the database
    

   if(profile){ try {
      console.log("hello",oldImageUrl)
      
      console.log("hello",profile)
      if (!userId) {
        throw new Error("User ID is missing.");
      }
  
      // Step 1: Upload the new image
      const storageRef = ref(
        storage,
        `profileImages/${userId}_${profile.name}`
      );
  
      await uploadBytes(storageRef, profile);
      const newDownloadURL = await getDownloadURL(storageRef);
   setProfile(newDownloadURL||oldImageUrl)
      // Step 2: Update the user's profile with the new image URL
     
  
      // Step 3: Delete the old image, if it exists
      if (oldImageUrl) {
        const oldImagePath = oldImageUrl
          .split("?")[0] // Extract path from the URL
          .replace("https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT_ID/o/", "")
          .replace("%2F", "/"); // Convert encoded URL to actual path
        
        await deleteOldProfileImage(oldImagePath);
      }
      const userRef = doc(database, "users", userId);
      const updatedData = {
        bio,
        gender,
        proimg: newDownloadURL,
      };
      console.log("User data updated:", updatedData);
            await updateDoc(userRef, updatedData);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user data:", error);
      setshowLoading(false);
    }
}
if(!profile){
  setshowLoading(true)
  try {
       const userRef = doc(database, "users", userId);
    const updatedData = {
      bio,
      gender,
      // proimg: newDownloadURL,
    };
    await updateDoc(userRef, updatedData);
    window.location.reload();
  } catch (error) {
    console.error("Error updating user data:", error);
    setshowLoading(false);
  }
}
};
  const deleteOldProfileImage = async (oldImagePath) => {
    if (!oldImagePath) return; // Exit if no image path is provided
    
    const oldImageRef = ref(storage, oldImagePath);
  
    try {
      await deleteObject(oldImageRef);
      console.log("Old profile image deleted successfully.");
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.warn("Image not found. It may have already been deleted.");
      } else {
        console.error("Error deleting old image:", error);
      }
    }
  };
  
  useEffect(() => {
    const getdata = async () => {
      const userdatas = await firebase.userdata;
      console.log(userdatas);
      setdata(userdatas);
    };
    getdata();
  }, [firebase]);
  const handleFileChange = (e) => {

    if (e.target.files[0]) {
      setProfile(e.target.files[0]);

    }
  };
  useEffect(() => {
    if (data) { // Check if data is available
      console.log("User data:", data);
      setBio(data.bio || ""); // Set bio from data, default to empty string if undefined
      setGender(data.gender || "");
      // setProfile(profileImg) // Set gender from data, default to empty string if undefined
    }
  }, [data]);
  const handleButtonClick = () => {
    document.getElementById('fileInput').click(); // Programmatically click the hidden input
  };
  return (
    <>
      {/* <EditProLayout> */}
        {/* {showLoading &&(<div className="position-absolute w-100 d-flex align-items-center justify-content-center " style={{height:"100%", zIndex:"20",background:"#00000000"}}> 
          <div className=" d-flex align-items-center justify-content-center " style={{height:"150px",width:"150px", backgroundColor:"#1f212261"}}>(<TailSpin
  visible={true}
  height="80"
  width="80"
  color="#2f3031"
  ariaLabel="tail-spin-loading"
  radius="1" 
  wrapperStyle={{}}
  wrapperClass=""
  /></div></div>)} */}
        <form action="" className="position-relative" onSubmit={updateUserData}>
          <div className="position-relative" style={{ padding: "0px 65px" }}>
            <div className=" mb-4" style={{ padding: "12px 0px" }}>
              {" "}
              <h2
                style={{ fontSize: "20px", fontWeight: "700" }}
                className="m-0"
              >
                Edit Profile
              </h2>
            </div>

            <div
              style={{
                height: "88px",
                padding: "16px",
                borderRadius: "20px",
                background: "#efefef",
              }}
              className="w-100 my-3 d-flex justify-content-between align-items-center"
            >
              {data ? (
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={  data?.proimg }
                    style={{
                      width: "56px",
                      aspectRatio: "1",
                      borderRadius: "50%",
                    }}
                    alt="pro_img"
                    className="cr b"
                  />
                  <span className="d-flex flex-column ">
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      {data.fullname}
                    </span>
                    <span
                      style={{
                        color: "#737373",
                        fontWeigh: "400",
                        fontSize: "14px",
                      }}
                    >
                      {data.username}
                    </span>
                  </span>
                </div>
              ):"Loading image..."}
              
               <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the default input
      />

      {/* Custom button for file input */}
      
         <Button onClick={handleButtonClick} variant="primary">Change Photo</Button>
      
            </div>

            <div className="mb-3 ">
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  padding: "16px 0px",
                }}
                className=""
              >
                Website
              </div>
              <div className="w-100">
                {" "}
                <div
                  style={{
                    cursor: "not-allowed",
                    height: "42px",
                    border: "1px solid rgb(219,219,219)",
                    borderRadius: "12px",
                    padding: "10px 16px",
                    background: "#efefef",
                    fontSize: "16px",
                    fontWeight: "400",
                    color: "#737373",
                  }}
                  className="w-100"
                >
                  Website
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#737373",
                    fontWeight: "400",
                  }}
                  className="py-0"
                >
                  Editing your links is only available on mobile. Visit the
                  Instagram app and edit your profile to change the websites in
                  your bio.
                </span>
              </div>
            </div>

            {data? (
              <div className="mb-3">
                <div
                  style={{ fontSize: "16px", fontWeight: "700" }}
                  className="py-3"
                >
                  Bio{" "}
                </div>
                <textarea
                  style={{
                    width: "62px",
                    background: "white",
                    fontSize: "16px",
                    padding: "10px 80px 10px 16px",
                    borderRadius: "12px",
                    border: "1px solid rgba(219,223,228)",
                    fontWeight: "400",
                    textWrap: "wrap",
                    outline: "none",
                  }}
                  className="w-100"
                  value={bio} // Set value from state
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
            ):"Loading data..."}

            <div className="mb-3">
              <div
                style={{ fontSize: "16px", fontWeight: "700" }}
                className="py-3"
              >
                Gender
              </div>
              <div
                style={{
                  width: "154px",
                  padding: "16px",
                  border: "1px solid rgba(219,223,228)",
                  borderRadius: "12px",
                }}
                className="w-100"
              >
                {data ? (
                  <select
                  style={{ outline: "none", border: "none" }}
                  value={gender} // Ensure this is correctly set
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>Select Gender</option> {/* Default disabled option */}
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                
                ):"Loading..."}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#737373",
                  fontWeight: "400",
                }}
              >
                his won't be the part of your main profile
              </span>
              <div className="mb-3">
                <div
                  className="py-3"
                  style={{ fontSize: "16px", fontWeight: "700" }}
                >
                  Show account suggestion on profiles
                </div>

                <div
                  style={{
                    width: "154px",
                    padding: "16px",
                    border: "1px solid rgba(219,223,228)",
                    borderRadius: "12px",
                  }}
                  className="w-100"
                >
                  <div>Show account suggestions on profiles</div>
                  <div className="d-flex align-items-center justify-content-around">
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#737373",
                        fontWeight: "400",
                      }}
                      className="py-0"
                    >
                      Choose whether people can see similar account suggestions
                      on your profile, and whether your account can be suggested
                      on other profiles.
                    </div>
                    <div>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
              <div type="submit" className="d-flex justify-content-end">
              <Button variant="primary" type="submit" style={{width:"120px"}}>Submit</Button>
              </div>
            </div>
          </div>
        </form>
        <div className="w-100 mt-5 d-flex flex-column align-items-center justify-content-center flex-column">
          <div
            className="fotter_data  d-flex align-items-center gap-4 justify-content-center"
            style={{ maxWidth: "1066px", flexWrap: "wrap" }}
          >
            <a style={{ color: "#737373", fontSize: "12px" }}>Meta</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>About</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Blog</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Jobs</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Help</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Api</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Privacy</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Term</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Locations</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Instagram Lite</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Threads</a>
            <a style={{ color: "#737373", fontSize: "12px" }}>
              Contact uploading and non-users
            </a>
            <a style={{ color: "#737373", fontSize: "12px" }}>Meta Verified</a>
          </div>
          <div
            className="fotter_data col mt-3  d-flex align-items-center gap-4 justify-content-center"
            style={{
              maxWidth: "1066px",
              color: "#737373",
              fontSize: "13px",
              marginBottom: "60px",
            }}
          >
            <span>English (UK)</span>
            <span>© 2024 Instagram from Meta</span>
          </div>
        </div>
      
    </>
  );
}
