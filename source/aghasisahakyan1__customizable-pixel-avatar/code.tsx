import { cn } from "@/lib/utils";
import { useState } from "react";
import { PixelArtCard } from 'react-pixelart-face-card'

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    // Custom face 
    <PixelArtCard color={'#efd0c9'}  size={150} tags={[ 'human-male']}>
    <PixelArtCard.Hair color='brown' />
    <PixelArtCard.HeadAccessory  />
    <PixelArtCard.Eyes />
    <PixelArtCard.EyesAccessory/>
    <PixelArtCard.EarAccessory/>
    <PixelArtCard.Nose />
    <PixelArtCard.Beard />
    <PixelArtCard.Mouth/>
    <PixelArtCard.MouthAccessory />
    <PixelArtCard.NeckAccessory value='neck-accessory-3'  color='blue'/>
  </PixelArtCard>
  );
};
