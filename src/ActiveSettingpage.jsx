import { useState } from "react"


 import {useFirebase} from './Firebase'
 

 export default function ActiveSettingpage(){
  const firebase=useFirebase();
  const {seeting,setseeting}=firebase
    return(
        <>
        
        {/* <div className={`w-100 DALJU ${open && "d-none"}  `} style={{height:"100vh",background:"rgba(0,0,0,0.65)"}} onClick={handleClose}> */}
        <div className={`${seeting? " ": 'd-none'} w-100 DALJU position-fixed top-0 w-100 h-100`} onClick={()=>setseeting(false)} style={{height:"100vh",background:"rgba(0,0,0,0.65)",zIndex:"1001"}} >
        
        <div style={{width:"400px",height:"480px",margin:"20px",borderRadius:"12px"}} onClick={(e) => {
      e.stopPropagation()}}  className="cr bg-white">
         
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">App and wensite</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Professional account</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">QR code</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Notifications</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Setting and privacy</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Supervision</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Login activity</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Embed</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"1px solid rgb(219,219,219)"}} className="DALJU  w-100">Log out</button>
        <button style={{padding:"4px 8px",outline:"none",border:"none",fontSize:"14px",fontWeight:"400",height:"48px",background:"none",borderBottom:"none"}} className="DALJU  w-100" onClick={()=>setseeting(false)}>Cancel</button>
            
        </div>
        
        </div>
        </>
    )
}