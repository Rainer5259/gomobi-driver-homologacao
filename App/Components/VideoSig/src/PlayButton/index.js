import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlayButton = () => {
  return (
      <Svg width={83} height={83} viewBox="0 0 83 83" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M41.5 74.6998C59.8359 74.6998 74.7 59.8357 74.7 41.4998C74.7 23.164 59.8359 8.2998 41.5 8.2998C23.1642 8.2998 8.30005 23.164 8.30005 41.4998C8.30005 59.8357 23.1642 74.6998 41.5 74.6998ZM39.6521 29.7468C38.3786 28.8978 36.7412 28.8187 35.3918 29.5409C34.0424 30.263 33.2 31.6693 33.2 33.1998V49.7998C33.2 51.3303 34.0424 52.7366 35.3918 53.4588C36.7412 54.1809 38.3786 54.1018 39.6521 53.2528L52.1021 44.9528C53.2566 44.1831 53.95 42.8874 53.95 41.4998C53.95 40.1122 53.2566 38.8165 52.1021 38.0468L39.6521 29.7468Z"
          fill="#EF3087"
        />
      </Svg>
  );
};

export default PlayButton;