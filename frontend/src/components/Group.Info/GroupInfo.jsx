import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Tooltip from '../Tooltip/Tooltip';

const GroupInfo = ({ group }) => {
  const { id } = useParams();  
  console.log(group)
  return (
    <div>
      {
        group ?
          <div>
            <div>
              <span className='sub_title'>Group Name: <span className='text'>{group.g_n}</span></span>
            </div>
            
            <div>
              <span className='sub_title'>Group Description: <span className='text'>{group.g_bio}</span></span>
            </div>
            
            <div>
              <span className='sub_title'>Group Status: <span className='text'>{group.g_privacy}</span></span>
            </div>

            <div>
              <span className='sub_title'>Group Creator Name:
                <Link to={`/profile/${group.g_c_dun}`} className="text">
                  {group.g_c_fn}{" "}{group.g_c_ln}
              </Link>
              </span>
            </div>

            <div>
              <span className='sub_title'>Country: <span className='text'>{group.country}, {group.city}</span></span>
            </div>

            {/* <div>
              <span className='sub_title'>Website Link: <span className='text'>
                <a href={group.website_link}>{group.website_link}</a>
              </span></span>
            </div> */}
            

            <div>
              <Link to={`/group/members/${id}`} className="group_mem_link">
                Total members: {group.g_mem.length}
              </Link>
            </div>

            <div>
              <span className='sub_title'>Website Link:</span>
              {/* {
                (group.banned_words || []).length > 0 && group.banned_words.map((word, index) => (
                  <button key={index} className="word_tags">{word}</button>
                ))
              } */}
            </div>
          </div> :
          <>Loading...</>
      }
    </div>
  )
};

export default GroupInfo