import React from "react";
import { Link } from 'react-router-dom';

import { FcAndroidOs } from 'react-icons/fc';
import { FiSettings } from "react-icons/fi";
import {AiOutlineUsergroupAdd} from "react-icons/ai"

import './Menu.css';

const Menu = () => {
    return <div className="menu__container">
        <h2 className="menu__title">
            Menu
        </h2>
        {/* SETTINGS PAGE */}
        <Link to={`/settings`} className="menu__item">
            <div className="menu__item__icon">
                <FiSettings />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Settings
                </h2>
                <p className="menu__item__text__desc">
                    This is the settings page.
                </p>
            </div>
        </Link>

        {/* GROUP PAGE */}
        <Link to={`/group`} className="menu__item">
            <div className="menu__item__icon">
                <AiOutlineUsergroupAdd />
            </div>
            <div className="menu__item__text">
                <h2 className="menu__item__text__title">
                    Group
                </h2>
                <p className="menu__item__text__desc">
                    This is the group page.
                </p>
            </div>
        </Link>

        {/* Block cast */}
    </div>
}

export default Menu;