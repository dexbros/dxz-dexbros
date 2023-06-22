import React,{useState, useEffect} from 'react';
import MainLayout from "../../layouts/main-layout.component";
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogin } from '../../redux/user/user.actions';
import axios from "axios";
import Tab from "../../components/Tab/Tab";
// import Like from "../../Assets/like.png";
// import Emoji from "../../Assets/emoji.png";
// import Wow from "../../Assets/wow.png";
// import Angel from "../../Assets/angel.png";
// import Party from "../../Assets/party.png";
// import Crying from "../../Assets/crying.png"
// import Angry from "../../Assets/angry.png";
import intToString from "../../utils/PostCount";
import UserComponent from "../../components/user/UserComponent";
import "./PostLink.css";
import { setPageType } from "../../redux/page/page.actions";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";


const PostLikeDislike = ({ token, user, login, setPageType }) => {
  const { id } = useParams();
  const [isActive, setIsActive] = React.useState('like');
  const [postData, setPostData] = useState(null);

  React.useLayoutEffect(() => {
    setPageType('social');
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        setPostData(res.data);
        console.log(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [id]);


  return (
    <MainLayout goBack={true} title={
      <HeaderTitle
        content={"Post likes"}
      />
    }>
      {
        postData ?
          <>
            {/* Header */}
            {/* <div className='post_page_header'>
              <li className={isActive === 'like' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('like')}>
                <img src={Like} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.like.length) || '0'}</span>
              </li>

              <li className={isActive === 'emoji' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('emoji')}>
                <img src={Emoji} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.emoji.length) || '0'}</span>
              </li>

              <li className={isActive === 'party' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('party')}>
                <img src={Party} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.party.length) || '0'}</span>
              </li>

              <li className={isActive === 'wow' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('wow')}>
                <img src={Wow} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.wow.length) || '0'}</span>
              </li>

              <li className={isActive === 'angel' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('angel')}>
                <img src={Angel} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.angel.length) || '0'}</span>
              </li>

              <li className={isActive === 'crying' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('crying')}>
                <img src={Crying} className="reaction_list_image" />
                <span className='reaction_count'>{intToString(postData.reactions.crying.length) || '0'}</span>
              </li>

              <li className={isActive === 'angry' ? '__list_image __list_image_active' : '__list_image'} onClick={() => setIsActive('angry')}>
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
          </> :
          <>Loading...</>
      }
    </MainLayout>
  )
};

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})
  
const mapDispatchToProps = dispatch => ({
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  login: (user, token) => dispatch(userLogin(user, token))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(PostLikeDislike);