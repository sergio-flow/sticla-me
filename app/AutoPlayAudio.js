"use client"

import React, { useEffect, useRef, useState } from 'react';
import styles from "./AutoPlayAudio.module.css"

const AutoPlayAudio = () => {
  const audioRef = useRef(null);
  const alreadyDone = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // useEffect(() => {
  //   const playAudio = () => {
  //     if (audioRef.current && !isPlaying && !alreadyDone.current) {
  //       audioRef.current.play();
  //       setIsPlaying(true);
  //       alreadyDone.current = true;
  //     }
  //     document.removeEventListener('click', playAudio);
  //     document.removeEventListener('keypress', playAudio);
  //     document.removeEventListener('touchstart', playAudio);
  //   };

  //   document.addEventListener('click', playAudio);
  //   document.addEventListener('keypress', playAudio);
  //   document.addEventListener('touchstart', playAudio);

  //   return () => {
  //     document.removeEventListener('click', playAudio);
  //     document.removeEventListener('keypress', playAudio);
  //     document.removeEventListener('touchstart', playAudio);
  //   };
  // }, [isPlaying]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMuteUnmute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={styles.autoPlayAudio}>
      <audio ref={audioRef} src="/audio.mp3" />
      <div>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        {/* <button onClick={toggleMuteUnmute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button> */}
      </div>
    </div>
  );
};

export default AutoPlayAudio;
