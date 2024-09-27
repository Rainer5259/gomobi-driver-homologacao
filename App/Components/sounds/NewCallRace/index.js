import { useEffect, useState } from "react";
import Sound from "react-native-sound";
import som from './../../../Assets/sounds/founddriver/som.mp3';

function NewCallRace({ turnOffSound }) {
  const [ding, setDing] = useState("");

  useEffect(() => {
    configSound();
  }, []);

  useEffect(() => {
    ding && playPause();
  }, [ding])

  function configSound() {
    const ding = new Sound(som, error => {
      if (error) {
        return;
      }
      setDing(ding);
    });
  }

  function playPause() {
    ding.setVolume(1);
    ding.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
    setTimeout(()=>{
      turnOffSound && turnOffSound();
    },2000)
  };

  return (
    <>
    </>
  )
}

export default NewCallRace;