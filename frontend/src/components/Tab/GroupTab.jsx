import React,{useState} from "react";
// import GroupPost from "../Group.Post.component/GroupPost";
import GroupInfo from "../Group.Info/GroupInfo"
import "./Tab.css";


const Tabs = ({user, token, groupPost, group}) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };

  return (
    <div className="tab_container">
      <div className="Tabs">
        {/* Tab nav */}
        <ul className="nav">

          <li className={activeTab === 'tab1' ? "list_item active_tab" : "list_item"} onClick={handleTab1}>Posts</li>

          <li className={activeTab === 'tab2' ? "list_item active_tab" : "list_item"} onClick={handleTab2}>Group Info</li>
        </ul>
        <div className="outlet">
          
        </div>
      </div>
    </div>
  );
};
export default Tabs;