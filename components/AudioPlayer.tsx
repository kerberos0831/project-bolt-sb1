'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioSrc?: string;
  title?: string;
  artist?: string;
}

export default function AudioPlayer({ 
  audioSrc = "/audio/background-music.mp3", // You'll need to add your audio file here
  title = "Background Music",
  artist = "KOSIKK"
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.3]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    // Set initial volume
    audio.volume = volume[0];

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume[0];
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(newVolume);
    audio.volume = newVolume[0];
    
    if (newVolume[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (newTime: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="metadata"
      />
      
      <div className="fixed bottom-4 right-4 z-50 bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-4 min-w-[300px]">
        <div className="flex items-center gap-3 mb-3">
          <Button
            onClick={togglePlay}
            size="sm"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border-white/30"
            disabled={!isLoaded}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{title}</p>
            <p className="text-white/60 text-xs truncate">{artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {isLoaded && (
          <div className="mb-3">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Slider
            value={volume}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>

        {!isLoaded && (
          <div className="text-center text-white/60 text-xs mt-2">
            Add your audio file to /public/audio/background-music.mp3
          </div>
        )}
      </div>
    </>
  );
}