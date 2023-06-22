import React from 'react';
import MainLayout from '../../layouts/main-layout.component';
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { connect } from "react-redux";
import { useParams, Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { setPageType } from '../../redux/page/page.actions';
import { searchTerm } from "../../redux/user/user.actions";
import SearchList from "../../components/SearchList/SearchList";
import "./Search.css";
import PostSearchList from '../../components/SearchList/PostSearchList';
import BlockSearchList from '../../components/SearchList/BlockSearchList';


const MainSearch = ({ token, allSearch, allSearchBlock, allSearchPeople, allSearchPost, searchKey, setPageType }) => {
  const [search, setSearch] = React.useState("");
  const [activeState, setActiveState] = React.useState("all");

  React.useLayoutEffect(() => {
    setPageType('search')
  })

  
  return (
    <MainLayout goBack={true} title={"Search"}>
      <div className='main_search_container'>
        <div className='search_key_container'>Searching result for {searchKey}</div>
        {/* Tabs */}
        <div className='tab_container'>
          <ol className='tab_list'>
            <li
              onClick={() => setActiveState('all')}
              className={activeState === 'all' ? 'tab_item_text active_tab_list' : 'tab_item_text'}
            >
              All
            </li>

            <li
              onClick={() => setActiveState('block')}
              className={activeState === 'block' ? 'tab_item_text active_tab_list' : 'tab_item_text'}
            >
              Block
            </li>

            <li
              onClick={() => setActiveState('post')}
              className={activeState === 'post' ? 'tab_item_text active_tab_list' : 'tab_item_text'}
            >
              Post
            </li>

            <li
              onClick={() => setActiveState('people')}
              className={activeState === 'people' ? 'tab_item_text active_tab_list' : 'tab_item_text'}
            >
              People
            </li>

          </ol>
        </div>

        {/* Search list component */}
        <div className='search_list_component'>
          {/* All search result */}
          {
            activeState === 'all' &&
            <div className='all_search_list_container'>
              {/* Users Container */}
              {
                (allSearchPeople || []).length > 0 &&
                <div className='all_user_search_list_container'>
                  <span className='search_list_tag'>People</span>
                  <div className='search_list_content_lists'>
                    {
                      allSearchPeople.map(user => (
                        <SearchList key={user.u_id} data={user} isDelete={true} />
                      ))
                    }
                  </div>
                  <button className="serach_list_footer_btn" onClick={() => setActiveState('people')}>View all people</button>
                </div>
              }
            
              {/* Block Container */}
              {
                (allSearchBlock || []).length > 0 &&
                <div className='all_user_search_list_container'>
                  <span className='search_list_tag'>Block</span>
                  <div>
                    {
                      allSearchBlock.map(block => (
                        <BlockSearchList key={block.b_id} blockData={block} />
                      ))
                    }
                  </div>
                  <button className="serach_list_footer_btn" onClick={() => setActiveState('block')}>View all block</button>
                </div>
              }

            
              {/* Posts Container */}
              {
                (allSearchPost || []).length > 0 &&
                <div className='all_user_search_list_container'>
                  <span className='search_list_tag'>Post</span>
                  <div>
                    {
                      allSearchPost.map(post => (
                        <PostSearchList key={post.id} data={post} />
                      ))
                    }
                  </div>
                  <button className="serach_list_footer_btn"onClick={() => setActiveState('post')}>View all posts</button>
                </div>
              }
                {
                  (allSearchPost || []).length > 0 &&
                <div className='all_user_search_list_container'>
                  {
                    allSearchPost.map(data => {})
                  }
                </div>
                }
            </div>
          }

          {/* All search block result */}
          <>
            {
              activeState === 'block' &&
              <>
                {
                  (allSearchBlock || []).length > 0 ?
                    <>
                      {
                        allSearchBlock.map(block => (
                          <BlockSearchList key={block.b_id} blockData={block} />
                        ))
                      }
                    </> : <div className='empty_search_list'>No search result found</div>
                }
              </>
            }
          </>

          {/* All search post result */}
          <>
            {
              activeState === 'post' &&
              <>
                {
                  (allSearchPost || []).length > 0 ?
                    <>
                      {
                        allSearchPost.map(data => (
                          <PostSearchList key={data.id} data={data} />
                        ))
                      }
                    </> : <div className='empty_search_list'>No search post found</div>
                }
              </>
            }
          </>

          {/* All search people result */}
          <>
            {
              activeState === 'people' &&
              <>
                {
                  (allSearchPeople || []).length > 0 ?
                    <>
                      {
                        allSearchPeople.map(user => (
                          <SearchList key={user.u_id} data={user} />
                        ))
                      }
                    </> : <div className='empty_search_list'>No search result found</div>
                }
              </>
            }
          </>
        </div>
      </div>
    </MainLayout>
    
  )
};

const mapStateToProps = state => ({
  token: state.user.token,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  searchKey: state.search.search
});

const mapDispatchToProps = dispatch => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  searchTerm: (data) => dispatch(searchTerm(data)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});


export default connect(mapStateToProps, mapDispatchToProps)(MainSearch);