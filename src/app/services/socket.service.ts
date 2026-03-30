import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

interface UsuarioConectado { //definimos la estructura de un usuario conectado
    socketId: string;
    usuarioId: string;
    nombre: string;
    email: string;
    organizacion: string;
    conectadoEn: Date;
}

interface UsersListUpdate { //aqui definimos la estructura del objeto que el backend envía con la lista de usuarios conectados y el total
    usuarios: UsuarioConectado[];
    total: number;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class SocketService { //exportamos la clase socketservice que se encargará de manejar la conexión y la gestión de usuarios conectados
    private socket: Socket | null = null;
    private connectedUsersSubject = new BehaviorSubject<UsuarioConectado[]>([]);
    private totalUsersSubject = new BehaviorSubject<number>(0);
    private connectionStatusSubject = new BehaviorSubject<boolean>(false);

    connectedUsers$: Observable<UsuarioConectado[]> = this.connectedUsersSubject.asObservable();
    totalUsers$: Observable<number> = this.totalUsersSubject.asObservable();
    connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();

    constructor() {}

    connect(url: string, userData?: { usuarioId: string; nombre: string; email: string; organizacion: string }): void {
        this.socket = io(url, { //esta funcion se encarga de establecer la conexión al socket con la URL proporcionada y opcionalmente con los datos del usuario para que el backend lo registre como conectado
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });

        this.socket.on('connect', () => {
            this.connectionStatusSubject.next(true);
            console.log('Socket connected');
            
            // Avisar al servidor quién se conecta para que lo añada a la lista
            if (userData) {
                this.socket?.emit('user-connect', userData);
            }
        });

        this.socket.on('disconnect', () => {
            this.connectionStatusSubject.next(false);
            console.log('Socket disconnected');
        });

        // Escuchar el objeto completo que envía el backend
        this.socket.on('users-list-updated', (data: UsersListUpdate) => {
            this.connectedUsersSubject.next(data.usuarios);
            this.totalUsersSubject.next(data.total);
            console.log(`Usuarios actualizados: ${data.total}`);
        });
    }

    disconnect(): void {
        this.socket?.disconnect();
    }

    emit(event: string, data?: unknown): void {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: (data: any) => void): void {
        this.socket?.on(event, callback);
    }

    getConnectedUsers(): UsuarioConectado[] {
        return this.connectedUsersSubject.getValue();
    }

    getTotalUsers(): number {
        return this.totalUsersSubject.getValue();
    }

    isConnected(): boolean {
        return this.connectionStatusSubject.getValue();
    }
}