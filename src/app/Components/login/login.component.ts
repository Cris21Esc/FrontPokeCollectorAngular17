import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceusersService} from "../../service-users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    nombre: '',
    contrasena: ''
  };

  numerorandom:number=0;

  redireccion:boolean|null=null;

  constructor(private router: Router, private userService:ServiceusersService) { }

  ngOnInit(): void {
    this.random();

  }

  random(){
    this.numerorandom=Math.floor(Math.random()*10)
  }

  login(): void {
    this.userService.login(this.credentials).subscribe(
      response => {
        console.log(response);
        this.redireccion=true;
        if(this.redireccion===true){
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', response.nombre);
          this.router.navigate(["/user"]);
          }
          this.userService.handleLogin(response)
      },
      error => {
        this.redireccion=false;
        this.userService.handleLoginError(error);
      }
    );
  }


}
