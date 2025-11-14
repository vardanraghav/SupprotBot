"use client";

import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Wind, Droplets, Waves, Leaf } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';

const sounds = [
  { name: 'Rain', icon: Droplets, src: 'https://cdn.pixabay.com/audio/2022/10/21/audio_19194d3f4b.mp3' },
  { name: 'Forest', icon: Leaf, src: 'https://cdn.pixabay.com/audio/2022/08/03/audio_50428789c1.mp3' },
  { name: 'Waves', icon: Waves, src: 'https://cdn.pixabay.com/audio/2023/09/14/audio_37a2d677f5.mp3' },
  { name: 'Wind', icon: Wind, src: 'https://cdn.pixabay.com/audio/2022/02/01/audio_73e72849e7.mp3' },
];

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(sounds[0]);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if(audioRef.current) {
        audioRef.current.volume = newVolume;
    }
  }

  const selectSound = (sound: typeof sounds[0]) => {
    setCurrentSound(sound);
    if (audioRef.current) {
      audioRef.current.src = sound.src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={currentSound.src} loop volume={volume} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Sound Therapy</h4>
             <div className="flex justify-around">
                {sounds.map(sound => (
                    <Button 
                        key={sound.name}
                        variant={currentSound.name === sound.name ? 'secondary' : 'ghost'} 
                        size="icon"
                        onClick={() => selectSound(sound)}>
                        <sound.icon className="h-5 w-5" />
                    </Button>
                ))}
            </div>
             <div>
                <label className="text-sm">Volume</label>
                <Slider defaultValue={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange}/>
             </div>
            <Button onClick={togglePlayPause} className="w-full">
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
