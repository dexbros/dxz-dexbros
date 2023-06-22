/** @format */

import React, { useState, useEffect } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { register, clearMessages } from "../../redux/_user/userSlice";
import {
  selectLoading,
  selectResponse,
  selectUser,
  selectToken,
} from "../../redux/_user/userSelectors";

//component function
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //redux selectors
  const isLoading = useSelector(selectLoading);
  const isResponse = useSelector(selectResponse);
  const isUser = useSelector(selectUser);
  const isToken = useSelector(selectToken);

  //for default local state manipulation
  const [email, setEmail] = useState("");
  const [handleUn, setHandleUn] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [showLocalMsg, setShowLocalMsg] = useState(false);
  const [localMsg, setLocalMsg] = useState("");

  useEffect(() => {
    if (
      !email.trim() ||
      !handleUn.trim() ||
      !password.trim() ||
      !cpassword.trim()
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setIsDisable(true);
        setShowLocalMsg(true);
        setLocalMsg("Invalid email");
      } else {
        setIsDisable(false);
        if (password !== cpassword) {
          setShowLocalMsg(true);
          setIsDisable(true);
          setLocalMsg("Password and confirm password did not match");
        } else {
          setShowLocalMsg(false);
          setIsDisable(false);
        }
      }
    }
  }, [email, handleUn, password, cpassword]);

  const handleRegister = () => {
    const user = { email, password, username: handleUn };
    dispatch(register(user));
  };

  useEffect(() => {
    if (isResponse.type === "success") {
      console.log(isUser);
      console.log("token", isToken);
      setTimeout(() => {
        navigate("/");
      }, 20000); // waits 10 seconds before navigating
    } else if (isResponse.type === "error") {
      setTimeout(() => {
        dispatch(clearMessages()); // Clear error messages in 10 seconds
      }, 10000);
    }
  }, [isResponse.type, navigate]);

  useEffect(() => {
    // This function will be called when the component is about to unmount
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  return (
    <div className='__registerPage'>
      <div className='register_form_section'>
        <div className='register_form_header_section'>
          <div className='register_form_header_text'>SignUp</div>
          {isResponse.message && (
            <div className={isResponse.type}>{isResponse.message}</div>
          )}
          {showLocalMsg && (
            <div className='register_form_error_msg'>{localMsg}</div>
          )}
        </div>

        <div className='register_form_section'>
          <input
            type='email'
            placeholder='Enter Email'
            className='__input_field'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='text'
            placeholder='Enter Handle Username'
            className='__input_field'
            value={handleUn}
            onChange={(e) => setHandleUn(e.target.value)}
          />

          <input
            type='password'
            placeholder='Enter Password'
            className='__input_field'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type='password'
            placeholder='Enter Confirm Password'
            className='__input_field'
            value={cpassword}
            onChange={(e) => setCPassword(e.target.value)}
          />
        </div>

        <div className='auth_btn_container'>
          {!isDisable && (
            <button className='__logibn_btn' onClick={handleRegister}>
              {isLoading ? (
                <span className='icon-loading spinner'>registering...</span>
              ) : (
                <>Register</>
              )}
            </button>
          )}
        </div>

        <div className='register_links_section'>
          <Link to='/' className='__login_link'>
            Already have an account?
          </Link>
        </div>

        <div className='register_links_section'>
          <Link to='/' className='__login_link'>
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
