import { Component, OnInit } from '@angular/core';
import { ServicepokemonsService} from "../../service-pokemons.service";
import { Router } from '@angular/router';
import { ServiceusersService} from "../../service-users.service";
import { EquipoPokemon} from "../../equipo-pokemon";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']

})
export class UserComponent implements OnInit {

  token: string | null = null;

  userInfo: any;

  caughtPokemons: string[] = [];

  iduser:number|undefined;

  username:string="";

  stringid:string="";
  mensajeBack:string="";
  equipoCrear:number|undefined;
  numEquipos:number=1;
  equiposBack:EquipoPokemon[]=[];
  equipos:number[] = [];
  pokesInEquipo: number = 0;
  pokesArray: number[] =[];

  constructor(private servicepokemons:ServicepokemonsService,private router: Router,private  serviceUser:ServiceusersService) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.userInfo = this.servicepokemons.getUserInfo();
    this.username=this.userInfo.nombreUsuario;
    this.showpokes(this.username)
    this.servicepokemons.findUserIdByNombre(this.userInfo.nombreUsuario).subscribe(
      (userId)=>{
        this.iduser=userId;
        this.servicepokemons.findAllEquiposByUserId(userId).subscribe(data=>{
          console.log(data);
          data.forEach(equipo=>{
            this.equiposBack.push(equipo);
          });
        });
      });
  }
  showpokes(nombre:string){
      if (this.userInfo) {
        this.servicepokemons.obteneruserPokemons(nombre).subscribe(
          (data: string[]) => {
            this.caughtPokemons = data;
          },
          (error) => {
            console.log("No se pudo obtener la lista de pokemons:", error);
          }
        );
      }
    }

    navigatepokemon(){
      this.router.navigate(["/pokemon"]);
    }

  deletepokemon(idpokemondelete:string){
    this.servicepokemons.findUserIdByNombre(this.userInfo.nombreUsuario).subscribe(
      (userId)=>{
        this.iduser=userId;
        this.stringid=this.iduser.toString();
        this.serviceUser.deletepokemon(idpokemondelete,this.stringid).subscribe(
        ()=>{
          this.showpokes(this.username);
        }
      );
      })
  }

  addPokeToEquipo(poke: string, num: any) {
    if(this.pokesInEquipo<6){
      this.pokesInEquipo++;
      this.pokesArray.push(parseInt(poke));
      let img = document.createElement("img")
      img.src = "/assets/gifs/"+parseInt(poke)+".gif";
      img.loading="lazy";
      img.addEventListener("click", () => {
        this.remove(img);
      });
      // @ts-ignore
      document.getElementById("equipoCrear").appendChild(img);
    }else{
      // @ts-ignore
      document.getElementById("errorPokes").classList.add("text-danger");
      // @ts-ignore
      document.getElementById("errorPokes").classList.remove("text-success");
    }
  }
  guardarEquipo() {
    let equipo = new EquipoPokemon();
    equipo.user_id = <number> this.iduser;
    // @ts-ignore
    equipo.nombre = document.getElementById('nombreEquipoPokemon').value;
    equipo.pokemon1_id = this.pokesArray[0];
    equipo.pokemon2_id = this.pokesArray[1];
    equipo.pokemon3_id = this.pokesArray[2];
    equipo.pokemon4_id = this.pokesArray[3];
    equipo.pokemon5_id = this.pokesArray[4];
    equipo.pokemon6_id = this.pokesArray[5];
    this.serviceUser.guardarTeam(equipo).subscribe((message)=>{
      // @ts-ignore
      document.getElementById("crearEquipoDiv").classList.add("d-none");
      this.mensajeBack = message.message;
    });
  }

  crearEquipo() {
    // @ts-ignore
    document.getElementById("crearEquipoDiv").classList.remove("d-none");
    this.equipos.push(this.numEquipos++);
    this.equipoCrear = this.numEquipos;
  }
  remove(elem:HTMLElement){
    this.pokesInEquipo--;
    elem.remove();
  }
}
