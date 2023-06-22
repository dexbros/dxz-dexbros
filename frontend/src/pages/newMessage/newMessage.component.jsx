import * as React from "react";
import { connect } from "react-redux";

import { setPageType } from '../../redux/page/page.actions';

import MainLayout from '../../layouts/main-layout.component';


function NewMessagePage({ setPageType }) { 

    React.useLayoutEffect(() => {
        setPageType('social');
        },[]);
  return (
      	<MainLayout>
              <div className="chatPageContainer">
                  <div className="chatTitleBar">
                      <label htmlFor="userSearchTextbox">To:</label>
                      <div id="selectedUsers">
                          <input type="text" id="userSearchTextbox" placeholder="Type the name of the person" />
                      </div>
                  </div>
                  <div className="resultsContainer"></div>
                  <button id="createChatButton" disabled>Create Chat</button>
              </div>
      	</MainLayout>
  );
}

const mapDispatchToProps = dispatch => ({
    setPageType: (pageType) => dispatch(setPageType(pageType))
})

export default connect(null, mapDispatchToProps)(NewMessagePage);