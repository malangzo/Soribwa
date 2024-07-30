import React from 'react';
import './GridItem.css';

<link rel="manifest" href="/manifest.json" />

const GridItem = ({ src, alt, text }) => {
  return (
    <div className="grid-item" >
      <img src={src} alt={alt} />
      <p>{text}</p>
    </div>
  );
};

export default GridItem;
