import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service'; // Importar el servicio de socket

export interface Mensaje {
  usuario: any;
  organizacion: string; 
  contenido: string;
  _id?: string;
  leido?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Chat {
  joinOrganization(organizacionActiva: string) {
    throw new Error('Method not implemented.');
  }
  private readonly SERVER_URL = 'http://localhost:1337';

  constructor(
    private http: HttpClient,
    private socketService: SocketService // Inyectar el servicio de socket
  ) {}

  // Mantener el método para obtener historial
  getHistory(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.SERVER_URL}/mensajes`);
  }

  // Delegar métodos al SocketService
  sendMessage(mensaje: Mensaje): void {
    this.socketService.emit('message', {
      usuario: mensaje.usuario,
      organizacion: mensaje.organizacion,
      contenido: mensaje.contenido
    });
  }

  sendTyping(usuario: string, usuarioName: string): void {
    this.socketService.emit('typing', { usuario: usuarioName });
  }

  stopTyping(usuario: string, usuarioName: string): void {
    this.socketService.emit('stop-typing', { usuario: usuarioName });
  }

  // Nuevos métodos para acceder a los observables del socket
  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socketService.on('message', (data) => observer.next(data));
    });
  }

  onUserTyping(): Observable<any> {
    return new Observable(observer => {
      this.socketService.on('user-typing', (data) => observer.next(data));
    });
  }

  onUserStopTyping(): Observable<any> {
    return new Observable(observer => {
      this.socketService.on('user-stop-typing', (data) => observer.next(data));
    });
  }

  // Método para conectar usuario (opcional, ya que se hace en el componente)
  conectarUsuario(userData: { usuarioId: string, nombre: string, email: string, organizacion: string }): void {
    this.socketService.emit('user-connect', userData);
  }

  // Método para desconectar
  disconnect(): void {
    this.socketService.disconnect();
  }

  // Acceso al estado de usuarios conectados
  getUsuariosConectados() {
    return this.socketService.connectedUsers$;
  }

  getTotalUsuarios() {
    return this.socketService.connectionStatus$;
  }
}
