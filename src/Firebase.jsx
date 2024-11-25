
import React,{ createContext,useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import profile from './imgs/profile.jpg'
import { getStorage } from 'firebase/storage';
import {
          
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,updateDoc, arrayUnion,arrayRemove
} from "firebase/firestore";
import {  getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,

  signInWithPopup,
  onAuthStateChanged,
  signOut

} from "firebase/auth";



const FirebaseContext = createContext(null);

const firebaseConfig = {
  
  apiKey: "AIzaSyDNthEjs8DeRXjWC6lLgw6M55OaaWbr5co",
  authDomain: "instanewclone.firebaseapp.com",
  projectId: "instanewclone",
  storageBucket: "instanewclone.appspot.com",
  messagingSenderId: "274798233796",
  appId: "1:274798233796:web:4e1aacb20c9a9c4952e191",
};
const firebaseApp=initializeApp(firebaseConfig);
const firebaseAuth=getAuth(firebaseApp);
export const database = getFirestore(firebaseApp);

export const storage = getStorage(firebaseApp);

export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseProvider = (props) => { 
  
  const [email, setemail] = useState();
  const [fullname, setfullname] = useState();
  const [username, setusername] = useState();
  const [dob, setdob] = useState('');
  const [password, setpassword] = useState();
  const [user, setuser] = useState(null);
  const [userId,setUserId]= useState('');
  const [userdata, d] = useState(null);
  const [getAllUser, setgetAllUser] = useState([]);
  const [search,setSearch]= useState(false)
  const [seeting,setseeting]=useState(false)
  const [follower,setFollower]=useState(false)
  const [following,setFollowing]=useState(false)
  const [Sfollower,SsetFollower]=useState(false)
  const [Sfollowing,SsetFollowing]=useState(false)
  const [createpost,setCreatepost]=useState(false);
  const [CreateStory,setCreateStory]=useState(false);
  const [Story,setStory]=useState(false);
  const [allShow,setAllShow]=useState("")
  const [navv,setNavv]=useState("");
  const [Ex,setEx]=useState(" ")

   useEffect(()=>{
     onAuthStateChanged(firebaseAuth,(user)=>{
      if(user){
        setuser(user);
      }
      else {
        setuser(null);
      }
     })
   },[])

  const isLoggedIn = user ? true : false;

  // register database
 
  const signupUserWithPassEmailName = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };
  // login
  const loginWithEmailandPass= async (email, password)=>{

   return signInWithEmailAndPassword(firebaseAuth,email, password);

  }
  // login with facebook
  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  // logout
  const logout = async () => {
    try {
      // Clear myId from Redux
      setuser(null);
      d(null);
      console.log("User logged out");
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  // Write user data to Firestore
  const writeUserData = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is missing.");
      }
      const userRef = doc(database, "users", userId); // Ye sahi reference hai
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const userData = {
        userId:userId,
        email: email,
        fullname: fullname,
        username: username,
        dob: dob,
        bio: "",
        gender:"",
        proimg: profile,
        followers:[],
        followings:[],
        password: password,
        date: new Date().toLocaleString("en-us", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        time: time,
      };
      console.log(userData);
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error("Error writing user data: ", error);
      throw error;
    }
  };
  
  
  const userData = (email, fullname, username, password) => {
    setemail(email);
    setfullname(fullname);
    setusername(username);
    setpassword(password);
    // setUserId(userId)
  };

  // save daata
  const saveData = async () => {
    try {
      console.log(email);
      console.log(fullname);
      console.log(username);
      console.log(dob);
      console.log(password);
  
      console.log("Email:", email, "Password:", password);
      const usera = await signupUserWithPassEmailName(email, password);
      if (usera) {
        console.log(usera);
        const userIda = usera.user.uid; // Yeh value directly user se le rahe hain
        setUserId(userIda); // state update kar rahe hain
        console.log(userIda);
        
        // Ensure userId is defined before writing data
        const data = await writeUserData(userIda); // direct pass kar rahe hain userIda ko
        console.log("User signed up:", data);
      }
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };
  
  const savedob=(maindob)=>{
    console.log('hello',maindob)
    setdob(maindob)
  }
  // get userdata
  async function getUserData(userId) {
    try {
      const userRef = doc(database, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        // d(userData); // Set the fetched data into the state

        return userData;
      } else {
        console.log("No such user!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      throw error;
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // indexOf
          const data = await getUserData(user.uid); // Fetch user data using the user's UID
          // setmyId(data.userId);
          d(data); // Set the fetched data into the state
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]); // Re-run effect when user or getUserData changes

  // get all user function
  const getAllUserFunction = () => {
    try {
      const q = query(
        collection(database, "users"),
        orderBy("time"), // Assuming 'time' field exists in the user documents
      );
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        let userArray = [];
        QuerySnapshot.forEach((doc) => {
          userArray.push({ ...doc.data(), id: doc.id });
        });
        setgetAllUser(userArray);
        // setLoading(false);
      });
      return () => unsubscribe(); // Clean up subscription on unmount
    } catch (error) {
      console.error("Error fetching users: ", error);
      // setLoading(false);
      
    }
  };
  useEffect(() => {
   
    getAllUserFunction();
    
  }, []);
  

// Follow user function
 const followUser = async (loggedInUserId, followUserId) => {
  try {
    const userDocRef = doc(database, 'users', loggedInUserId);
    await updateDoc(userDocRef, {
      following: arrayUnion(followUserId) // Add the followed user's ID to the following list
    });
    console.log("User followed successfully");
  } catch (error) {
    console.error("Error following user:", error);
  }
};

// Unfollow user function
 const unfollowUser = async (loggedInUserId, unfollowUserId) => {
  try {
    const userDocRef = doc(database, 'users', loggedInUserId);
    await updateDoc(userDocRef, {
      following: arrayRemove(unfollowUserId) // Remove the unfollowed user's ID from the following list
    });
    console.log("User unfollowed successfully");
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};
// Firebase Context mein
const getFollowingUsers = async (userId) => {
  try {
    const userRef = doc(database, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const followingIds = userData.followings; // Assuming 'followings' is an array of followed user IDs

      // Get the data of the following users
      const followingUsers = await Promise.all(
        followingIds.map(async (id) => {
          const followedUserRef = doc(database, "users", id);
          const followedUserSnapshot = await getDoc(followedUserRef);
          return followedUserSnapshot.exists() ? { id, ...followedUserSnapshot.data() } : null;
        })
      );

      // Filter out any null values
      return followingUsers.filter(user => user !== null);
    } else {
      console.log("User does not exist!");
      return [];
    }
  } catch (error) {
    console.error("Error fetching following users:", error);
    return [];
  }
};
 const fetchPosts = async () => {
  try {
      const postsCollection = collection(database, 'posts'); // Posts collection ka naam
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }));
      console.log("Fetched posts:", postList); // Console log to check fetched posts
      return postList;
  } catch (error) {
      console.error("Error fetching posts from Firestore:", error);
      return []; // Agar error aaye toh empty array return kare
  }
};

  // Function to add product to the user's cart
  const addPosts = async (post) => {
    if (user) {
      const cartRef = doc(
        database,
        `users/${user.uid}/SavePosts/${post.id}`,
      );

      try {
        const cartDoc = await getDoc(cartRef);

       
       
          await setDoc(cartRef, {
            url: post.url,
            description: post.description,
            like:post.likes,
            type:post.type,
            comment:post.comment,
          });
        console.log("post.description",post.description)

        console.log("Product added to cart successfully.");
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    } else {
      console.log("User not logged in.");
    }
  };

// Remove from Cart Functionality
const removePosts = async (productId) => {
  if (user) {
    const cartRef = doc(database, `users/${user.uid}/SavePosts/${productId}`);

    try {
      await deleteDoc(cartRef);
      console.log(
        `Product with ID: ${productId} has been removed from the cart.`,
      );
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  } else {
    console.log("User not logged in.");
  }
};
  return (
      <FirebaseContext.Provider
        value={{addPosts,email,
          removePosts,
          fetchPosts,
          unfollowUser,
          followUser,
          getFollowingUsers,
          signupUserWithPassEmailName,
          loginWithEmailandPass,
           loginWithFacebook,
          isLoggedIn,
          logout,
          userData,
        saveData,
        userdata,
        savedob,
        getAllUser,
        userId,
        getUserData, 
        user,
        search,
        setSearch,seeting,setseeting,follower,setFollower,following,setFollowing,
       Sfollower,SsetFollower,Sfollowing,SsetFollowing,setCreatepost,createpost,
       CreateStory,setCreateStory,
       Story,setStory,allShow,setAllShow,navv,setNavv,Ex,firebaseAuth
        }}
      >
    {props.children}
      </FirebaseContext.Provider>
    );
  };











