import React, { useEffect, useState } from 'react';
import { useFirebase } from './Firebase';
import img from './imgs/profile.jpg';
import { Cross } from './MoreSvg';
import { getDoc, doc } from 'firebase/firestore';
import { database } from "./Firebase"; // Import your Firebase config
import Loader from './Loader';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import { Left  } from './MoreSvg';

export default function SearchFollowing({userIdd}) {
    const navigate=useNavigate();
    const firebase = useFirebase();
    const { user, Sfollowing, SsetFollowing, followUser,unfollowUser } = firebase; // Get logged-in user
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [search, setSearch] = useState("");
    const [followingList, setFollowingList] = useState([]); // Track followed users


     // Fetching the list of users the logged-in user is following
     useEffect(() => {
        const fetchFollowingList = async () => {
            try {
                const userRef = doc(database, "users", user.uid); // Fetch the logged-in user's document
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                    const followingIds = userSnapshot.data().following || []; // Get following IDs from the document
                    setFollowingList(followingIds); // Set the following IDs in the state
                }
            } catch (error) {
                console.error("Error fetching following list:", error);
            }
        };

        if (user) {
            fetchFollowingList(); // Call the function when the component mounts
        }
    }, [user]);


    useEffect(() => {
        const fetchFollowingUsers = async () => {
            setLoading(true); // Set loading to true when fetching starts
            try {
                // Reference to the user document in the 'users' collection
                const userRef = doc(database, "users", userIdd);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    // Extract following IDs from the user's document
                    const followingIds = userSnapshot.data().following || []; // Use empty array if no following data

                    console.log("Following IDs:", followingIds); // Log the IDs
                    
                    if (followingIds.length === 0) {
                        console.log("No followings found!");
                        setFollowingUsers([]); // If no followings
                        setLoading(false); // Stop loading
                        return;
                    }

                    // Fetch the data of all followed users
                    const usersData = await Promise.all(
                        followingIds.map(async (id) => {
                            const followedUserRef = doc(database, "users", id);
                            const followedUserSnapshot = await getDoc(followedUserRef);

                            return followedUserSnapshot.exists() ? { id, ...followedUserSnapshot.data() } : null;
                        })
                    );

                    // Filter out any null values
                    const validUsers = usersData.filter(user => user !== null);

                    console.log("Valid Following Users:", validUsers); // Log valid users
                    setFollowingUsers(validUsers);
                } else {
                    console.log("User document not found!");
                    setFollowingUsers([]); // No followings
                }
            } catch (error) {
                console.error("Error fetching following users:", error);
            } finally {
                setLoading(false); // Set loading to false when fetching is done
            }
        };

        if (user) {
            fetchFollowingUsers();
        }
    }, [user]);

    const filterData = (followingUsers || [])
   .filter((obj) =>
     obj?.fullname?.toLowerCase().includes(search?.toLowerCase())
   )

   const handlenavigate=(id)=>{
    navigate(`/SearchProfile/${id}`)
    SsetFollowing(false);

}

  // Follow/Unfollow handler
  const handleFollow = async (event, userToFollow) => {
    event.preventDefault(); 
    if (followingList.includes(userToFollow.id)) {
        // If already following, unfollow the user
        await unfollowUser(user?.uid, userToFollow.id, 'unfollow');
        setFollowingList(followingList.filter(id => id !== userToFollow.id));
    } else {
        // Otherwise, follow the user
        await followUser(user?.uid, userToFollow.id, 'follow');
        setFollowingList([...followingList, userToFollow.id]);
    }
};
    return (
        <>
            <div className='d-sm-block d-none'>
            <div className={`${Sfollowing ? "" : "d-none"} w-100 DALJU position-fixed top-0 w-100 h-100`} onClick={() => SsetFollowing(false)} style={{ height: "100vh", background: "rgba(0,0,0,0.65)", zIndex: "1001" }}>
                <div style={{ width: "400px", height: "400px", borderRadius: "12px" }} className="d-flex bg-white flex-column"  onClick={(e) => {
      e.stopPropagation()}}>
                    <div style={{ height: "42px" }} className="w-100 d-flex align-items-center justify-content-between px-2">
                        <div></div>
                        <div style={{ fontSize: "16px", fontWeight: "600" }}>Following</div>
                        <div className='cr' onClick={() => SsetFollowing(false)}><Cross /></div>
                    </div>
                    <hr className='m-0 p-0'></hr>
                    <div style={{ height: "48px", padding: "8px 16px" }} className='w-100 bg-'>
                        <input
                         onChange={(e) => setSearch(e.target.value)}
                         value={search}
                         placeholder='Search'
                          type='search'
                           style={{ padding: "3px 16px", border: "none", outline: "none", background: "#efefef", borderRadius: "8px", fontSize: "14px", fontWeight: "400" }} className='w-100 h-100 ' />
                    </div>
                    <div className='scroll-container w-100 m-0 p-0 bg-' style={{ height: "309px" }}>



                    {

search?(<>
 {filterData.length > 0 ? (
                      <>
                        {filterData.map((val, id) => {
                          return ( <div key={val.id} className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }}>
                            <div className='d-flex gap-2 align-items-center'>
                                <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU bg- cr'  onClick={() => handlenavigate(val.id)}>
                                    <img src={val.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                </div>
                                <span className='d-flex flex-column '>
                                    <div className='d-flex gap-1 align-items-center'>
                                        <span style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}>{val.username}</span>
                                    </div>
                                    <span style={{ fontWeight: "400", fontSize: "14px" }}>{val.fullname}</span>
                                </span>
                            </div>
                            {followingList.includes(val.id) ? (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, val)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#dbdbdb",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-dark DALJU cr">
                                                                    Unfollow
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, val)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#0095f6",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-white DALJU cr">
                                                                    Follow
                                                                </button>
                                                            )}
                        </div>
                        );
                      })}
                    </>
                  ) : (
                   <>
                       <div  className='w-100 h-100 DALJU'>
                <span style={{fontSize:"14px",color:"#737373"}} className='text-center'>No result faund.</span>
                </div>
                   </>
                              )}

                      
</>
    ):(
      <>
  {loading ? (
                            <div className="w-100 h-100 DALJU"><Loader/></div> // Show loader when data is being fetched
                            
                        ) : followingUsers.length > 0 ? (
                            followingUsers.map(user => (
                                <div key={user.id} className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }}>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU bg- cr'  onClick={() => handlenavigate(user.id)}>
                                            <img src={user.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                        </div>
                                        <span className='d-flex flex-column '>
                                            <div className='d-flex gap-1 align-items-center'>
                                                <span style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}>{user.username}</span>
                                            </div>
                                            <span style={{ fontWeight: "400", fontSize: "14px" }}>{user.fullname}</span>
                                        </span>
                                    </div>
                                    {followingList.includes(user.id) ? (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, user)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#dbdbdb",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-dark DALJU cr">
                                                                    Unfollow
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, user)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#0095f6",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-white DALJU cr">
                                                                    Follow
                                                                </button>
                                                            )}
                                </div>
                            ))
                        ) : (
                            <div className='DALJU' style={{ fontSize: "17px", fontWeight: "600" }}>No Following Users</div> // Message for no users
                        )}
      </>
    )
  
  }


                    </div>
                </div>
            </div>
            </div>

    
          <div className='d-sm-none d-block'>
            <Layout>
            <div className={`${Sfollowing ? "" : "d-none"} w-100 DALJU position-fixed top-0 w-100 h-100`} onClick={() => SsetFollowing(false)} style={{ height: "100vh"}}>
                <div className="d-flex bg-white flex-column following_sm"  onClick={(e) => {
      e.stopPropagation()}}>
                  <div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",right:"0px",zIndex:"10002"}} className='d-md-none bg-white d-block position-fixed w-100 d-flex align-items-center justify-content-between '>
<div style={{ transform: "rotate(270deg)"}}  onClick={() => SsetFollowing(false)} className="cr"><Left/></div>
           
           <span style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}}>Following</span>
             
            <div ></div>
          </div>

                    <div style={{ height: "48px", padding: "8px 16px" }} className='w-100 bg-'>
                        <input
                         onChange={(e) => setSearch(e.target.value)}
                         value={search}
                         placeholder='Search'
                          type='search'
                           style={{ padding: "3px 16px", border: "none", outline: "none", background: "#efefef", borderRadius: "8px", fontSize: "14px", fontWeight: "400" }} className='w-100 h-100 ' />
                    </div>
                    <div className='scroll-container w-100 m-0 p-0 bg- h-100'>



                    {

search?(<>
 {filterData.length > 0 ? (
                      <>
                        {filterData.map((val, id) => {
                          return ( <div key={val.id} className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }}>
                            <div className='d-flex gap-2 align-items-center'>
                                <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU bg- cr'  onClick={() => handlenavigate(val.id)}>
                                    <img src={val.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                </div>
                                <span className='d-flex flex-column '>
                                    <div className='d-flex gap-1 align-items-center'>
                                        <span style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}>{val.username}</span>
                                    </div>
                                    <span style={{ fontWeight: "400", fontSize: "14px" }}>{val.fullname}</span>
                                </span>
                            </div>
                            {followingList.includes(val.id) ? (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, val)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#dbdbdb",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-dark DALJU cr">
                                                                    Unfollow
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, val)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#0095f6",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-white DALJU cr">
                                                                    Follow
                                                                </button>
                                                            )}
                        </div>
                        );
                      })}
                    </>
                  ) : (
                   <>
                       <div  className='w-100 h-100 DALJU'>
                <span style={{fontSize:"14px",color:"#737373"}} className='text-center'>No result faund.</span>
                </div>
                   </>
                              )}

                      
</>
    ):(
      <>
  {loading ? (
                            <div className="w-100 h-100 DALJU"><Loader/></div> // Show loader when data is being fetched
                            
                        ) : followingUsers.length > 0 ? (
                            followingUsers.map(user => (
                                <div key={user.id} className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }}>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU bg- cr'  onClick={() => handlenavigate(user.id)}>
                                            <img src={user.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                        </div>
                                        <span className='d-flex flex-column '>
                                            <div className='d-flex gap-1 align-items-center'>
                                                <span style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}>{user.username}</span>
                                            </div>
                                            <span style={{ fontWeight: "400", fontSize: "14px" }}>{user.fullname}</span>
                                        </span>
                                    </div>
                                    {followingList.includes(user.id) ? (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, user)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#dbdbdb",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-dark DALJU cr">
                                                                    Unfollow
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={(event) => handleFollow(event, user)} 
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        borderRadius: "8px",
                                                                        background: "#0095f6",
                                                                        height: "31px",
                                                                        padding: "7px 16px",
                                                                        border: "none"
                                                                    }}
                                                                    className="text-white DALJU cr">
                                                                    Follow
                                                                </button>
                                                            )}
                                </div>
                            ))
                        ) : (
                            <div className='DALJU' style={{ fontSize: "17px", fontWeight: "600" }}>No Following Users</div> // Message for no users
                        )}
      </>
    )
  
  }


                    </div>
                </div>
            </div>
            </Layout>
            </div>
        </>
    );
}
