
import Sidebar from './Sidebar'


export default function Layout({children}){

  return(

<div className='d-flex position-relative m-0 p-0' style={{zIndex:"10"}}>

<Sidebar />
  { <div className="main-container w-100  p-0 ">
    {children}
  </div> }
</div>


  )
}