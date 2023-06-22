import React from 'react';
import { AiFillDislike, AiFillHeart, AiFillLike } from 'react-icons/ai';
import { IoIosHeartDislike, IoMdNuclear } from 'react-icons/io';
import { useNavigate } from 'react-router';
import CryptoImage from "../../Assets/crypto.jpg"

const NewsComp = ({ newsData }) => {
  const navigate = useNavigate();
  return (
    <div className='__news_card'>
      {/* Image container */}
      <div className="news_image_section">
        <img src={newsData.image || CryptoImage} className={"crypto_news_image"} />
        <span className='crypto_news_kind'>{newsData.kind}</span>
        <span className='crypto_news_date'>{newsData.p_t.split("T")[0]}</span>
      </div>
      {/* Descripton section */}
      <div className='news_card_body'>
        {/* Title */}
        <p className='crypto_news_title'>{newsData.title.replace(/<\/?[^>]+(>|$)/g, "")}</p>
        {/* News description */}
        <p className='crypto_news_desc'>{newsData.des.replace(/<\/?[^>]+(>|$)/g, "")}</p>

        {/* Link */}
        <a target="_blank" href={newsData.url} className='crypto_view_more_btn'>Read full new</a>
      </div>
      {/* News button section */}
    </div>
  )
}

export default NewsComp