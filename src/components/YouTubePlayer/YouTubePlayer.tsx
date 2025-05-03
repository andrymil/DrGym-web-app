'use client';

import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

type YouTubePlayerProps = {
  videoId: string;
};

const YouTubePlayer = ({ videoId }: YouTubePlayerProps) => {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const containerElement = containerRef.current;
    const handleResize = () => {
      if (containerElement) {
        const width = containerElement.offsetWidth;
        const height = width * (9 / 16);
        setDimensions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    handleResize();

    return () => {
      if (containerElement) {
        resizeObserver.unobserve(containerElement);
      }
    };
  }, []);

  const opts = {
    height: dimensions.height,
    width: dimensions.width,
    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = () => {
    setLoading(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '640px',
        aspectRatio: '16 / 9',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          animation="wave"
        />
      )}

      <Box
        sx={{
          display: loading ? 'none' : 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {dimensions.width > 0 && (
          <YouTube videoId={videoId} opts={opts} onReady={onReady} />
        )}
      </Box>
    </Box>
  );
};

export default YouTubePlayer;
