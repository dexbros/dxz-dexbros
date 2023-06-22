import React from 'react';
import LoaderIndicator from '../../components/LoaderIndicator/LoaderIndicator';
import VerificationModal from "../../components/modal/verificationModal";
import { useTranslation } from "react-i18next";
import { ReactComponent as CompleteIcon } from "../../Assets/Icons/complete.svg";
import { BiAddToQueue } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import ModalComp from '../../components/modal/ModalComp';

const social_medias = ['Twitter', "Facebook", "Instagram", "Reddit"];


const PublicFigure = ({ user, token }) => {
  const { t } = useTranslation(["common"]);
  const [verify, setVerify] = React.useState(false);
  const [isResponse, setIsResponse] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState("");
  const [isDisableName, setIsDisableName] = React.useState(true);
  const [isDisableEmail, setIsDisableEmail] = React.useState(true);
  const [isDisableLink, setIsDisableLink] = React.useState(true);
  const [formValue, setFormValue] = React.useState([{ social: "", email: "", link: "" }]);
  const [menuList, setMenuList] = React.useState([])
  const [isResult, setIsResult] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState('');
  const [isType, setIsType] = React.useState(false);
  const temp = [];
  const array1 = [];

  // *** Verify profile
  const verifyProfile = () => {
    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/users/verify/profile/`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        console.log((response.data));
        setIsResponse(true);
        setResponseMsg(response.data.msg)
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  // *** Handle input change
  const handleInputChange = (i, e) => {
    let newFormValues = [...formValue];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValue(newFormValues);
  }

  // *** Add new form fields
  let addFormFields = () => {
    setFormValue([...formValue, { social: "", email: "", link: "" }]);
  };

  // *** Remove existing form fields
  const removeFormFields = (index) => {
    // alert(index)
    const lists = [...formValue];
    lists.splice(index, 1);
    setFormValue(lists)
  };

  const addToSelect = (i, e) => {
    let newFormValues = [...formValue];
    newFormValues[i].social = e.target.id;
    console.log(newFormValues)
    setFormValue(newFormValues);
    setIsDisableName(true)
  }

  const handleSearch = (e) => {
    for (let i = 0; i < social_medias.length; i++) {
      if (social_medias[i].toLocaleLowerCase().includes(e.target.value)) {
        temp.push(social_medias[i]);
      }
    }
    setMenuList(temp)
  }

  const handlePush = (id) => {
    if (!array1.includes(id)) {
      setIsDisableName(false)
      array1.push(id);
    }
  }

  const handleSubmit = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "links": formValue
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/users/social/links`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log((response.data));
      })
      .catch(function (error) {
        console.log(error);
        setIsResult(true)
        setResponseMsg(error.response.data.msg)
      });

  };
  

  return (
    <div className='public_figure_container'>
      {
        isResult &&
        <ModalComp onClose={setIsResult} body={
          <span style={{ 'color': 'crimson' }}>{responseMsg}</span>
        } />
      }
      {
        verify &&
        <VerificationModal
          onClose={() => setVerify(false)}
          style={isResponse ? "__modal verification_modal_response" : "__modal verification_modal"}
          modal_close_btn={isResponse ? "close_modal_icon_response" : "vclose_modal_icon"}
          title={t("Profile Verification")}
          body={
            isResponse ?
              <div className="verification_profile_body">{responseMsg}</div> :
              <div className="verification_profile_body">{t("Verified your profile")}</div>
          }
          footer={
            isResponse ?
              <div className="verification_profile_footer">
                <button className="verify_btn" onClick={() => setVerify(true)}>Close</button>
              </div> :
              <div className="verification_profile_footer">
                <button className="verify_btn" onClick={() => verifyProfile()}>Verify</button>
              </div>
          }
        />
      }
      {/* Validate Email */}
      <div className='cc_condt1'>
        <div>
          <LoaderIndicator remaining={user.isVerified ? 0 : 100} complete={user.isVerified ? 100 : 0} />
        </div>
        <div>
          <span className='sub_header'>
            Account verification
          </span>
          <br />
          {
            user.isVerified ? <span className='re_sub_header'>Your account has been verified</span> :
              <span className='re_sub_header'>
                You can verify your account by click on the <button className='email_verification_btn' onClick={() => setVerify(true)}>click here</button>
              </span>
          }
        </div>
      </div>

      <div className='inputs_container'>
        {
          formValue.map((element, index) => (
            <div className='form_box' key={index}>
              {/* Enter social media name */}
              <div className='form_input_box'>
                {
                  !isDisableName &&
                  <label className='input_label_text'>Enter name of the platform</label>
                }
                <br />
                <input
                  type="text"
                  name="social"
                  placeholder={isDisableName ? 'Enter platform name' : ""}
                  className='input_social'
                  value={element.social}
                  autoComplete="off"
                  id={index}
                  onChange={e => handleInputChange(index, e)}
                  onFocus={(e) => handlePush(e.target.id)}
                  onKeyDown={(e) => handleSearch(e)}
                />

                {/* Rendering list */}
                {
                  (!array1.includes(index.toString()) && !isDisableName) &&
                  <>
                    {
                      element.social.trim() ?
                        <div className='menu_container'>
                          {
                            menuList.map((value, i) => (
                              <div key={i} className="menu_item_list" id={value} onClick={(e) => addToSelect(index, e)}>{value}</div>
                            ))
                          }
                        </div> :
                        <div className='menu_container'>
                          {
                            social_medias.map((value, i) => (
                              <div key={i} className="menu_item_list" id={value} onClick={(e) => addToSelect(index, e)}>{value}</div>
                            ))
                          }
                        </div>
                    }
                  </>
                }
              </div>
              
              {/* Enter phone or email */}
              <div className='form_input_box'>
                {
                  !isDisableEmail &&
                  <label className='input_label_text'>Enter email/phone</label>
                }
                <br />
                <input
                  type="text"
                  name="email"
                  placeholder={isDisableEmail ? 'Enter email/phone' : ""}
                  className='input_social'
                  value={element.email}
                  autoComplete="off"
                  onChange={e => handleInputChange(index, e)}
                  onFocus={() => setIsDisableEmail(false)}
                  onBlur={() => setIsDisableEmail(true)}
                />
              </div>
              <span className='input_span'>Enter that email or phone number which is used in that social media platform</span>
              {/* Enter social link */}
              <div className='form_input_box'>
                {
                  !isDisableLink &&
                  <label className='input_label_text'>
                    Enter social account link
                  </label>
                }
                <br />
                <input
                  type="text"
                  name="link"
                  placeholder={isDisableLink ? 'Enter social link' : ""}
                  className='input_social'
                  value={element.link}
                  autoComplete="off"
                  onChange={e => handleInputChange(index, e)}
                  onFocus={() => setIsDisableLink(false)}
                  onBlur={() => setIsDisableLink(true)}
                />
              </div>
              <span className='input_span'>Enter your account link</span>

              <div className='form_buttons'>
                {/* Add more forms */}
                <button
                  className={formValue.length == 4 ? 'disable_addMore_form' : 'addMore_form'}
                  onClick={() => addFormFields()}
                >
                  <BiAddToQueue />
                </button>
                {/* Remove form button */}
                {
                  index > 0 &&
                  <button className={'delete_form'} onClick={() => removeFormFields(index)}><MdDeleteOutline /></button>
                }
              </div>
              
            </div>
          ))
        }
        <div className='footer_btn'>
          <button className="button_submit" type="submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
};

export default PublicFigure