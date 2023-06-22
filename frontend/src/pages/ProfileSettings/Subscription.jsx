/** @format */

import React from "react";
import { BiLinkExternal } from "react-icons/bi";

const SubscriptionSettings = ({ isLoadingPage, token }) => {
  return (
    <React.Fragment>
      {isLoadingPage ? (
        <>Loading....</>
      ) : (
        <div className='tab_page_container'>
          <div className='subscription_page'>
            <span className='subscription_txt'>Subscription page </span>
            <BiLinkExternal className='subscription_link' />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SubscriptionSettings;
