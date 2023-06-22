import React from "react";

import './collapse.css';

function Collapse(props){
    const [isOpen, setIsOpen] = React.useState(props.open);

    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    return (
    <div className="collapse__container">
        <div className="collapse__header" onClick={handleOpen}>
            <h1 className={`collapse__header__title ${props.biggerHead == true ? "biggerHead" : ""}`} onClick={handleOpen}>
                {props.title}
            </h1>
            <i onClick={handleOpen} className="fa fa-chevron-down collapse__header__icon" />
        </div>
        {isOpen && <div className={`collapse__content ${props.columnStyle == true ? "column" : ""}`}>
            {props.children}
        </div>}
    </div>)
}

export default Collapse;