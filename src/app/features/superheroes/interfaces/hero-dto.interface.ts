export interface HeroDTOCreation {
  name: string;
  realName: string;
  power: number;
  intelligence: number;
  universe: string;
}

export interface HeroDTO extends HeroDTOCreation {
  id: string;
}