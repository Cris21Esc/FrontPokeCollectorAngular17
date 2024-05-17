import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ServicepokemonsService } from '../../service-pokemons.service';
import { Movimiento } from '../../movimiento';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-combate',
  templateUrl: './combate.component.html',
  styleUrls: ['./combate.component.css']
})
export class CombateComponent implements OnInit, OnDestroy {
  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { userId: string; message: string; room: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;
  roomId: string = 'combateRoom';
  userId: string | null = sessionStorage.getItem("user");
  private messagesSubscription: Subscription | undefined;
  private roomsSubscription: Subscription | undefined;
  showSidebar: boolean = false;
  availableRooms: string[] = [];

  constructor(private chatService: ChatService, private servicePokemon: ServicepokemonsService) { }

  ngOnInit() {
    if (this.userId) {
      this.chatService.joinRoom(this.roomId, this.userId);
    }

    this.messagesSubscription = this.chatService.getMessages().subscribe((data: { userId: string; message: string; room: string; }) => {
      if (data.room === this.roomId) {
        this.messages.push(data);
      }
    });

    this.roomsSubscription = this.chatService.getRooms().subscribe((rooms: string[]) => {
      this.availableRooms = rooms;
    });

    this.idPokeActivo = 1;
    this.servicePokemon.movimientosPokemon(this.idPokeActivo).subscribe(data => {
      this.movimientos = data;
    });
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.roomsSubscription) {
      this.roomsSubscription.unsubscribe();
    }
    this.chatService.leaveRoom();
  }

  sendMessage() {
    if (this.message && this.userId) {
      this.chatService.sendMessage(this.userId, this.message, this.roomId);
      this.message = '';
    }
  }

  sendServerMessage(message: string) {
    if (this.userId) {
      this.serverMessage = `${this.userId} ha utilizado ${message}`;
      this.chatService.sendServerMessage(this.roomId, this.serverMessage);
    }
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      this.chatService.requestRooms();
    }
  }

  joinRoom(room: string) {
    if (this.userId) {
      this.chatService.joinRoom(room, this.userId);
      this.roomId = room;
      this.messages = [];
      this.chatService.requestLastMessages(room, 10); // Solicitar los últimos 10 mensajes al unirse a la sala
      this.toggleSidebar();
    }
  }


  createRoom() {
    const newRoom = prompt('Introduce el nombre de la nueva sala:');
    if (newRoom && this.userId) {
      this.chatService.joinRoom(newRoom, this.userId);
      this.roomId = newRoom;
      this.messages = [];
      this.toggleSidebar();
    }
  }

  leaveRoom() {
    this.chatService.leaveRoom();
    this.roomId = '';
    this.messages = [];
    this.toggleSidebar();
  }
}
