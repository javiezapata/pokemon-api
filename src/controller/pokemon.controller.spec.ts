import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../entities/pokemon.entity';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            getPokemonByIdOrName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPokemon', () => {
    it('should return a pokemon by id', async () => {
      const mockPokemon = new Pokemon({
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      });

      jest.spyOn(service, 'getPokemonByIdOrName').mockResolvedValue(mockPokemon);

      const result = await controller.getPokemon('25');
      expect(result).toEqual(mockPokemon);
      expect(service.getPokemonByIdOrName).toHaveBeenCalledWith('25');
    });

    it('should return a pokemon by name', async () => {
      const mockPokemon = new Pokemon({
        id: 25,
        name: 'pikachu',
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      });

      jest.spyOn(service, 'getPokemonByIdOrName').mockResolvedValue(mockPokemon);

      const result = await controller.getPokemon('pikachu');
      expect(result).toEqual(mockPokemon);
      expect(service.getPokemonByIdOrName).toHaveBeenCalledWith('pikachu');
    });

    it('should handle 404 error when pokemon not found', async () => {
      jest.spyOn(service, 'getPokemonByIdOrName').mockRejectedValue(
        new HttpException('Pokemon not found', HttpStatus.NOT_FOUND),
      );

      await expect(controller.getPokemon('invalidName')).rejects.toThrow(
        new HttpException('Pokemon not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});