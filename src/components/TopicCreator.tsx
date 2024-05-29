'use client';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { createTopic } from '@/app/actions';

const TopicCreator = () => {
  const [input, setInput] = React.useState<string>('');

  const { mutate, error, isPending } = useMutation({
    mutationFn: createTopic,
  });
  return (
    <section className="mt-12 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          className="bg-white min-w-64"
          placeholder="Escreva algo aqui..."
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
        <Button
          onClick={() => mutate({ topicName: input })}
          disabled={isPending}
        >
          Criar
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </section>
  );
};

export default TopicCreator;
