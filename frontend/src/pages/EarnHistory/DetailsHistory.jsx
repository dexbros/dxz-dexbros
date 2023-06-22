import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from "react-redux";
import MainLayout from "../../layouts/main-layout.component";
import axios from "axios";
import UserAvatar from "../../Assets/userAvatar.webp"

const DetailsHistory = ({ token }) => {
  const { id } = useParams();
  const [details, setDetails] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL_LINK}api/posts/fetch/single/details/${id}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => {
        console.log(res.data);
        setDetails(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [id]);
  
  
  return (
    <MainLayout goBack={true} title={"Earning details"}>
      {
        details ?
          <div className='details_container'>
            {/* Sender details */}
            <div className='sender_details_container'>
              <div className='sender_box'>
                <img src={details.s_pic || UserAvatar} className="user_avatar" />
                <span className='sender_name'>{details.s_name}</span>
                <br />
                <span className='date'>
                  {new Date(Number(details.id)).getDate()}-{new Date(Number(details.id)).getMonth() + 1}-{new Date(Number(details.id)).getFullYear()}{"  "}{new Date(Number(details.id)).getHours()}:
                  {new Date(Number(details.id)).getMinutes()} {new Date(Number(details.id)).getHours() > 12 ? "pm" : "am"}
                </span>
              </div>
              <span className='amount'>{details.amount}</span>
            </div>

            {/* Payment details */}
            <div className='payment_details_container'>
              <span className='sub_header'>Payment details</span>
              <div className='payment_details_box'>
                <span className='details_sub_header'>Transaction ID: </span><br />
                
                <span className='details_sub_header'>Sender ID: <span className="details_earning_text">{details.s_handleUn}</span></span>
              </div>
            </div>

            {/* Custom message */}
            <div className='payment_details_container'>
              <span className='sub_header'>Custom message</span><br />
              {
                details.message ?
                  <span className='earn_message'>{details.message}</span> :
                  <span className='earn_message empty_earn_message'>No message available</span>
              }
            </div>
          </div> :
          <>Loading</>
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
  login: (user, token) => dispatch(userLogin(user, token)),
});
  
export default connect(mapStateToProps, null)(DetailsHistory);