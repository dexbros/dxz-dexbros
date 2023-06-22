import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from "react-redux";
import MyLoader from '../../components/Loader/Loader';
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import { useParams, Link } from "react-router-dom";
import "./ProfileMedia.css";
import { BsEyeFill } from "react-icons/bs";
import Tooltip from "../../components/Tooltip/Tooltip"

const ProfileMedia = ({ user, token }) => {
  const { handleUn } = useParams();
  const [loader, setLoader] = useState(false);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/profile/media/${handleUn}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setMedias(result)
      })
      .catch(error => console.log('error', error));
  }, [token, handleUn, user]);
  
  return (
    <div className='profile_media_container'>
      {
        loader ?
          <MyLoader /> :
          <div>
            {
              (medias || []).length > 0 ?
                <div className='media_container'>
                  {
                    medias.map(media => (
                      <div className='media' key={media._id}>
                        <Link to={`/full/post/${media.postId}`} className='media_content'>
                          {
                            media.image !== '' &&
                            <img src={media.image} className="__image" />
                          }
                          {
                            media.video !== '' &&
                            <video src={media.video} className="__video" />
                          }
                          <div>
                            <Link to={`/full/post/${media.postId}`}  className='view_btn'>
                              <Tooltip content="View Post" direction="bottom">
                                <BsEyeFill />
                              </Tooltip>
                            </Link>
                          </div>
                        </Link>
                      </div>
                    ))
                  }
                </div> :
                <p>No photo/video found</p>
            }
          </div>
      }
    </div>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMedia);


{/* <Link to={`/full/post/${media.postId}`} key={media._id}>
                      {
                        media.image !== '' &&
                        <img src={media.image} className="image" />
                      }
                      {
                        media.video !== '' &&
                        <video src={media.video} className="video" />
                      }
                    </Link> */}