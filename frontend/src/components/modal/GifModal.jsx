import React,{useState, useEffect} from 'react';
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css"

const GifModal = ({ onClose, setImagePreview, setGif }) => {
  const [gifs, setGifs] = useState([]);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [hide, setHide] = useState('tab1');

  const closeModal = () => {
    onClose(false);
  }

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE&limit=${limit}&rating=g`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.data);
        setGifs(result.data);
      })
      .catch(error => console.log('error', error));
  }, [limit]);

  const handleAssign = (url) => {
    setImagePreview(url);
    setGif(url);
    console.log(setGif)
    onClose(false);
  }

  const searchGIF = e => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://api.giphy.com/v1/gifs/search?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE&q=${e.target.value}&limit=25&offset=0&rating=g&lang=en\n\n`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.data)
        setGifs(result.data)
      })
      .catch(error => console.log('error', error));
  };
 
  return (
    <div className='__modal_overlay'>
      <div className='__modal'>
        <div className='__modal_header'>
          <span className='gif_modal_header'>GIF</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__group_modal_body'>

          <div className='modal_tab'>
            <span className={hide === 'tab1' ? "tab active_tab_modal" : "tab"} onClick={() => setHide('tab1')}>Trending</span>
            <span className={hide === 'tab2' ? "tab active_tab_modal" : "tab"} onClick={() => setHide('tab2')}>Search</span>
          </div>
          {
            hide === 'tab1' ?
              // Trending Tab
              <>
                <div className='gif_modal_container'>
                  <div className='modal_dropDown'>
                    <select className='modal_select' onChange={(e) => setLimit(e.target.value)}>
                      <option className='modal_dropdown_option' value={5}>Top 5</option>
                      <option className='modal_dropdown_option' value={10}>Top 10</option>
                      <option className='modal_dropdown_option' value={20}>Top 20</option>
                      <option className='modal_dropdown_option' value={30}>Top 30</option>
                      <option className='modal_dropdown_option' value={40}>Top 40</option>
                      <option className='modal_dropdown_option' value={50}>Top 50</option>
                      <option className='modal_dropdown_option' value={60}>Top 60</option>
                      <option className='modal_dropdown_option' value={70}>Top 70</option>
                      <option className='modal_dropdown_option' value={80}>Top 80</option>
                      <option className='modal_dropdown_option' value={90}>Top 90</option>
                      <option className='modal_dropdown_option' value={100}>Top 100</option>
                    </select>
                  </div>
                  <div className='gif_body'>
                    {
                      (gifs || []).length > 0 ?
                        <>
                          {
                            gifs.map(gif => (
                              <div className='gif_container' key={gif.id} value={gif.images.preview_gif.url} onClick={(e) => handleAssign(gif.images.preview_gif.url)}>
                                <img src={gif.images.preview_gif.url} className={'gif'} />
                              </div>
                            ))
                          }
                        </> : <span className='gif_loading_msg'>Loading gifs...</span>
                    }
                  </div>
                </div>
              </> :
              <>
                <div className='modal_form_input'>
                  <input type="text" placeholder='Search GIF...' value={search} onChange={e => setSearch(e.target.value)} className="modal_search_input" onKeyDown={(e) => searchGIF(e)} />
                </div>

                {
                  search !== '' ? <>
                     <div className='gif_body'>
                    {
                      (gifs || []).length > 0 ?
                        <>
                          {
                            gifs.map(gif => (
                              <div className='gif_container' key={gif.id} value={gif.images.preview_gif.url} onClick={(e) => handleAssign(gif.images.preview_gif.url)}>
                                <img src={gif.images.preview_gif.url} className={'gif'} />
                              </div>
                            ))
                          }
                        </> : <span className='gif_loading_msg'>Loading gifs...</span>
                    }
                  </div>
                  </> : <>Search GIF</>
                }
              </>
          }
        </div>
      </div>
    </div>
  )
};


export default GifModal