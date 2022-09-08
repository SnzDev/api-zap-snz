import { ISessions } from './types';
import { Socket } from 'socket.io';

export class GlobalService {
  public static instancesWhatsapp: ISessions;
  public static instancesSocketQrCode: Socket;
}
