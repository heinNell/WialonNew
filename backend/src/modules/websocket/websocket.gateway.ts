import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WSGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private activeUsers = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.activeUsers.set(client.id, client);

    this.server.emit('users:count', this.activeUsers.size);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);

    this.server.emit('users:count', this.activeUsers.size);
  }

  @SubscribeMessage('vehicle:subscribe')
  handleVehicleSubscribe(
    @MessageBody() vehicleId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`vehicle:${vehicleId}`);
    this.logger.log(`Client ${client.id} subscribed to vehicle ${vehicleId}`);
    return { event: 'subscribed', data: vehicleId };
  }

  @SubscribeMessage('vehicle:unsubscribe')
  handleVehicleUnsubscribe(
    @MessageBody() vehicleId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`vehicle:${vehicleId}`);
    this.logger.log(
      `Client ${client.id} unsubscribed from vehicle ${vehicleId}`,
    );
    return { event: 'unsubscribed', data: vehicleId };
  }

  @SubscribeMessage('route:subscribe')
  handleRouteSubscribe(
    @MessageBody() routeId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`route:${routeId}`);
    this.logger.log(`Client ${client.id} subscribed to route ${routeId}`);
    return { event: 'subscribed', data: routeId };
  }

  // Emit vehicle position update
  emitVehiclePosition(vehicleId: string, position: any) {
    this.server.to(`vehicle:${vehicleId}`).emit('vehicle:position', {
      vehicleId,
      position,
      timestamp: new Date(),
    });
  }

  // Emit vehicle status update
  emitVehicleStatus(vehicleId: string, status: any) {
    this.server.to(`vehicle:${vehicleId}`).emit('vehicle:status', {
      vehicleId,
      status,
      timestamp: new Date(),
    });
  }

  // Emit task update
  emitTaskUpdate(taskId: string, task: any) {
    this.server.emit('task:update', {
      taskId,
      task,
      timestamp: new Date(),
    });
  }

  // Emit route update
  emitRouteUpdate(routeId: string, route: any) {
    this.server.to(`route:${routeId}`).emit('route:update', {
      routeId,
      route,
      timestamp: new Date(),
    });
  }

  // Emit delivery update
  emitDeliveryUpdate(deliveryId: string, delivery: any) {
    this.server.emit('delivery:update', {
      deliveryId,
      delivery,
      timestamp: new Date(),
    });
  }

  // Broadcast to all clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Send to specific client
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.activeUsers.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  getActiveUsersCount(): number {
    return this.activeUsers.size;
  }
}
