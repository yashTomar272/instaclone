import img1 from './imgs/img1.jpg'
import {useFirebase} from './Firebase'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SearchPage(){
const firebase=useFirebase();
const { getAllUser } = firebase; 
const navigate=useNavigate();
const [search, setSearch] = useState("");






   const filterData = (getAllUser || [])
   .filter((obj) =>
     obj?.fullname?.toLowerCase().includes(search?.toLowerCase())
   )
  
   
    return(
        <>
<div className='d-flex flex-column bg-white' style={{width:"397px",height:"100vh",borderTopRightRadius:"20px",borderBottomRightRadius:"20px",position:"absolute",zIndex:"10000",boxShadow: "10px 0px 14px rgba(0,0,0,0.1)"}}>
<h3 className="mx-3 my-4" >Search</h3>

   <div className="mx-3 mt-3 mb-2">
      <input type="search"
      onChange={(e) => setSearch(e.target.value)}
      value={search}
    placeholder="Search" className="w-100" style={{border:"none",outline:"none",width:"100%",height:"40px",backgroundColor:"#efefef",borderRadius:"8px",padding:"3px 16px"}} /></div>
<hr style={{background:"#65686c"}}></hr>
<span className="d-flex justify-content-between mx-3 mt-2 mb-3">
    <h3 style={{fontSize:"18px",fontWeight:"700"}}>Recent</h3>
    <div style={{fontSize:"14px",color:"#0095f6",fontWeight:"700"}}>Clear all</div>
</span>

{

   search?(<>
   <div className='bg- w-100 h-100 scroll-container  px-0'>
  {filterData.length > 0 ? (
                      <>
                        {filterData.map((val, id) => {
                          return (
                          
<div className="Sugges_profile mt-1 d-flex gap-2 flex-column w-100 bg- " style={{height:"60px",cursor:"pointer"}}   onClick={() => {firebase.setSearch(false) // Log the message
    navigate(`/SearchProfile/${val.id}`);}}>
              
                     <div  className="Our_profie mx-3 d-flex align-items-center justify-content-between ">
                        <div className="d-flex gap-3  d-flex justify-content- align-items-center" style={{height:"60px"}}>

                              <img
                                 src={val?.proimg}
                                 alt="img"
                                 style={{
                                    cursor:"pointer",
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                 }}
                              />

<div className=" d-flex flex-column  justify-content-center">
    <h6 className="text-dark mb-0">{val?.fullname}</h6>
    <p style={{ color: "#737373", fontSize: "14px" }}>{val?.username}</p>
</div>


                        </div>
                       
                     </div>
                     
                 
            </div>
           

             );
            })}
          </>
        ) : (
         <>
             <div style={{height:"457px"}} className='w-100 d-flex align-items-center justify-content-center'>
      <span style={{fontSize:"14px",color:"#737373"}} className='text-center'>No result faund.</span>
      </div>
         </>
                    )}
                    </div>
   </>
    ):(
      <>
      <div style={{height:"300px"}} className='w-100 d-flex align-items-center justify-content-center'>
      <span style={{fontSize:"14px",color:"#737373"}} className='text-center'>No recent search.</span>
      </div>
      </>
   )
  
}


            
</div>
        </>
    )
}