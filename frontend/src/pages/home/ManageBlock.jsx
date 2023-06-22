/** @format */

import React from "react";
import CompOne from "../../components/carousel/CompOne";
import CompTwo from "../../components/carousel/CompTwo";
import CompThree from "../../components/carousel/CompThree";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
const ManageBlock = () => {
  const [step, setStep] = React.useState(0);
  const [stepInterval, setStepInterval] = React.useState(null);
  const sliderArr = [<CompOne />, <CompTwo />, <CompThree />];

  React.useEffect(() => {
    const interval = setTimeout(() => {
      if (step < 2) {
        setStep((prev) => prev + 1);
      } else {
        setStep(0);
      }
    }, 10000);

    setStepInterval(interval);
  }, [step]);

  const handleBack = () => {
    if (step === 0) {
      setStep(2);
    } else {
      setStep((prev) => prev - 1);
    }

    if (stepInterval) {
      clearTimeout(stepInterval);
    }
  };

  const handleForward = () => {
    if (step === 2) {
      setStep(0);
    } else {
      setStep((prev) => prev + 1);
    }

    if (stepInterval) {
      clearTimeout(stepInterval);
    }
  };

  const handleSetPage = (value) => {
    setStep(value);
    if (stepInterval) {
      clearTimeout(stepInterval);
    }
  };
  return (
    <div className='manage_block_container'>
      <React.Fragment>{sliderArr[step]}</React.Fragment>

      <button className='left_carousel_btn' onClick={handleBack}>
        <BiLeftArrow />
      </button>

      <button className='right_carousel_btn' onClick={handleForward}>
        <BiRightArrow />
      </button>

      <div className='casourel_btn_container'>
        <button
          className='slider_btn'
          onClick={() => handleSetPage(0)}></button>
        <button
          className='slider_btn'
          onClick={() => handleSetPage(1)}></button>
        <button
          className='slider_btn'
          onClick={() => handleSetPage(2)}></button>
      </div>
    </div>
  );
};

export default ManageBlock;
