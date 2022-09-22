import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GlobalService } from './services/global/global.service';

@WebSocketGateway()
export class QrCodeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('WebSocketGateway');

  handleDisconnect(client: Socket) {
    this.logger.log(`DISCONNECTED:  ${client.id}`);
    GlobalService.instancesSocketQrCode = null;
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`CONNECT:  ${client.id}`);
    GlobalService.instancesSocketQrCode = client;
  }
  afterInit(server: any) {
    this.logger.log('SOCKET INITIALIZED');
  }

  sendQrCode(client: Socket, qrCode: string) {
    client && client.emit('qrCode', qrCode);
  }
  sendConnected(client: Socket) {
    client && client.emit('connected', { connected: true });
  }

  // Para receber mensagem

  // @SubscribeMessage('msgToServer')
  // async handleMessage(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): Promise<void> {
  //   this.logger.log(payload);
  //   client.emit('msgToClient', 'teste');
  // }
}
