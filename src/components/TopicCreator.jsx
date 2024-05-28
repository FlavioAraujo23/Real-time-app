'use client';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const TopicCreator = () => {
  const [input, setInput] = React.useState < string > '';
  return (
    <section className="mt-12 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          className="bg-white min-w-64"
          placeholder="Escreva algo aqui..."
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
        <Button>Criar</Button>
      </div>
    </section>
  );
};

export default TopicCreator;
