import { HeroDTOCreation } from '../interfaces/hero-dto.interface';

export class HeroMapper {
  static toDTO(data: Record<string, unknown>): HeroDTOCreation {
    return {
      name: String(data['name']),
      realName: String(data['realName']),
      power: Number(data['power']),
      intelligence: Number(data['intelligence']),
      universe: String(data['universe']),
    };
  }
}
