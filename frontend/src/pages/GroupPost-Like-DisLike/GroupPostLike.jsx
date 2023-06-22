import React from 'react';
import {connect} from "react-redux"
import Layout from "../../layouts/main-layout.component";
import { userLogin } from "../../redux/user/user.actions";
import { setPageType } from "../../redux/page/page.actions";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { useParams } from "react-router-dom";
// import Like from "../../Assets/like.png";
// import Emoji from "../../Assets/emoji.png";
// import Wow from "../../Assets/wow.png";
// import Angel from "../../Assets/angel.png";
// import Party from "../../Assets/party.png";
// import Crying from "../../Assets/crying.png"
// import Angry from "../../Assets/angry.png";
import "./Style.css"
import { useState } from 'react';
import intToString from "../../utils/PostCount";
import UserComponent from "../../components/user/UserComponent";
import "./GroupLike.css"

const GroupPostLike = ({ token, user, setPageType, login }) => {
  const [isActive, setIsActive] = React.useState('like');
  const [postData, setPostData] = useState(null)
  const { id } = useParams();
  React.useLayoutEffect(() => {
    setPageType('social');
  }, []);

  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPostData(result)
      })
      .catch(error => console.log('error', error));
  }, [id]);


  return (
    <Layout goBack={true} title={
      <HeaderTitle
        content={"Group post likes"}
      />
    }>
      {
        postData &&
        <>
          {/* Header */}
          {/* <div className='grouplike_page_header'>
            <li className={isActive === 'like' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('like')}>
              <img src={Like} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.like.length) || '0'}</span>
            </li>

            <li className={isActive === 'emoji' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('emoji')}>
              <img src={Emoji} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.emoji.length) || '0'}</span>
            </li>

            <li className={isActive === 'party' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('party')}>
              <img src={Party} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.party.length) || '0'}</span>
            </li>

            <li className={isActive === 'wow' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('wow')}>
              <img src={Wow} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.wow.length) || '0'}</span>
            </li>

            <li className={isActive === 'angel' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('angel')}>
              <img src={Angel} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.angel.length) || '0'}</span>
            </li>

            <li className={isActive === 'crying' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('crying')}>
              <img src={Crying} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.crying.length) || '0'}</span>
            </li>

            <li className={isActive === 'angry' ? 'group_list_image group_list_image_active' : 'group_list_image'} onClick={() => setIsActive('angry')}>
              <img src={Angry} className="reaction_list_image" />
              <span className='reaction_count'>{intToString(postData.reactions.angry.length) || '0'}</span>
            </li>
          </div> */}

          {/* Like*/}
          {
            isActive === 'like' &&
            <>
              {
                (postData.reactions.like || []).length > 0 ?
                  <>
                    {
                      postData.reactions.like.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> : <>No likes on this post</>
              }
            </>
          }

          {/* Heart*/}
          {
            isActive === 'emoji' &&
            <>
              {
                (postData.reactions.emoji || []).length > 0 ?
                  <>
                    {
                      postData.reactions.emoji.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }

          {/* Party*/}
          {
            isActive === 'party' &&
            <>
              {
                (postData.reactions.party || []).length > 0 ?
                  <>
                    {
                      postData.reactions.party.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }

          {/* Wow*/}
          {
            isActive === 'wow' &&
            <>
              {
                (postData.reactions.wow || []).length > 0 ?
                  <>
                    {
                      postData.reactions.wow.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }

          {/* Angel */}
          {
            isActive === 'angel' &&
            <>
              {
                (postData.reactions.angel || []).length > 0 ?
                  <>
                    {
                      postData.reactions.angel.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }

          {/* Angel */}
          {
            isActive === 'crying' &&
            <>
              {
                (postData.reactions.crying || []).length > 0 ?
                  <>
                    {
                      postData.reactions.crying.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }

          {/* Angel */}
          {
            isActive === 'angry' &&
            <>
              {
                (postData.reactions.angry || []).length > 0 ?
                  <>
                    {
                      postData.reactions.angry.map(userData => (
                        <UserComponent userData={userData} key={user._id} token={token} user={user} login={login} />
                      ))
                    }
                  </> :
                  <>No likes on this post</>
              }
            </>
          }
        </>
      }
    </Layout>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  login: (user, token) => dispatch(userLogin(user, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPostLike);
