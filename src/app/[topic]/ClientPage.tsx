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
import { submitComment } from '../actions';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

interface ClientPageProps {
  topicName: string;
  initialData: { text: string; value: number }[];
}

const COLORS = ['#143059', '#2f6b9a', '#82a6c2'];
const ClientPage = ({ topicName, initialData }: ClientPageProps) => {
  const [words, setWords] = React.useState(initialData);
  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    socket.emit('join-room', `room:${topicName}`);
  }, []);

  React.useEffect(() => {
    socket.on('room-update', (message: string) => {
      const data = JSON.parse(message) as {
        text: string;
        value: number;
      }[];

      data.map((newWord) => {
        const isWordAlreadyIncluded = words.some(
          (word) => word.text === newWord.text
        );

        if (isWordAlreadyIncluded) {
          setWords((prev) => {
            const before = prev.find((word) => word.text === newWord.text);
            const rest = prev.filter((word) => word.text !== newWord.text);

            return [
              ...rest,
              { text: before!.text, value: before!.value + newWord.value },
            ];
          });
        } else if (words.length < 50) {
          return setWords((prev) => [...prev, newWord]);
        }
      });
    });
    return () => {
      socket.off('room-update');
    };
  }, [words]);

  // o tamanho da font depende de uantas vezes aquela palavra foi escrita
  const fontScale = scaleLog({
    // o primeiro item da array contém os valores minimos que estão sendo retornados no map, e o segundo o maximo
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: submitComment,
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
            fontSize={(data) => fontScale(data.value)}
            font={"Impact"}
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
            <Button
              disabled={isPending}
              onClick={() => mutate({ comment: input, topicName })}
            >
              Compartilhar
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ClientPage;
