import React from 'react';

const Alert = ({color, text}) => {
    const alertStyle = {
      position: 'absolute',
      right: '10px',
      top: '10px',
      backgroundColor: color,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '10px',
      border: 'solid rgba(0, 0, 0, 0.4) 7px',
    }

    const textStyle = {
      fontSize: '1.3em',
    }

    var alertComp =
      <div style={alertStyle}>
        <p style={textStyle}>{text}</p>
      </div>;
    return alertComp;
}

export default Alert;
