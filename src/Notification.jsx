import { Left } from "./MoreSvg"
import Layout from './Layout'
export default function Notification(){


    return(
        <>
     
        <div >
<div className="  bg-white   position-absolute" style={{zIndex:"1000",width:"400px", boxShadow:" 10px 0px 14px rgba(0,0,0,0.1)",height:"100vh"}}>
  <div className=" d-md-none d-block d-flex align-items-center justify-content-between flex-row" style={{borderBottom:"1px solid #e8e3e3",height:"44px",padding:"0px 17px"}}>
<div><Left/></div>
<div style={{fontSize:"16px",fontWeight:"600"}}>Notification</div>
<div> </div>
  </div>
<h1 className=" d-md-block d-none ">Notification</h1>
  <h4>No Yet Notification Here....</h4>
</div>
</div>
        
        </>
    )
}