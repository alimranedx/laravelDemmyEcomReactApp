import React, { useState, useRef } from 'react';

/**
 * ImageMagnifier Component - Daraz Style
 * Features a lens on the source image and a secondary zoom panel on the right.
 */
const ImageMagnifier = ({ 
  src, 
  width = '100%', 
  height = '500px', 
  zoomLevel = 2.5,
  lensWidth = 150,
  lensHeight = 150
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  const handleMouseEnter = (e) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    const { top, left, width, height } = e.currentTarget.getBoundingClientRect();

    // calculate cursor position on the image
    const cursorX = e.pageX - left - window.scrollX;
    const cursorY = e.pageY - top - window.scrollY;

    // Constrain lens within image boundaries
    let lensX = cursorX - lensWidth / 2;
    let lensY = cursorY - lensHeight / 2;

    if (lensX < 0) lensX = 0;
    if (lensX > width - lensWidth) lensX = width - lensWidth;
    if (lensY < 0) lensY = 0;
    if (lensY > height - lensHeight) lensY = height - lensHeight;

    setXY([lensX, lensY]);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: height,
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        overflow: 'visible', // Allow zoom panel to be visible outside
        zIndex: 10
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden', 
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          backgroundColor: 'rgba(255,255,255,0.02)'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowMagnifier(false)}
      >
        <img
          ref={imgRef}
          src={src}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          alt="Product"
        />

        {/* Lens - The box on the source image */}
        {showMagnifier && (
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              height: `${lensHeight}px`,
              width: `${lensWidth}px`,
              top: `${y}px`,
              left: `${x}px`,
              backgroundColor: 'rgba(79, 70, 229, 0.2)', // Primary color with transparency
              border: '1px solid var(--primary)',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              zIndex: 11
            }}
          ></div>
        )}
      </div>

      {/* Zoom Panel - Daraz Style side panel */}
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 1rem)', // Position to the right with gap
            top: 0,
            width: '700px', // Increased width as requested
            height: '600px', // Increased height slightly for balance
            backgroundColor: '#fff', // Solid white background
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 1000, // Very high z-index to stay above description
            
            // Scaled background image
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            
            // The position calculation matches the lens position scaled up
            backgroundPositionX: `${-x * zoomLevel}px`,
            backgroundPositionY: `${-y * zoomLevel}px`,
            
            pointerEvents: 'none'
          }}
        >
          {/* Subtle overlay to make it look premium */}
          <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.05) 100%)' }}></div>
        </div>
      )}
    </div>
  );
};

export default ImageMagnifier;
