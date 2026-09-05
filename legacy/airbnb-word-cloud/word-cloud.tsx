// src/components/ui/wordcloud-chart.tsx

import React, { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Wordcloud } from '@visx/wordcloud'; // 
interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}

export interface WordData {
  text: string;
  value: number;
}

// Встроенные тексты песен для примера
const totoAfricaLyrics = `
I hear the drums echoing tonight
But she hears only whispers of some quiet conversation
She's coming in 12:30 flight
The moonlit wings reflect the stars that guide in my destination
I seek to cure what's sick and wounded
And I feel that it is more than just a passing craze
I bless the rains down in Africa
Gonna take some time to do the things we never had
The wild dogs cry out in the night
As they grow restless longing for some solitary company
I know that I must do what's right
As sure as Kilimanjaro rises like Olympus above the Serengeti
I seek to cure what's sick and wounded
And I feel that it is more than just a passing craze
I bless the rains down in Africa
Gonna take some time to do the things we never had
It's gonna take some time to do the things we never had
It's gonna take some time to do the things we never had
The drums echo tonight
She's coming in 12:30 flight
The moonlit wings reflect the stars that guide in my destination
I seek to cure what's sick and wounded
And I feel that it is more than just a passing craze
I bless the rains down in Africa
Gonna take some time to do the things we never had
It's gonna take some time to do the things we never had
It's gonna take some time to do the things we never had
I bless the rains down in Africa
I bless the rains down in Africa
(I bless the rains)
I bless the rains down in Africa
(I bless the rains)
I bless the rains down in Africa
I bless the rains down in Africa
`;

const colors = ['#143059', '#2F6B9A', '#82a6c2']; // Цвета слов

function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/[\.,\n]/g, '').split(/\s+/).filter(Boolean);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    const lowerW = w.toLowerCase();
    if (!freqMap[lowerW]) freqMap[lowerW] = 0;
    freqMap[lowerW] += 1;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const words = wordFreq(totoAfricaLyrics);

const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100],
});
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

export const WordcloudChart = ({ width, height, showControls }: ExampleProps) => {
  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  return (
    <div className="wordcloud">
      <Wordcloud
        words={words}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={spiralType}
        rotate={withRotation ? getRotationDegree : 0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      {showControls && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px' }}>
            Spiral type  
            <select
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
              value={spiralType}
            >
              <option key={'archimedean'} value={'archimedean'}>
                archimedean
              </option>
              <option key={'rectangular'} value={'rectangular'}>
                rectangular
              </option>
            </select>
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', fontSize: '14px' }}>
            With rotation  
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          align-items: center;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
        .wordcloud textarea {
          min-height: 100px;
        }
      `}} />
    </div>
  );
};