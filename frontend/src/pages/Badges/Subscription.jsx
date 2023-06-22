/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import LoaderIndicator from "../../components/LoaderIndicator/LoaderIndicator";
import VerificationModal from "../../components/modal/verificationModal";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import ModalComp from "../../components/modal/ModalComp";
import CustomModal from "../../components/modal/CustomModal";

const Subscription = ({ user, token }) => {
  const { t } = useTranslation(["common"]);
  const [verify, setVerify] = React.useState(false);
  const [isResponse, setIsResponse] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // *** Verify profile
  const verifyProfile = () => {
    setIsLoading(true);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/users/verify/profile/`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setIsResponse(true);
        setResponseMsg(response.data.msg);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleCloseModal = () => {
    setVerify(false);
    setOpenModal(false);
  };

  return (
    <div className='subscription_container'>
      {verify && (
        <CustomModal
          title='Profile verification'
          onClose={handleCloseModal}
          body={
            <React.Fragment>
              {isResponse ? (
                <div className='modal_body_text'>{responseMsg}</div>
              ) : (
                <div className='modal_body_text'>
                  {t("Verify your profile by click on the verify button")}
                </div>
              )}
            </React.Fragment>
          }
          footer={
            <React.Fragment>
              {!isResponse ? (
                <div className='__modal_footer'>
                  <button
                    className={"__modal_footer_btn"}
                    onClick={() => verifyProfile()}>
                    {isLoading ? (
                      <span class='icon-loading spinner'></span>
                    ) : (
                      <>Verify</>
                    )}
                  </button>
                </div>
              ) : null}
            </React.Fragment>
          }
        />
      )}
      {openModal && (
        <CustomModal
          title='Subscription'
          onClose={handleCloseModal}
          body={<div>Buy coin</div>}
          footer={
            <div className='__modal_footer'>
              <button
                className={"__modal_footer_btn"}
                onClick={() => verifyProfile()}>
                {isLoading ? <LoadingIcon className='spinner' /> : <>Verify</>}
              </button>
            </div>
          }
        />
      )}
      {/* Validate Email */}
      <div className='cc_condt1'>
        <div>
          <LoaderIndicator
            remaining={user.isVerified ? 0 : 100}
            complete={user.isVerified ? 100 : 0}
          />
        </div>
        <div>
          <span className='sub_header'>Account verification</span>
          <br />
          {user.isVerified ? (
            <span className='re_sub_header'>
              Your account has been verified
            </span>
          ) : (
            <span className='re_sub_header'>
              You can verify your account by click on the{" "}
              <button
                className='email_verification_btn'
                onClick={() => setVerify(true)}>
                click here
              </button>
            </span>
          )}
        </div>
      </div>

      <div className='cc_condt1'>
        <div>
          <LoaderIndicator remaining={100} complete={0} />
        </div>

        <div>
          <span className='sub_header'>Pro user account</span>
          <br />
          <span className='re_sub_header'>
            To became a pro user you have to buy 1000 coins/month pack
            <br />
            <button className='pay_button' onClick={() => setOpenModal(true)}>
              <AiOutlineSend className='send_icon' />
              Pay 1000 coin
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
