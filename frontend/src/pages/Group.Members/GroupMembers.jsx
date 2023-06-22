import React,{useState, useEffect} from 'react';
import Layout from "../../layouts/main-layout.component"
import { connect } from 'react-redux';
import { userLogin } from '../../redux/user/user.actions';
import { useParams } from 'react-router-dom';
import Members from '../../components/Group.Members.List/Members';

const GroupMembers = ({ user, token }) => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}api/group/members/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        console.log(response.data)
        setMembers(response.data.members);
        setGroup(response.data.group);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);
  
  return (
    <Layout>
      {
        group &&
        <div className='="user_card_container'>
          {
            (members || []).length > 0 ?
              <div className='="user_card_container'>
                {
                  members.map(member => (
                    <Members key={member.u_id} member={member} group={group} />
                  ))
                }
              </div> : <>Loading</>
          }
        </div>
      }
    </Layout>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
});
export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);