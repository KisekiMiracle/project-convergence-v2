interface LocationModel {
  id: number;
  name: string;
}

export class Location {
  public id: number;
  public name: string;

  constructor({ id, name }: LocationModel) {
    this.id = id;
    this.name = name;
  }
}
