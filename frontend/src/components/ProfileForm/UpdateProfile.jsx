/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { ImSpinner2 } from "react-icons/im";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { updateProfileHandle } from "../../redux/_user/userSlice";

const UpdateProfile = ({ setStep, token, user, handleIncrement }) => {
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const dispatch = useDispatch();

  const [name, setName] = React.useState("");
  const [log_un, setLogUn] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { t } = useTranslation(["common"]);
  const [gender, setGender] = React.useState("not");

  // *** Check for required input fields
  React.useEffect(() => {
    if (!name.trim() || !log_un.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, log_un]);

  const updateProfileHandler = async () => {
    setIsLoading(true);
    const data = { handleUn: isUser.handleUn, isToken, name, log_un, gender };
    await dispatch(updateProfileHandle(data));
    try {
      console.log("GONE >> ");
      setStep((prev) => prev + 1);
      setIsLoading(false);
      setIsDisable(true);
      setName("");
      setLogUn("");
      handleIncrement();
    } catch (error) {
      console.log("Error");
      setError("Something went wrong");
    }
  };

  return (
    <div className='profile_iupdate_container'>
      <div className='update_form_title'>
        {t("Update basic profile details")}
      </div>
      <div className='form_container'>
        {/* Name */}
        <input
          type='text'
          placeholder={t("EnterName")}
          className='stepper_form_input'
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        {/* LogUser name */}
        <input
          type='text'
          placeholder={t("EnterlogUn")}
          className='stepper_form_input'
          value={log_un}
          required
          onChange={(e) => setLogUn(e.target.value)}
        />
        <div className='radio_sectio'>
          <span className='radio_section_header'>{t("Select gender")}:</span>
          <br />

          <div className='radio_box'>
            <div className='radio_button' onClick={() => setGender("male")}>
              {gender === "male" ? (
                <BiRadioCircleMarked className='radio_icon' />
              ) : (
                <BiRadioCircle className='radio_icon' />
              )}
              {t("Male")}
            </div>

            {/* Female */}
            <div className='radio_button' onClick={() => setGender("female")}>
              {gender === "female" ? (
                <BiRadioCircleMarked className='radio_icon' />
              ) : (
                <BiRadioCircle className='radio_icon' />
              )}
              {t("Female")}
            </div>

            {/* Female */}
            <div className='radio_button' onClick={() => setGender("not")}>
              {gender === "not" ? (
                <BiRadioCircleMarked className='radio_icon' />
              ) : (
                <BiRadioCircle className='radio_icon' />
              )}
              {t("Not interested")}
            </div>
          </div>
        </div>
      </div>

      <div className='modal_btn_container'>
        {!isDisable && (
          <button className='stepper_next_btn' onClick={updateProfileHandler}>
            {isLoading ? <ImSpinner2 className='spinner' /> : <>{t("Next")}</>}
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
});

export default UpdateProfile;
