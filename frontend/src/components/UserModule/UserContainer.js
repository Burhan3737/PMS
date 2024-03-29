import React from "react";

import { useState } from 'react'
import UserDetails from "./UserDetails";
import CreateUser from "./CreateUser";
function UserContainer (){
    
    
    
    const [flag,setFlag]=useState(0);
   
    
   
  
    
   if(flag===0){

      
        return(  <UserDetails onChange={()=>setFlag(1)}/>)
    }
    else if(flag===1){

         return(<CreateUser onChange={()=>setFlag(0)}/>)
    }
  
}


export default UserContainer