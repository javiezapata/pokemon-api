import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Pokemon } from '../entities/pokemon.entity';
import { PokeApiAdapter } from '../adapters/pokeapi.adapter';

@Injectable()
export class PokemonService {
  constructor(
    private readonly pokeApiAdapter: PokeApiAdapter,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getPokemonByIdOrName(idOrName: string | number): Promise<Pokemon> {
    // Check if data is in cache first
    const cacheKey = `pokemon_${idOrName}`;
    const cachedData = await this.cacheManager.get<Pokemon>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API
    const pokemon = await this.pokeApiAdapter.getPokemonByIdOrName(idOrName);
    
    // Store in cache for 1 hour (3600 seconds)
    await this.cacheManager.set(cacheKey, pokemon, 3600000);
    
    return pokemon;
  }
}