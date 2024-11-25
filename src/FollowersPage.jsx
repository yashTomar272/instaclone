import React, { useEffect, useState } from 'react';
import { useFirebase } from './Firebase';
import img from './imgs/profile.jpg';
import { Cross } from './MoreSvg';
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore'; // Firebase functions for update
import { database } from "./Firebase"; // Import your Firebase config
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { Left  } from './MoreSvg';


export default function FollowersPage() {
    const navigate = useNavigate();
    const firebase = useFirebase();
    const { user, follower, setFollower, followUser,unfollowUser } = firebase; // Get logged-in user
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
                const userRef = doc(database, "users", user.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const followingIds = userSnapshot.data().followers || []; // Use empty array if no followers

                    if (followingIds.length === 0) {
                        setFollowingUsers([]); // If no followers found
                        setLoading(false); // Stop loading
                        return;
                    }

                    const usersData = await Promise.all(
                        followingIds.map(async (id) => {
                            const followedUserRef = doc(database, "users", id);
                            const followedUserSnapshot = await getDoc(followedUserRef);
                            return followedUserSnapshot.exists() ? { id, ...followedUserSnapshot.data() } : null;
                        })
                    );

                    const validUsers = usersData.filter(user => user !== null);
                    setFollowingUsers(validUsers);
                } else {
                    setFollowingUsers([]);
                }
            } catch (error) {
                console.error("Error fetching following users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFollowingUsers();
        }
    }, [user]);

    // Search filtering logic
    const filterData = (followingUsers || [])
        .filter((obj) =>
            obj?.fullname?.toLowerCase().includes(search?.toLowerCase())
        );

    // Function to handle removing a follower
    const handleRemoveFollower = async (idToRemove) => {
        try {
            const userRef = doc(database, "users", user.uid); 
            
            await updateDoc(userRef, {
                followers: arrayRemove(idToRemove) // Remove follower from followers array
            });
    
            const followedUserRef = doc(database, "users", idToRemove); 
            await updateDoc(followedUserRef, {
                following: arrayRemove(user.uid) // Remove current user from their following array
            });
    
            // Remove follower from the frontend list as well
            setFollowingUsers(prevUsers => prevUsers.filter(user => user.id !== idToRemove));
    
            console.log("Follower successfully removed");
        } catch (error) {
            console.error("Error removing follower:", error);
        }
    };

    // Follow/Unfollow handler
    const handleFollow = async (event, userToFollow) => {
        console.log("4454354",userToFollow)
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
            <div className={`${follower ? "" : "d-none"} w-100 DALJU position-fixed top-0 w-100 h-100`} onClick={() => setFollower(false)} style={{ height: "100vh", background: "rgba(0,0,0,0.65)", zIndex: "1001" }}>
                <div style={{ width: "400px", height: "400px", borderRadius: "12px" }} className="d-flex bg-white flex-column" onClick={(e) => {
                    e.stopPropagation()
                }}>
                    <div style={{ height: "42px" }} className="w-100 d-flex align-items-center justify-content-between px-2">
                        <div></div>
                        <div style={{ fontSize: "16px", fontWeight: "600" }}>Followers</div>
                        <div className='cr' onClick={() => setFollower(false)}><Cross /></div>
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
                        {search ? (
                            <>
                                {filterData.length > 0 ? (
                                    <>
                                        {filterData.map((val, id) => (
                                            <div className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }} key={id}>
                                                <div className='d-flex gap-2 align-items-center'>
                                                    <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU cr' onClick={() => navigate(`/SearchProfile/${val.id}`)}>
                                                        <img src={val.proimg} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                                    </div>
                                                    <span className='d-flex flex-column '>
                                                        <div className='d-flex gap-1 align-items-center'>
                                                            <span style={{ fontWeight: "600", fontSize: "14px" }}>{val.username}</span>
                                                            <div>.</div>
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
                                                        <span style={{ fontWeight: "400", fontSize: "14px" }}>{val.fullname}</span>
                                                    </span>
                                                </div>
                                                <div className='DALJU remove cr' style={{ width: "83px", height: "32px", borderRadius: "8px", padding: "0px 10px", fontSize: "14px", fontWeight: "600", background: "#efefef" }} onClick={() => handleRemoveFollower(val.id)}>
                                                    Remove
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className='w-100 h-100 DALJU'>
                                        <span style={{ fontSize: "14px", color: "#737373" }} className='text-center'>No users found.</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {loading ? (
                                   <div className='w-100 h-100 DALJU'><Loader /> </div> // Show loader while data is loading
                                ) : followingUsers.length > 0 ? (
                                    followingUsers.map((user, index) => (
                                        <div className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }} key={index}>
                                            <div className='d-flex gap-2 align-items-center'>
                                                <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU cr' onClick={() => navigate(`/SearchProfile/${user.id}`)}>
                                                    <img src={user.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                                </div>
                                                <span className='d-flex flex-column '>
                                                    <div className='d-flex gap-1 align-items-center'>
                                                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{user.username}</span>
                                                        <div>.</div>
                                                        {followingList.includes(user.id) ? (
                                                            <span onClick={(event) => handleFollow(event, user)} className='cr' style={{ fontWeight: "600", fontSize: "12px", color: "#bdbdbd" }}>Unfollow</span> 

                                                        ) : (

                                                          <span onClick={(event) => handleFollow(event, user)} className='cr' style={{ fontWeight: "600", fontSize: "12px", color: "#0095f6" }}>Follow</span> 

                                                        )}

                                                    </div>
                                                    <span style={{ fontWeight: "400", fontSize: "14px" }}>{user.fullname}</span>
                                                </span>
                                            </div>
                                            <div className='DALJU remove cr' style={{ width: "83px", height: "32px", borderRadius: "8px", padding: "0px 10px", fontSize: "14px", fontWeight: "600", background: "#efefef" }} onClick={() => handleRemoveFollower(user.id)}>
                                                Remove
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-100 h-100 DALJU'>
                                        <span style={{ fontSize: "14px", color: "#737373" }} className='text-center'>You are not following anyone.</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            </div>
            <div className='d-sm-none d-block'>
            <Layout>
            <div className={`${follower ? "" : "d-none"} w-100 DALJU position-fixed top-0 w-100 h-100`} onClick={() => setFollower(false)} style={{ height: "100vh" }}>
                <div  className="d-flex bg-white flex-column following_sm" onClick={(e) => {
                    e.stopPropagation()
                }}>
                   <div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",right:"0px",zIndex:"10002"}} className='d-md-none bg-white d-block position-fixed w-100 d-flex align-items-center justify-content-between '>
<div style={{ transform: "rotate(270deg)"}}  onClick={() => setFollower(false)} className="cr"><Left/></div>
           
           <span style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}}>Following</span>
             
            <div ></div>
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
                    <div className='scroll-container w-100 m-0 p-0 bg- h-100' >
                        {search ? (
                            <>
                                {filterData.length > 0 ? (
                                    <>
                                        {filterData.map((val, id) => (
                                            <div className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }} key={id}>
                                                <div className='d-flex gap-2 align-items-center'>
                                                    <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU cr' onClick={() => navigate(`/SearchProfile/${val.id}`)}>
                                                        <img src={val.proimg} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                                    </div>
                                                    <span className='d-flex flex-column '>
                                                        <div className='d-flex gap-1 align-items-center'>
                                                            <span style={{ fontWeight: "600", fontSize: "14px" }}>{val.username}</span>
                                                            <div>.</div>
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
                                                        <span style={{ fontWeight: "400", fontSize: "14px" }}>{val.fullname}</span>
                                                    </span>
                                                </div>
                                                <div className='DALJU remove cr' style={{ width: "83px", height: "32px", borderRadius: "8px", padding: "0px 10px", fontSize: "14px", fontWeight: "600", background: "#efefef" }} onClick={() => handleRemoveFollower(val.id)}>
                                                    Remove
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className='w-100 h-100 DALJU'>
                                        <span style={{ fontSize: "14px", color: "#737373" }} className='text-center'>No users found.</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {loading ? (
                                   <div className='w-100 h-100 DALJU'><Loader /> </div> // Show loader while data is loading
                                ) : followingUsers.length > 0 ? (
                                    followingUsers.map((user, index) => (
                                        <div className='w-100 d-flex bg- align-items-center justify-content-between' style={{ height: "60px", padding: "8px 16px" }} key={index}>
                                            <div className='d-flex gap-2 align-items-center'>
                                                <div style={{ width: "54px", height: "54px", borderRadius: "50%" }} className='DALJU cr' onClick={() => navigate(`/SearchProfile/${user.id}`)}>
                                                    <img src={user.proimg || img} style={{ width: "44px", height: "44px", borderRadius: "50%" }} alt='Pro_img' />
                                                </div>
                                                <span className='d-flex flex-column '>
                                                    <div className='d-flex gap-1 align-items-center'>
                                                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{user.username}</span>
                                                        <div>.</div>
                                                        {followingList.includes(user.id) ? (
                                                            <span onClick={(event) => handleFollow(event, user)} className='cr' style={{ fontWeight: "600", fontSize: "12px", color: "#bdbdbd" }}>Unfollow</span> 

                                                        ) : (

                                                          <span onClick={(event) => handleFollow(event, user)} className='cr' style={{ fontWeight: "600", fontSize: "12px", color: "#0095f6" }}>Follow</span> 

                                                        )}

                                                    </div>
                                                    <span style={{ fontWeight: "400", fontSize: "14px" }}>{user.fullname}</span>
                                                </span>
                                            </div>
                                            <div className='DALJU remove cr' style={{ width: "83px", height: "32px", borderRadius: "8px", padding: "0px 10px", fontSize: "14px", fontWeight: "600", background: "#efefef" }} onClick={() => handleRemoveFollower(user.id)}>
                                                Remove
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-100 h-100 DALJU'>
                                        <span style={{ fontSize: "14px", color: "#737373" }} className='text-center'>You are not following anyone.</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            </Layout>
            </div>
        </>
    );
}
