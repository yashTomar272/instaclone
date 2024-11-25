import profileimg from "./imgs/profile.jpg";

import Layout from './Layout'
import { useFirebase } from './Firebase';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Suggesion() {
  const navigate=useNavigate()
  const firebase = useFirebase();
  const { getAllUser, followUser, unfollowUser } = firebase;
  const [user, setUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);


  const [userr, setUserr] = useState(null);
useEffect(() => {
  const data = firebase.userdata;
  // console.log("hhhh", data);
  setUserr(data);
   
}, [firebase.userdata]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await firebase.userdata;
      setUser(data);

      // Get the logged-in user's following list
      const userFollowingList = data?.following || [];
      setFollowingList(userFollowingList);

      // Filter out the logged-in user and already followed users from the suggestion pool
      const filteredUsers = getAllUser.filter(u =>
        u.id !== data?.userId && !userFollowingList.includes(u.id)
      );

      // Shuffle the list of filtered users
      let shuffledUsers = filteredUsers.sort(() => 0.5 - Math.random());

      // Pick exactly 5 users or fewer if available
      let randomFiveUsers = shuffledUsers.slice(0, 5);
      setSuggestedUsers(randomFiveUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (firebase.userdata) {
    fetchData();
  }
}, [firebase.userdata]); // Adding firebase.userdata as a dependency



  
  // Follow/Unfollow handler
  const handleFollow = async (event, val) => {
    event.preventDefault(); // Prevent default action
    if (followingList.includes(val.id)) {
      // Unfollow the user
      await unfollowUser(user?.userId, val.id);  // Call unfollow function in Firebase
      setFollowingList(followingList.filter(fId => fId !== val.id));  // Update local state
    } else {
      // Follow the user
      await followUser(user?.userId, val.id);  // Call follow function in Firebase
      setFollowingList([...followingList, val.id]);  // Update local state
    }
  };


  return (
    <>
      <div className="Sugges_main h-100" style={{ position: "relative", top: "-10px", width: "390px", padding: "24px 80px 0px 24px" }}>
        <div className="Our_profie mt-3 d-flex align-items-center justify-content-between">
          <div className="d-flex gap-2">
            <div className="d-flex align-items-center" style={{ border: "1px solid #e8e3e3", width: "50px", height: "50px", borderRadius: "50%", cursor: "pointer" }}>
              <img src={userr?.proimg || profileimg} alt="img" style={{ border: "2px solid white", width: "100%", height: "100%", borderRadius: "50%" }} />
            </div>
            <div className="">
              <h6 className="text-dark mb-0">{userr?.username}</h6>
              <p style={{ color: "#737373", fontSize: "15px" }}>{userr?.fullname}</p>
            </div>
          </div>
          <h6 className="text-primary" style={{ fontSize: "12px", cursor: "pointer" }}>Switch</h6>
        </div>

        <div className="See_all d-flex mt-2 malign-items-center justify-content-between">
          <h6 style={{ color: "#737373", fontSize: "14px" }}>Suggested for you</h6>
          <h6 style={{ color: "black", fontSize: "13px", cursor: "pointer" }} onClick={() => navigate("/SeeAll")}>See All</h6>
        </div>

        {/* Suggested Users */}
        {suggestedUsers.map((val, index) => (
          <div className="mt-1 d-flex gap-2 flex-column" key={index}>
            <div className="Our_profie d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2">
                <img onClick={() => navigate(`/SearchProfile/${val.id}`)} src={val?.proimg} alt="img" style={{ cursor: "pointer", width: "43px", height: "43px", borderRadius: "50%" }} />
                <div className="">
                  <h6 className="text-dark mb-0">{val?.fullname}</h6>
                  <p style={{ color: "#737373", fontSize: "14px" }}>{val?.username}</p>
                </div>
              </div>
              <button onClick={(event) => handleFollow(event, val)} className="text-primary" style={{ fontSize: "12px", cursor: "pointer", border: "none", outline: "none", background: "none", fontWeight: "600" }}>
                {followingList.includes(val.id) ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        ))}

        <div className="Sugges_botom mt-4">
          <h6 style={{ color: "#dedede", fontSize: "12px" }}>About . Help . Press . API . Jobs . Privacy . Terms . Locations . language . Meta Verified</h6>
          <h6 className="mt-4" style={{ color: "#dedede", fontSize: "12px" }}>© 2024 INSTAGRAM FROM META</h6>
        </div>
      </div>
    </>
  );
}
