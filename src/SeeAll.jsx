import img1 from './imgs/profile.jpg'
import Layout from './Layout'
import { useFirebase } from './Firebase';
import { useState, useEffect } from 'react';

export default function SeeAll() {
  const firebase = useFirebase();
  const { getAllUser, followUser, unfollowUser } = firebase;
  const [user, setUser] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    // Check if user data is already fetched to avoid refetching
    if (user) return; 

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

        // Pick exactly 20 users or fewer if available
        let randomFiveUsers = shuffledUsers.slice(0, 20);
        setSuggestedUsers(randomFiveUsers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);  // Empty dependency array to fetch only once

  

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

    <Layout>
      <div className="w-100 d-flex justify-content-center scroll-container" style={{ height: "100vh", padding: "60px 0px" }}>
        <div style={{ width: "600px" }} >
          <div style={{ fontSize: "16px", fontWeight: "600", margin: "16px 12px", padding: "0px 12px" }} className='col'>Suggested</div>
          <div style={{ fontSize: "16px", fontWeight: "500", margin: "16px 12px", padding: "0px 12px" }} className='col text-danger'>Plese edit your profile first...</div>
          <div className='d-flex flex-column'>
            {suggestedUsers.map((val, id) => (
              <div style={{ height: "68px", padding: "8px 16px" }} className="w-100 d-flex align-items-center justify-content-between  " key={id}>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={val?.proimg} alt="pro_img" style={{ width: "44px", height: "44px", borderRadius: "50%" }} className='cr' />
                  <span className='d-flex flex-column cr '>
                    <span style={{ height: "18px", fontSize: "14px", fontWeight: "600" }}>{val?.username}</span>
                    <span style={{ height: "18px", fontSize: "14px", fontWeight: "400", color: "#737373" }}>{val?.fullname}</span>
                    <span style={{ height: "16px", fontSize: "12px", fontWeight: "400", color: "#737373" }}>Suggested for you</span>
                  </span>
                </div>

                {followingList.includes(val.id) ? (
                  <button
                    onClick={(event) => handleFollow(event, val)}  // Follow/Unfollow logic with event
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      background: "#dbdbdb",
                      height: "31px",
                      padding: "7px 16px",
                      border: "none"
                    }}
                    className="text-dark DALJU cr ">
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={(event) => handleFollow(event, val)}  // Follow/Unfollow logic with event
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      background: "#0095f6",
                      height: "31px",
                      padding: "7px 16px",
                      border: "none"
                    }}
                    className="text-white DALJU cr ">
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
