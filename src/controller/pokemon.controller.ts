import { Controller, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../entities/pokemon.entity';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get(':idOrName')
  async getPokemon(@Param('idOrName') idOrName: string): Promise<Pokemon> {
    try {
      return await this.pokemonService.getPokemonByIdOrName(idOrName);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error retrieving pokemon data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

