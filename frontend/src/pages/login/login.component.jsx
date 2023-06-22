/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // updated imports

import { login } from "../../redux/_user/userSlice"; // Updated import
import { selectResponse, selectLoading } from "../../redux/_user/userSelectors"; // Updated import

import "./login.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Login() {
  const dispatch = useDispatch(); // use useDispatch hook
  const isLoading = useSelector(selectLoading); // use useSelector hook
  const isResponse = useSelector(selectResponse); // use useSelector hook

  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (!logUsername.trim() || !logPassword) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [logUsername, logPassword]);

  const handleSubmit = () => {
    const userData = {
      logUsername: logUsername,
      logPassword: logPassword,
    };

    dispatch(login(userData)); // use dispatch function from useDispatch
  };

  useEffect(() => {
    // Handle response here
    if (isResponse.type === "success") {
      setLogPassword("");
      setLogUsername("");
      setIsDisable(true);
    } else if (isResponse.type === "error") {
      setLogPassword("");
      setLogUsername("");
      setIsDisable(true);
    }
  }, [isResponse.type]);

  return (
    <div className='login_container'>
      <div className='login_section'>
        <h1 className='login_header_text'>Login</h1>
        <br />
        {isResponse === "error" ? (
          <div className='register_form_error_msg'>{isResponse.message}</div>
        ) : (
          ""
        )}

        <div className='__login_form'>
          <input
            type='text'
            className='__input_field'
            placeholder='Enter Username or Email'
            value={logUsername}
            onChange={(e) => setLogUsername(e.target.value)}
          />
          <br />

          <input
            type='password'
            className='__input_field'
            placeholder='Enter Password'
            value={logPassword}
            onChange={(e) => setLogPassword(e.target.value)}
          />
          <br />

          <button
            className={
              isDisable ? "__logibn_btn __disable_btn" : "__logibn_btn"
            }
            onClick={handleSubmit}
            disabled={isDisable}>
            {isLoading ? (
              <AiOutlineLoading3Quarters className='loading_icon' />
            ) : (
              <>Login</>
            )}
          </button>
          <br />
          <div className='__link'>
            <Link to='/register'>Don't have an account? Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   isLoading: selectors.selectLoading(state),
//   responseType: selectors.selectResponse(state).type,
//   response: selectors.selectResponse(state).message,
// });

// const mapDispatchToProps = (dispatch) => ({
//   login: (data) => dispatch(login(data)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login; // updated export
