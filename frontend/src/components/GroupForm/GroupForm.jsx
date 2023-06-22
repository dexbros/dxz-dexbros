/** @format */

import React from "react";
import NormalForm from "./NormalForm";
import SmallDeviceForm from "./SmallDeviceForm";

const GroupForm = ({ createEventDetails, group }) => {
  return (
    <div className='block_post_form'>
      <NormalForm />
      <div className='small_device_form'>
        <SmallDeviceForm
          createEventDetails={createEventDetails}
          group={group}
        />
      </div>
    </div>
  );
};

export default GroupForm;
