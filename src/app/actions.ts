'use server';

import { redis } from '@/lib/redis';
import { redirect } from 'next/navigation';

export const createTopic = async ({ topicName }: { topicName: string }) => {
  const regex = /^[a-zA-Z-]+$/;

  if (!topicName || topicName.length > 50) {
    return { error: 'O nome precisa ter entre 1 a 50 caracteres' };
  }

  if (!regex.test(topicName)) {
    return { error: 'Use apenas letras e hifens no nome' };
  }

  await redis.sadd('existing-topics', topicName);
  redirect(`/${topicName}`);
};
