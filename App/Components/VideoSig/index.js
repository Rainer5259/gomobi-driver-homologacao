import { View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { TouchableOpacity } from 'react-native';
import PlayButton from './src/PlayButton';
import { StyleSheet } from 'react-native';
const URL_VIDEO = 'https://drive.google.com/file/d/1-2QkfvRQwNwudqalhFt5SiqHTNxEiWEP/view?ts=650d1695'

const VideoSig = ({ styles }) => {

  const [data, setData] = useState({ backgroundvideo: null, paused: false, showButton: true });

  const ref = useRef();

  useEffect(() => {
    setData({ backgroundvideo: null, paused: false, showButton: true });

    return () => {
      destroy();
    }
  }, [])

  const destroy = () => {
    setData({ backgroundvideo: null, paused: false, showButton: true });
  }

  const setShowButton = (showButton) => {
    setData({ ...data, showButton })
  }

  const setPaused = (paused) => {
    setData({ ...data, paused })
  }

  const setPausedAndShowButton = (paused, showButton) => {
    setData({ ...data, showButton, paused })
  }

  const setBackgroundvideo = (backgroundvideo) => {
    setData({ ...data, backgroundvideo })
  }

  const onVideoLoad = (a, b, c) => {
    console.log(a);
    console.log(b);
    console.log(c);
  }

  return (
    <View style={[styles, stylesS.container]}>
      <View style={[stylesS.video, { height: 249, position: 'relative' }]}>
        <Video
          onVideoLoad={onVideoLoad}
          onEnd={() => {
            setShowButton(true)
          }}
          paused={!data.paused}
          source={require('./sig.mp4')}
          ref={ref}
          style={stylesS.video}
          resizeMode="stretch"
        />
        {/*data.showButton && <View style={stylesS.backgroundColorVideo}></View>*/}
      </View>
      <TouchableOpacity
        style={stylesS.playButton}
        onPress={() => {
          setPausedAndShowButton(!data.paused, !data.showButton);
        }}>
        {data.showButton && <PlayButton />}
      </TouchableOpacity>
    </View>
  );
};

const stylesS = StyleSheet.create({
  container: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 10,
    margin: 6,
  },
  extend: {

  },
  playButton: {
    height:'100%',
    width:'100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  video: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  backgroundColorVideo: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    height: 250,
    width: '100%',
    position: 'absolute',
    zIndex: 1
  }
});

export default VideoSig;