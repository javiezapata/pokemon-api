import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { PokemonController } from './controller/pokemon.controller';
import { PokemonService } from './services/pokemon.service';
import { PokeApiAdapter } from './adapters/pokeapi.adapter';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600000, // 1 hour in milliseconds
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiAdapter],
})
export class AppModule {}


