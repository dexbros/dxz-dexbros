import React from 'react';
import { LikeOne } from "./Like/LikeOne"

export const Icon = (props) => {
  if (props.name.toLowerCase() === 'like') {
    return <LikeOne {...props} />
  }
}