import React from 'react';

const LoadingIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-spin"
      width="100"
      height="100"
      style={{ background: 'none' }}
    >
      <g transform="translate(50 50)">
        <g transform="scale(0.8)">
          <circle cx="0" cy="0" r="40" fill="#ffd700" />
        </g>
        <circle cx="0" cy="0" r="30" fill="#ff9900" />
        <g id="group" fill="#ffffff">
          <circle id="eye-left" cx="-15" cy="-15" r="5" />
          <circle id="eye-right" cx="15" cy="-15" r="5" />
          <path d="M-12 0 Q 0 -5 12 0" id="mouth" />
        </g>
      </g>
    </svg>
  );
};

export default LoadingIcon;
