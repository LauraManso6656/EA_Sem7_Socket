import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat, Mensaje } from '../../services/chat';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  public usuarioActivo: string = ''; 
  public usuarioActivoName: string = '';
  public organizacionActiva: string = '';
  public organizacionActivaName: string = '';
  
  public nuevoMensaje: string = '';
  public mensajes: Mensaje[] = [];
  public usuariosConectados: any[] = [];//lista usuarios conectados!!
  public totalUsuarios: number = 0;//total usuarios conectados!!
  public typingUser: string | null = null;

  private messageSub!: Subscription;
  private typingSub!: Subscription;
  private stopTypingSub!: Subscription;
  public UsuariosSub!: Subscription;

  private typingTimeout: any;


  constructor(
    private chatService: Chat,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService //AÑADIDO PARA USUARIOS CONECTADOS

  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.usuarioActivo = sessionStorage.getItem('chat_user_id') || '';
      this.usuarioActivoName = sessionStorage.getItem('chat_user_name') || '';
      this.organizacionActiva = sessionStorage.getItem('chat_org_id') || '';
      this.organizacionActivaName = sessionStorage.getItem('chat_org_name') || '';
    }

    if (!this.usuarioActivo || !this.organizacionActiva) {
      this.router.navigate(['/login']);
      return;
    }
    this.socketService.connect('http://localhost:1337', {
      usuarioId: this.usuarioActivo,
      nombre: this.usuarioActivoName,
      email: sessionStorage.getItem('chat_user_email') || '',
      organizacion: this.organizacionActiva
    }); // Conexión al socket con datos del usuario

    this.chatService.joinOrganization(this.organizacionActiva);

    this.messageSub = this.chatService.getMessages().subscribe((mensaje: Mensaje) => {
      this.mensajes.push(mensaje);
      this.scrollToBottom();
    });

    this.typingSub = this.chatService.onUserTyping().subscribe((data: any) => {
      this.typingUser = `${data.usuarioName} está escribiendo...`;
      this.cdr.detectChanges();
    });

    this.stopTypingSub = this.chatService.onUserStopTyping().subscribe(() => {
      this.typingUser = null;
      this.cdr.detectChanges();
    });

    this.UsuariosSub = this.socketService.connectedUsers$.subscribe((usuarios: any[]) => {
      this.usuariosConectados = usuarios;
      this.totalUsuarios = usuarios.length; // Actualiza el total de usuarios conectados!!
      this.cdr.detectChanges();
    }); //BROADCASTING DE USUARIOS CONECTADOS
  }

  ngOnDestroy(): void {
    if (this.messageSub) this.messageSub.unsubscribe();
    if (this.typingSub) this.typingSub.unsubscribe();
    if (this.stopTypingSub) this.stopTypingSub.unsubscribe();
    if (this.UsuariosSub) this.UsuariosSub.unsubscribe();
    this.chatService.disconnect();
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      usuario: this.usuarioActivo,
      organizacion: this.organizacionActiva,
      contenido: this.nuevoMensaje
    };

    this.chatService.sendMessage(mensaje);
    this.chatService.stopTyping(this.usuarioActivo, this.usuarioActivoName);
    this.nuevoMensaje = '';
  }

  onTyping(): void {
    this.chatService.sendTyping(this.usuarioActivo, this.usuarioActivoName);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.chatService.stopTyping(this.usuarioActivo, this.usuarioActivoName);
    }, 1500);
  }

  getUsuarioName(usuario: any): string {
    if (typeof usuario === 'object' && usuario !== null) {
      return usuario.name || usuario._id;
    }
    return usuario;
  }

  esMensajeMio(mensaje: Mensaje): boolean {
    const id = typeof mensaje.usuario === 'object' ? mensaje.usuario._id : mensaje.usuario;
    return id === this.usuarioActivo;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}