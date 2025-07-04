/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(_client: any) {}
  handleDisconnect(_client: any) {}

  emitOrderCreated(order: any) {
    this.server.emit('orderCreated', order);
  }

  emitOrderUpdated(order: any) {
    this.server.emit('orderUpdated', order);
  }
}
