import { HeroDTO, HeroDTOCreation } from '../interfaces/hero-dto.interface';

export class HeroMapper {
  static toDTOCreation(data: HeroDTO): HeroDTOCreation {
    return {
      name: data.name,
      realName: data.realName,
      power: data.power,
      intelligence: data.intelligence,
      universe: data.universe,
    };
  }
}
