import React from 'react';
import { Search } from './Search';

const Icon = (props) => {
  if (props.name.toLowerCase() === 'search') {
    return <Search {...props} />
  }
}

export  {Icon}