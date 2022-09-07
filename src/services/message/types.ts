import { Message } from '@prisma/client';

export class ICreateMessage
  implements
    Omit<
      Message,
      | 'id'
      | 'is_survey'
      | 'file_url'
      | 'first_option'
      | 'first_answer'
      | 'second_option'
      | 'second_answer'
      | 'response'
      | 'created_at'
      | 'updated_at'
    >
{
  id?: string;
  acess_key: string;
  file_url?: string;
  ack: number;
  message_id: string;
  message_body: string;
  sender: string;
  destiny: string;
  is_survey?: boolean;
  first_option?: string;
  first_answer?: string;
  second_option?: string;
  second_answer?: string;
  response?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ICreateMessageSurvey
  implements
    Omit<Message, 'id' | 'file_url' | 'response' | 'created_at' | 'updated_at'>
{
  id?: string;
  acess_key: string;
  file_url?: string;
  ack: number;
  message_id: string;
  message_body: string;
  sender: string;
  destiny: string;
  is_survey: boolean;
  first_option: string;
  first_answer: string;
  second_option: string;
  second_answer: string;
  response?: string;
  created_at?: Date;
  updated_at?: Date;
}
