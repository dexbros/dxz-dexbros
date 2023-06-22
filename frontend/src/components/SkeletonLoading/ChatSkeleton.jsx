import React from 'react';
import "./Skeleton.css";
import MainLayoutComponent from '../../layouts/main-layout.component';

const ChatSkeleton = () => {
  return (
    <MainLayoutComponent title="Blockcast">
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
      <div className='message_skeleton skeleton_color'></div>
    </MainLayoutComponent>
  )
};

export default ChatSkeleton;
// chat_skeleton