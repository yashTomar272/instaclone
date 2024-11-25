import Layout from './Layout';
import {Meta,Account,Privacy,Person,Help,Family,Mute,Content,Archiving,Dislike,Language, Security,Website, Add, Payment, Profile, Notification, Shop, Graph, Lock,Star, Block, Hide, Message, Tag, Comment, Share, Restricted, Word} from './Edit'
import EditProfile2 from './EditProfile2';
import { Left  } from './MoreSvg';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from './Firebase';
export default function EditProfile(){
    const firebase=useFirebase();
    const navigate=useNavigate();
    const handleLogOut= async()=>{
        await firebase.logout();
        navigate('/');

      }
    return(
        <>

        <Layout >
        <div className='main_edit w-100 bg- d-flex'>
<div className='Setting bg- scroll-container edit_first mt-4 mt-md-0' >
<div style={{height:"44px",padding:"0px 16px",borderBottom:"1px solid #e2e5e9",top:"0px",right:"0px",zIndex:"10002"}} className='d-md-none bg-white d-block position-fixed w-100 d-flex align-items-center justify-content-between '>
<div style={{ transform: "rotate(270deg)"}}  onClick={() => 
  navigate(-1)} className="cr"><Left/></div>
           
           <span style={{fontSize:"14px",color:"#000000",cursor:"pointer",fontWeight:"600"}}>Settings and privacy</span>
             
            <div ></div>
          </div>
<div className='d-flex flex-column gap-3'>
<div style={{fontWeight:"700",fontSize:"20px",color:"#00000"}} className='ms-3 py-3 d-md-block d-none '>Settings</div>

<div className='edit_meta d-flex Settingg cr flex-column justify-content-between' >
    <Meta/>
    <span style={{fontSize:"16px",fontWeight:"700",color:"#000000"}}>Accounts Centre</span>
    <span style={{fontWeight:"400",fontSize:"12px",color:"#737373"}}>Manage your connected experiences and account setting across Meta technologies.</span>
    
    <span style={{fontSize:"12px",color:"#737373",fontWeight:"400"}} className='w-100 d-flex gap-2'>
        <Person/>
       <span className='d-flex justify-content-center h-100'> Personal details</span>
    </span>
    <span style={{fontSize:"12px",color:"#737373",fontWeight:"400"}} className='w-100 d-flex gap-2'>
        <Security/>
       <span className='d-flex justify-content-center'> Password and security</span>
    </span>
    <span style={{fontSize:"12px",color:"#737373",fontWeight:"400"}} className='w-100 d-flex gap-2'>
        <Add/>
       <span className='d-flex justify-content-center h-100'> Ad preferences</span>
    </span>
    <span style={{fontSize:"12px",color:"#737373",fontWeight:"400"}} className='w-100 d-flex gap-2'>
        <Payment/>
       <span className='d-flex justify-content-center'> Payments</span>
    </span>
    <span style={{fontWeight:"600",fontSize:"12px",color:"#0095f6"}}>See more in Accounts centre</span>
</div>

<div className='d-flex flex-column mb-5 mb-md-0'>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>How you use Instagram</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Profile/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Edit profile</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Notification/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Notification</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>How you use Instagram</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Shop/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Professional account</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Graph/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Creator tools and controls</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>Who can see your content</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Lock/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Account privacy</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Star/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Close friends</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Block/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Blocked</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Hide/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Hide story and Live</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>How others can interact with you</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Message/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Meassages and story replies</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Tag/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Tags and mentions</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Comment/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Comments</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Share/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Sharing and remixes</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Restricted/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Restricted accounts</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Word/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Hidden words</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>What you see</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Mute/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Mutted accounts</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Content/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Content preferences</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Dislike/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Like and share counts</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>Your app and media</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Archiving/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Archiving and downloading</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Language/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Language</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Website/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Website permssions</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>For families</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Family/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Family centre</span>
</div>
<span style={{fontSize:"12px",color:"#737373",fontWeight:"600",padding:"12px 16px"}}>More info and support</span>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Help/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Help</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Privacy/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Privacy center</span>
</div>
<div className='d-flex gap-2 Setting_btn cr' style={{padding:"12px 16px",borderRadius:"8px"}}>
    <Account/>
<span style={{color:"#000000",fontWeight:"400",fontSize:"14px"}}>Account status</span>
</div>
<div className='d-flex gap-2 Setting_btn cr ' style={{padding:"12px 16px",borderRadius:"8px"}} onClick={handleLogOut}>
   
<span style={{color:"red",fontWeight:"400",fontSize:"14px"}}>Log out</span>
</div>



</div>

</div>
</div>
<div style={{padding:"36px 0px",flexGrow:"1",height:"100vh"}} className='scroll-container  d-md-block d-none'><EditProfile2/></div>

        </div>
        </Layout>
        </>
    )
}