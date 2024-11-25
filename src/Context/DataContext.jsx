import React, { createContext , useEffect, useState} from 'react'


import { useFirebase } from '../Firebase';
import { useSearchParams } from 'react-router-dom';
export const DataContext= createContext();
const DataProvider = ({ children }) => {
// const [user,setuser]= useState('')
// const [allUsers,setallUsers]= useState(null)
// const firebase= useFirebase();
// const [handlecreatePostCloseButton,sethandlecreatePostCloseButton]= useState(false)

// const [sidebarMenu,setSidebarMenu]=useState(false)
// const [sidebarMenuSeeting,setSidebarMenuSeeting]= useState(false);
// useEffect(()=>{
// const getdata=async()=>{
//   const userdata= await firebase.userdata;
//   setuser(userdata)
// }
// getdata()
// },[firebase,user])
// // console.log(user)
// const createPostCloseButton=()=>{
//     sethandlecreatePostCloseButton(prev=>!prev)
// }

// useEffect(()=>{
  
//   if (user && user.video) {
    
//     const getall = async()=>{
//       const alluser= await firebase.getAllUser;
//       setallUsers(alluser); // Set the 'video' array in the state
//     }
//   getall();}
// },[firebase,user])
//     return (
//     <DataContext.Provider value={{sidebarMenuSeeting,setSidebarMenuSeeting,sidebarMenu,setSidebarMenu,
//      createPostCloseButton,handlecreatePostCloseButton,
//      sethandlecreatePostCloseButton,user ,allUsers}}>
//     {children}
// </DataContext.Provider>
//   )
}

export default DataProvider