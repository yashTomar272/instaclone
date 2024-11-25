import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { Left } from "./MoreSvg"
import { useFirebase } from "./Firebase";

export default function NotificationSecond(){
  const firebase=useFirebase();
  const {setNavv}=firebase;
const navigate=useNavigate();
    return(
        <>
       <Layout>
       <div >
<div className=" h-100  bg-white position-fixed scroll-container w-100 ">
  <div className=" d-md-none d-block d-flex align-items-center justify-content-between flex-row" style={{borderBottom:"1px solid #e8e3e3",height:"44px",padding:"0px 17px"}}>
<div style={{ transform: "rotate(270deg)"}}  onClick={() => {
  navigate(-1);
  setNavv(" ");
  }} className="cr"><Left/></div>
<div style={{fontSize:"16px",fontWeight:"600"}}>Notification</div>
<div> </div>
  </div>
<h1 className=" d-md-block d-none ">Notification</h1>
  <h4>No Yet Notification Here....</h4>
</div>
</div>
       </Layout>
        </>
    )
}