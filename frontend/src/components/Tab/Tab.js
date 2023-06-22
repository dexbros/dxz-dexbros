import React,{useState} from "react";
import "./Tab.css";
// import TabOne from "./TabContent/Tab1";
// import TabTwo from "./TabContent/Tab2";
// import UserComponent from "../user/UserComponent";
// import Like from "../../Assets/like.png"
// import Emoji from "../../Assets/emoji.png"
// import Wow from "../../Assets/wow.png";
// import Party from "../../Assets/party.png"
// import Angel from "../../Assets/angel.png"
// import Crying from "../../Assets/crying.png";
// import Angry from "../../Assets/angry.png";



const Tabs = ({ post }) => {
  const [activeTab, setActiveTab] = useState("like");
  // console.log(post)

  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };

  console.log

  return (
    // <>
    //   {
    //     post &&
    //     <div className="tab_container">
    //       <div className="Tabs">
    //         {/* Tab nav */}
    //         <ul className="nav">
    //           {/* Like */}
    //           <li className={activeTab === 'like' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('like')}>
    //             <img src={Like} className="list_image" />
    //             <span className="tab_count">{post.reactions.like ? post.reactions.like.length : 0}</span>
    //           </li>
                
    //           {/* Heart */}
    //           <li className={activeTab === 'emoji' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('emoji')}>
    //             <img src={Emoji} className="list_image" />
    //             <span className="tab_count">{post.reactions.emoji ? post.reactions.emoji.length : 0}</span>
    //           </li>
                

    //           {/* Wow */}
    //           <li className={activeTab === 'wow' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('wow')}>
    //             <img src={Wow} className="list_image" />
    //             <span className="tab_count">{post.reactions.wow ? post.reactions.wow.length : 0}</span>
    //           </li>
                

    //           {/* Party */}
    //           <li className={activeTab === 'party' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('party')}>
    //             <img src={Party} className="list_image" />
    //             <span className="tab_count">{post.reactions.party ? post.reactions.party.length : 0}</span>
    //           </li>
                

    //           {/* Angel */}
    //           <li className={activeTab === 'angel' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('angel')}>
    //             <img src={Angel} className="list_image" />
    //             <span className="tab_count">{post.reactions.party ? post.reactions.angel.length : 0}</span>
    //           </li>
                
    //           {/* Crying */}
    //           <li className={activeTab === 'crying' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('crying')}>
    //             <img src={Crying} className="list_image" />
    //             <span className="tab_count">{post.crying ? post.crying.length : 0}</span>
    //           </li>
                
    //           {/* Angry */}
    //           <li className={activeTab === 'angry' ? "__list_item __list_item_active" : "__list_item"} onClick={() => setActiveTab('angry')}>
    //             <img src={Angry} className="list_image" />
    //             <span className="tab_count">{post.reactions.angry ? post.reactions.angry.length : 0}</span>
    //           </li>
                

    //         </ul>
    //         <div className="outlet">
    //           {
    //             activeTab === 'like' &&
    //             <>
    //               {
    //                 post.reactions.like.length > 0 ?
    //                   <>
    //                     {
    //                       post.reactions.like.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
                
    //           {/* EMOJI */}
    //           {
    //             activeTab === 'emoji' &&
    //             <>
    //               {
    //                 post.reactions.emoji.length > 0 ?
    //                   <UserComponent userData={post.emoji} /> :
    //                   <span>No Heart</span>
    //               }
    //             </>
    //           }
                
    //           {/* WOW */}
    //           {
    //             activeTab === 'wow' &&
    //             <>
    //               {
    //                 post.reactions.wow.length > 0 ?
    //                   <>
    //                     {
    //                       post.wow.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
                
    //           {/* Party */}
    //           {
    //             activeTab === 'party' &&
    //             <>
    //               {
    //                 post.reactions.party.length > 0 ?
    //                   <>
    //                     {
    //                       post.party.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
                
    //           {/* Angel */}
    //           {
    //             activeTab === 'angel' &&
    //             <>
    //               {
    //                 post.reactions.angel.length > 0 ?
    //                   <>
    //                     {
    //                       post.angel.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
                
    //           {/* Angel */}
    //           {
    //             activeTab === 'crying' &&
    //             <>
    //               {
    //                 post.reactions.crying.length > 0 ?
    //                   <>
    //                     {
    //                       post.crying.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
                
    //           {/* Angry */}
    //           {
    //             activeTab === 'angry' &&
    //             <>
    //               {
    //                 post.reactions.angry.length > 0 ?
    //                   <>
    //                     {
    //                       post.angry.map(user => (
    //                         <UserComponent key={user._id} userData={user} />
    //                       ))
    //                     }
    //                   </> :
    //                   <span>No Wow</span>
    //               }
    //             </>
    //           }
    //         </div>
    //       </div>
    //     </div>
    //   }
    // </>
    <>Tab</>
  );
};
export default Tabs;