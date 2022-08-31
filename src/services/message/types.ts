import { Message } from '@prisma/client';

export class ICreateMessage
  implements Omit<Message, 'id' | 'created_at' | 'updated_at'>
{
  id?: string;
  file_url: string;
  ack: number;
  message_id: string;
  message_body: string;
  sender: string;
  destiny: string;
  created_at?: Date;
  updated_at?: Date;
}
