export class Pokemon {
    id: number;
    name: string;
    types: string[];
    abilities: string[];
    sprite_url: string;
  
    constructor(data: Partial<Pokemon>) {
      Object.assign(this, data);
    }
  }
  