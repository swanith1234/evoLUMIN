// import React, { useState, useEffect } from "react";
// import Avatar from "@mui/material/Avatar";
// import EditIcon from "@mui/icons-material/Edit";
// import "./LeftProfile.css";
// import farmer from "../../assets/farmer.jpg";

// const LeftProfile = () => {
//   const [user, setUser] = useState({
//     name: "Srinu",
//     profilePic: "../../assets/farmer",
//   });

//   useEffect(() => {

//   }, []);

//   return (
//     <div className="left-profile">

//       <div className="profile-section">
//         <Avatar
//           alt={user.name}
//           src={user.profilePic}
//           className="profile-avatar"
//         />
//         <div className="profile-welcome">
//           <h2>{`Welcome, ${user.name}!`}</h2>
//           <button className="add-photo-btn">
//             <EditIcon fontSize="small" /> Add a photo
//           </button>
//         </div>

//       </div>

//       <hr className="divider" />
//       <div className="profile-links">
//         <a href="/my-posts">My Posts</a>
//         <a href="/saved-posts">Saved Posts</a>
//         <a href="/liked-posts">Liked Posts</a>
//       </div>


//     </div>
//   );
// };

// export default LeftProfile;


import React from 'react'
import  { useState, useEffect,useContext } from "react";
import './LeftProfile.css';
import farmer from "../../assets/farmer.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../authContext";

 

const LeftProfile = () => {
  const { token, userInfo } = useContext(AuthContext);
  console.log("user",userInfo)

  return (
    <>
    <div className="left-profile">
         
      <div className="profile-section">
          <div>
          <img src={farmer} alt="" />
          </div>
         
        
        <div className="name">Welcome {userInfo.user.name}!</div>
        <button className="add-photo-btn">    
       <EditIcon fontSize="small" /> Add a photo
         </button>
      </div>

      <div className="sections">
       <div className="Myposts">My Posts</div>
       <div className="Saved-Posts">Saved Posts</div>
       <div className="Liked-Posts">Liked Posts</div>

       <button>Join Rooms</button>
      </div>

    </div>
    </>



  )
}

export default LeftProfile