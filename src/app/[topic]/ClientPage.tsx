'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React from 'react';
import { Wordcloud } from '@visx/wordcloud';
import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

interface ClientPageProps {
  topicName: string;
  initialData: { text: string; value: number }[];
}
interface WordData {
  text: string;
  value: number;
}

const COLORS = ['#143059', '#2f6b9a', '#82a6c2'];
const ClientPage = ({ topicName, initialData }: ClientPageProps) => {
  const [words, setWords] = React.useState(initialData);
  const [input, setInput] = React.useState('');
  // o tamanho da font depende de uantas vezes aquela palavra foi escrita
  const fontScale = scaleLog({
    // o primeiro item da array contém os valores minimos que estão sendo retornados no map, e o segundo o maximo
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });



  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-grid-zinc-50 pb-20">
      <MaxWidthWrapper className="flex flex-col items-center gap-6 pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-tight text-balance">
          O que as pessoas estão pensando sobre{' '}
          <span className="text-blue-600">{topicName}</span>:
        </h1>
        <p className="text-sm">(Atualizado em tempo real)</p>
        <div className="aspect-square max-w-xl flex items-center justify-center">
          <Wordcloud
            words={words}
            width={500}
            height={500}
            fontSize={(data: WordData) => fontScale(data.value)}
            font={'impact'}
            padding={2}
            spiral="archimedean"
            rotate={0}
            random={() => 0.5}
          >
            {(cloudWords) =>
              cloudWords.map((word, index) => (
                <Text
                  key={word.text}
                  fill={COLORS[index % COLORS.length]}
                  textAnchor="middle"
                  transform={`translate(${word.x}, ${word.y})`}
                  fontSize={word.size}
                  fontFamily={word.font}
                >
                  {word.text}
                </Text>
              ))
            }
          </Wordcloud>
        </div>
        <div className="max-w-lg w-full">
          <Label className="font-semibold tracking-tight text-lg pb-2">
            Aqui esta o que eu penso sobre {topicName}
          </Label>
          <div className="mt-1 flex gap-2 items-center">
            <Input
              value={input}
              onChange={({ target }) => setInput(target.value)}
              placeholder={`${topicName} é absolutamente...`}
            />
            <Button>Compartilhar</Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ClientPage;
