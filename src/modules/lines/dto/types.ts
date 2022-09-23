import { Line } from '@prisma/client';

export class CreateLine
  implements
    Omit<
      Line,
      | 'created_at'
      | 'updated_at'
      | 'id'
      | 'access_key'
      | 'observation'
      | 'webhook_url'
    >
{
  name: string;
  phone_number: string;
  observation?: string;
  port: number;
  webhook_url?: string;
}

export class UpdateLine
  implements
    Omit<
      Line,
      'created_at' | 'updated_at' | 'id' | 'access_key' | 'observation'
    >
{
  name: string;
  phone_number: string;
  observation?: string;
  port: number;
  webhook_url: string;
}
