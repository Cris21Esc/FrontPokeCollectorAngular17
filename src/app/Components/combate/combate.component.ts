import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../chat.service";
import { ServicepokemonsService } from "../../service-pokemons.service";
import { Movimiento } from "../../movimiento";

@Component({
  selector: 'app-combate',
  templateUrl: './combate.component.html',
  styleUrls: ['./combate.component.css']
})
export class CombateComponent implements OnInit {

  idPokeActivo: number | undefined;
  serverMessage: string | undefined;
  message: string | undefined;
  messages: { user: string; message: string; }[] = [];
  protected movimientos: Movimiento[] | undefined;

  constructor(private chatService: ChatService, private servicePokemon: ServicepokemonsService) { }

  ngOnInit() {
    // Unirse a la sala del combate al cargar el componente
    const roomId = 'combateRoom'; // Puedes usar un identificador único para cada combate
    const userId = sessionStorage.getItem("user") || 'defaultUser'; // Obtener el ID de usuario actual o usar un valor predeterminado
    this.chatService.joinRoom(roomId, userId);

    // Suscribirse a los mensajes del chat
    this.chatService.getMessages().subscribe((data: { user: string; message: string; }) => {
      this.messages.push({ user: data.user, message: data.message });
    });

    // Obtener los movimientos del Pokémon activo
    this.idPokeActivo = 1; // Puedes obtener el ID del Pokémon activo de alguna manera
    this.servicePokemon.movimientosPokemon(this.idPokeActivo).subscribe(data => {
      this.movimientos = data;
    });
  }

  sendMessage() {
    // Enviar un mensaje al chat
    this.chatService.sendMessage(this.message, sessionStorage.getItem("user"));
    this.message = ''; // Limpiar el campo de entrada después de enviar el mensaje
  }

  sendServerMessage(message: string) {
    // Enviar un mensaje del servidor al chat
    this.serverMessage = sessionStorage.getItem("user") + " ha utilizado " + message
    this.chatService.sendServerMessage(this.serverMessage, "Servidor");
  }
}
