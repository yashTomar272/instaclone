import { useFirebase } from "./Firebase";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import CreatePost from './CreatePost'
import SearchProfile from './SearchProfile'
import Suggesion from "./Suggesion";
import ActiveSeetingpage from './ActiveSettingpage'
import MainPage from './MainPage'
import { useEffect } from "react";
export default function HomePage(){
  const firebase=useFirebase();
  const navigate=useNavigate();
  useEffect(()=>{
   if(firebase.user=== null){ navigate('/instaclone')}

},[firebase])

  return(
    <div className="w-100">
 <CreatePost/>
      <ActiveSeetingpage/>
      <Layout >


        <div className="d-flex justify-content-between p-0 m-0" style={{zIndex:"-1"}}>
         <div  className="w-100  "> 
    <MainPage/>
</div>
<div>
<Suggesion/></div>
</div>
      </Layout>
    </div>
  )
}