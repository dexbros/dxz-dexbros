import React from "react";
import { Link } from 'react-router-dom';


function Advertisement() {

    return (
    <div className={`post`}>
                <div className='mainContentContainer'>
                    <div className='userImageContainer'>
                        <img src={`http://localhost:5000/images/profilePic.jpeg`} />
                    </div>
                    <div className='postContentContainer'>
                        <div className='header'>
                            <Link className='displayName' to={`/profile`}>
                                Grey Mirror
                            </Link>
                            <span className='username'>@grey_mirror</span>
                            <span className='date'>5 days ago</span>                       
                        </div>
                        <div className='postBody'>
                            <h1 className="advertisement">We Need Developers</h1>
                        </div>
                    </div>
                </div>
            </div> 
            )
}

export default Advertisement;
