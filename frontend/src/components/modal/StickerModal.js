import React, { useEffect, useState } from 'react';
import {AiOutlineClose} from "react-icons/ai"

const StickerModal = ({ onClose, setImagePreview, setSticker }) => {
  const [isActive, setIsActive] = useState("random");
  const [stickers, setStickers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [search, setSearch] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    var url;
    if (isActive === "random") {
      url = "https://api.giphy.com/v1/stickers/packs?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE"
    } else if (isActive === "trending") {
      url = "https://api.giphy.com/v1/stickers/trending?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE&limit=100&rating=g"
    } else {}

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.data);
        if (isActive === "random") {
          setStickers(result.data)
        } else if (isActive === "trending") {
          setTrending(result.data)
        }
      })
      .catch(error => console.log('error', error));
  }, [isActive]);

  const addSticker = (value) => {
    // alert(value);
    setImagePreview(value);
    setSticker(value);
    onClose(false);
  } 


  return (
    <div className='__modal_overlay'>
      <div className='__modal'>
        <div className='__modal_header'>
          <span className='modal_header_text'>Sticker</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={() => onClose(false)} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__group_modal_body'>
          {/* Modal TAB */}
          <div className='modal_tab_container'>
            <button
              className={isActive === "random" ? 'modal_tab_option isActive' : 'modal_tab_option'}
              onClick={() => setIsActive("random")}
            >Random</button>

            <button
              className={isActive === "trending" ? 'modal_tab_option isActive' : 'modal_tab_option'}
              onClick={() => setIsActive("trending")}
            >Trending</button>
          </div>

          {/* Tab content */}
          {/* Random */}
          {
            isActive === 'random' &&
            <div className='tab_content'>
              <div className='sticker_container'>
                  {
                    (stickers || []).length > 0 &&
                    stickers.map(sticker => (
                      <div className='sticker_box' key={sticker.id}>
                        <img src={sticker.featured_gif.images.fixed_height.url} className='sticker' onClick={() => addSticker(sticker.featured_gif.images.fixed_height.url)} />
                      </div>
                    ))
                  }
                </div>
            </div>
          }

          {/* Trending */}
          {
            isActive === "trending" &&
            <div className='tab_content'>
              <div className='sticker_container'>
                  {
                    (trending || []).length > 0 &&
                    trending.map(sticker => (
                      <div className='sticker_box' key={sticker.id}>
                        <img src={sticker.images.preview_gif.url} className='sticker'  onClick={() => addSticker(sticker.images.preview_gif.url)}  />
                      </div>
                    ))
                  }
                </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
};

export default StickerModal