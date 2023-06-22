import React from "react";
import { connect } from "react-redux";
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from "../../layouts/main-layout.component";
import axios from "axios";

const FullHistory = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState([]);
  
  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL_LINK}api/posts/fetch/donate/history/${id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        console.log(res.data);
        setUserList(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [id]);


  const handleRedirect = () => {
    navigate(`/view/history/${id}`);
  }

  return (
    <MainLayout  goBack={true} title={"History"}>
      <div className="full_history_container">
        {
          (userList || []).length > 0 ?
            <>
            {
              userList.map(data => (
                <div className='history_card' key={data.id} onClick={() => navigate(`/view/full/details/${data.id}`)}>
                  <div className='main_history_box'>
                    {/* Image */}
                    <span className='history_text'>Receive from{" "}</span>
                    <span className='historyuser_name'>{data.s_name}</span><br />
                    <span className='earning_date'>
                      {new Date(Number(data.id)).getDate()}-{new Date(Number(data.id)).getMonth() + 1}-{new Date(Number(data.id)).getFullYear()}
                    </span>
                  </div>
                  <span className='earn_amount'>{data.amount}</span>
                </div>
              ))
            }
            </> :
            <div className='empty_history'>No history present</div>
        }
      </div>
    </MainLayout>
  )
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})
  
const mapDispatchToProps = dispatch => ({
  setPageType: (type) => dispatch(setPageType(type)),
  login: (user, token) => dispatch(userLogin(user, token)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(FullHistory);