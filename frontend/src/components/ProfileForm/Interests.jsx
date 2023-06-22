/** @format */

import React from "react";
import { connect } from "react-redux";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import { ImSpinner2 } from "react-icons/im";
import { userLogin } from "../../redux/user/user.actions";
import { useTranslation } from "react-i18next";
import { BsCheckCircleFill } from "react-icons/bs";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import { handleUpdateUserInterest } from "../../redux/_user/userSlice";

var selected = [];
const Interests = ({ setStep, token, user, handleIncrement }) => {
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const { t } = useTranslation(["common"]);
  const [isChecked, setIsChecked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  const [res, setRes] = React.useState(null);
  const [interestsArr, setInterestsArr] = React.useState([]);

  const handleOnChange = (e) => {
    setIsChecked(!isChecked);

    if (e.target.checked) {
      console.log(e.target.checked);
      if (!selected.includes(e.target.value)) {
        selected.push(e.target.value);
        console.log(selected);
      }
    } else {
      selected.filter((value) => value === e.target.value);
    }
  };

  const handleupdatedInterest = async () => {
    setIsLoading(true);
    const data = { handleUn: isUser.handleUn, isToken, interestsArr };
    await dispatch(handleUpdateUserInterest(data));
    try {
      console.log("GONE >> ");
      // setRes(result);
      setStep((prev) => prev + 1);
      setIsLoading(false);
      handleIncrement();
    } catch (error) {
      console.log("Error!! ");
    }
  };

  React.useEffect(() => {
    if (interestsArr.length >= 2) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [interestsArr]);

  return (
    <div className='profile_iupdate_container'>
      <div className='update_form_title'>
        {t("Select your favourite topics")}:
      </div>
      <div className='form_container'>
        <div
          className='checkbox_form'
          onClick={() => setInterestsArr((prev) => [...prev, "Cricket"])}>
          {interestsArr.includes("Cricket") ? (
            <div>
              <BsCheckCircleFill className='chekcked_box_icon' />
            </div>
          ) : (
            <div className='empty_check_box'></div>
          )}
          <div className='check_box_title'>{t("Cricket")}</div>
        </div>

        {/* football */}
        <div
          className='checkbox_form'
          onClick={() => setInterestsArr((prev) => [...prev, "Football"])}>
          {interestsArr.includes("Football") ? (
            <div>
              <BsCheckCircleFill className='chekcked_box_icon' />
            </div>
          ) : (
            <div className='empty_check_box'></div>
          )}
          <div className='check_box_title'>{t("Football")}</div>
        </div>

        {/* Crypto */}
        <div
          className='checkbox_form'
          onClick={() => setInterestsArr((prev) => [...prev, "Crypto"])}>
          {interestsArr.includes("Crypto") ? (
            <div>
              <BsCheckCircleFill className='chekcked_box_icon' />
            </div>
          ) : (
            <div className='empty_check_box'></div>
          )}
          <div className='check_box_title'>{t("Crypto")}</div>
        </div>

        {/* NFT */}
        <div
          className='checkbox_form'
          onClick={() => setInterestsArr((prev) => [...prev, "NFT"])}>
          {interestsArr.includes("NFT") ? (
            <div>
              <BsCheckCircleFill className='chekcked_box_icon' />
            </div>
          ) : (
            <div className='empty_check_box'></div>
          )}
          <div className='check_box_title'>{t("NFT")}</div>
        </div>

        {/* Quiz */}
        <div
          className='checkbox_form'
          onClick={() => setInterestsArr((prev) => [...prev, "Quiz"])}>
          {interestsArr.includes("Quiz") ? (
            <div>
              <BsCheckCircleFill className='chekcked_box_icon' />
            </div>
          ) : (
            <div className='empty_check_box'></div>
          )}
          <div className='check_box_title'>{t("Quiz")}</div>
        </div>
      </div>
      <div className='modal_btn_container'>
        {!isDisable && (
          <button onClick={handleupdatedInterest} className='next_btn'>
            {isLoading ? (
              <ImSpinner2 className='spinner_icon' />
            ) : (
              <>{t("Next")}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default Interests;
