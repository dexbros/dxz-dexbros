import React from 'react'

const Form = () => {
  return (
    <div className='block_cast_form'>
      <div className='block_cast_form_box'>
        <textarea type="text" placeholder='Enter your thought..' className='block_form'></textarea>
        <button className='block_post_btn'>Post</button>
      </div>
    </div>
  )
}

export default Form