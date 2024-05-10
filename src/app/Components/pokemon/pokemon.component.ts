import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicepokemonsService} from "../../service-pokemons.service";
import { ServiceusersService} from "../../service-users.service";

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {

  user_poke_info={
    pokemonId:'',
    userPokemonId:''
  }

  token: string | null = null;

  userinfo:any;

  id:string="";

  user=sessionStorage.getItem("token");

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private router:Router,private serviciosPokemon:ServicepokemonsService, private serviceUser:ServiceusersService) {
   }

  ngOnInit(): void {
    this.token=sessionStorage.getItem("token");
    this.userinfo=this.serviceUser.getUserInfo();
    this.findid(this.userinfo.nombreUsuario);
  }

  findid(nombre:string):void{
    if(this.userinfo){
        this.serviceUser.findUserIdByNombre(nombre).subscribe(
          userId => {
           this.id=userId.toString();
          }
        );

    }
  }
  addPokemon(): void {
    this.user_poke_info.userPokemonId = this.id;
    this.serviciosPokemon.addpokemon(this.user_poke_info).subscribe(
      (response) => {
        this.successMessage="Pokemon añadido exitosamente";
        this.errorMessage="";
    },
    (error) => {
        this.errorMessage="Error al añadir el pokemon";
        this,this.successMessage="";
    }

    );

  }
  navigateuser(){
    this.router.navigate(["/user"]);
  }

}



