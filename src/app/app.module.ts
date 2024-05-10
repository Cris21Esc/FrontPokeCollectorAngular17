import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CombateComponent } from './Components/combate/combate.component';
import { ErrorPersonalizadoComponent } from './Components/error-personalizado/error-personalizado.component';
import { GuardsComponent } from './Components/guards/guards.component';
import { HomeComponent } from './Components/home/home.component';
import { ListaPokemonsComponent } from './Components/lista-pokemons/lista-pokemons.component';
import { LoginComponent } from './Components/login/login.component';
import { MenuPrincipalComponent } from './Components/menu-principal/menu-principal.component';
import { PokedexComponent } from './Components/pokedex/pokedex.component';
import { PokemonComponent } from './Components/pokemon/pokemon.component';
import { RegisterComponent } from './Components/register/register.component';
import { UserComponent } from './Components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    CombateComponent,
    ErrorPersonalizadoComponent,
    GuardsComponent,
    HomeComponent,
    ListaPokemonsComponent,
    LoginComponent,
    MenuPrincipalComponent,
    PokedexComponent,
    PokemonComponent,
    RegisterComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
