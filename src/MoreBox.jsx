import {Setting,Activity,Save,Sun,Report,Threads} from './MoreSvg'
import { useFirebase } from './Firebase'
import { useNavigate } from 'react-router-dom';
export default function MoreBox(){
    const firebase=useFirebase();
    const navigate=useNavigate();
    const handleLogOut= async()=>{
        await firebase.logout();
        navigate('/instaclone');

      }
      const handleSeeting=()=>{
        console.log("hello")
        firebase.setseeting(true)
      }
    return(
      <div className={`${firebase.seeting? 'd-none':''} cr`} style={{position:"absolute",bottom:"580px",left:"-8px",zIndex:"1000"}} >
          <div
          className="Side_logout bg-white p-2 d-flex  flex-column   "
          style={{ width: "250px",position:"absolute",left:"8px",top:"54px",borderRadius:"10px",boxShadow:"2px 0px 10px rgba(0,0,0,0.5)",padding:"8px" }}
        >
         <div onClick={handleSeeting} style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
<Setting/> <span style={{fontSize:"14px",fontWeight:"400"}}>Settings</span>
         </div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
<Activity/> <span style={{fontSize:"14px",fontWeight:"400"}}>Your activity</span>
         </div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} onClick={()=>navigate('/Save')} className='d-flex align-items-center gap-2 ho '> 
<Save/> <span style={{fontSize:"14px",fontWeight:"400"}}>Saved</span>
         </div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
<Sun/> <span style={{fontSize:"14px",fontWeight:"400"}}>Switch appearance</span>
         </div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
<Report/> <span style={{fontSize:"14px",fontWeight:"400"}}>Report a problem</span>
         </div>
         <div style={{height:"6px",background:"rgba(219,219,219,0.3)",margin:"8px -8px"}}></div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
<Threads/> <span style={{fontSize:"14px",fontWeight:"400"}}>Threads</span>
         </div>
         <div style={{height:"6px",background:"rgba(219,219,219,0.3)",margin:"8px -8px"}}></div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho '> 
 <span style={{fontSize:"14px",fontWeight:"400"}}>Switch account</span>
         </div>
         <div style={{height:"0.500px",background:"rgba(219,219,219,0.3)",margin:"8px -8px"}}></div>
         <div style={{height:"50px",padding:"16px",borderRadius:"8px"}} className='d-flex align-items-center gap-2 ho  ' onClick={handleLogOut}> 
 <span style={{fontSize:"14px",fontWeight:"400"}} >Log out</span>
         </div>
        </div>
        </div>
    )
  }
