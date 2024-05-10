import { TestBed } from '@angular/core/testing';

import { ServicePokemonsService } from './service-pokemons.service';

describe('ServicePokemonsService', () => {
  let service: ServicePokemonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicePokemonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
