  import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
  import { HttpService } from '@nestjs/axios';
  import { Pokemon } from '../entities/pokemon.entity';
  import { catchError, firstValueFrom, map } from 'rxjs';
  import { AxiosError } from 'axios';
  
  @Injectable()
  export class PokeApiAdapter {
    private readonly baseUrl = 'https://pokeapi.co/api/v2';
  
    constructor(private readonly httpService: HttpService) {}
  
    async getPokemonByIdOrName(idOrName: string | number): Promise<Pokemon> {
      const url = `${this.baseUrl}/pokemon/${idOrName.toString().toLowerCase()}`;
  
      try {
        const { data } = await firstValueFrom(
          this.httpService.get(url).pipe(
            catchError((error: AxiosError) => {
              if (error.response?.status === 404) {
                throw new HttpException('Pokemon not found', HttpStatus.NOT_FOUND);
              }
              throw new HttpException(
                'Error fetching Pokemon data',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
        );
  
        return this.mapToPokemonEntity(data);
      } catch (error) {
        throw error;
      }
    }
  
    private mapToPokemonEntity(data: any): Pokemon {
      return new Pokemon({
        id: data.id,
        name: data.name,
        types: data.types.map(type => type.type.name),
        abilities: data.abilities.map(ability => ability.ability.name),
        sprite_url: data.sprites.front_default,
      });
    }
  }