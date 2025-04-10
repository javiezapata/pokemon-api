import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PokemonService } from './pokemon.service';
import { PokeApiAdapter } from '../adapters/pokeapi.adapter';
import { Pokemon } from '../entities/pokemon.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PokemonService', () => {
  let service: PokemonService;
  let pokeApiAdapter: PokeApiAdapter;
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: PokeApiAdapter,
          useValue: {
            getPokemonByIdOrName: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    pokeApiAdapter = module.get<PokeApiAdapter>(PokeApiAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPokemonByIdOrName', () => {
    it('should return pokemon from cache if available', async () => {
      const mockPokemon = new Pokemon({
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      });

      cacheManager.get.mockResolvedValue(mockPokemon);

      const result = await service.getPokemonByIdOrName(25);
      
      expect(result).toEqual(mockPokemon);
      expect(cacheManager.get).toHaveBeenCalledWith('pokemon_25');
      expect(pokeApiAdapter.getPokemonByIdOrName).not.toHaveBeenCalled();
    });

    it('should fetch pokemon from API and cache it when not in cache', async () => {
      const mockPokemon = new Pokemon({
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      });

      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(pokeApiAdapter, 'getPokemonByIdOrName').mockResolvedValue(mockPokemon);

      const result = await service.getPokemonByIdOrName(25);
      
      expect(result).toEqual(mockPokemon);
      expect(cacheManager.get).toHaveBeenCalledWith('pokemon_25');
      expect(pokeApiAdapter.getPokemonByIdOrName).toHaveBeenCalledWith(25);
      expect(cacheManager.set).toHaveBeenCalledWith('pokemon_25', mockPokemon, 3600000);
    });

    it('should propagate errors from the adapter', async () => {
      cacheManager.get.mockResolvedValue(null);
      jest.spyOn(pokeApiAdapter, 'getPokemonByIdOrName').mockRejectedValue(
        new HttpException('Pokemon not found', HttpStatus.NOT_FOUND),
      );

      await expect(service.getPokemonByIdOrName('invalidName')).rejects.toThrow(
        new HttpException('Pokemon not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});