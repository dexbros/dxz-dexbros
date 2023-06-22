import React from 'react';
import { GrEdit } from "react-icons/gr";

const BlockCastSetting = ({blockData}) => {
  return (
    <div className='block_cast_card'>
      <div className='blockcast_box'>
        <span className='block_name'>{blockData.b_n}</span><br />
        <span className='block_bio'>{ blockData.b_bio}</span>
      </div>
      <button className='block_cast_edit'>
        <GrEdit />
      </button>
    </div>
  )
}

export default BlockCastSetting