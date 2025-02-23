export interface QuestInterface {
  id: string;
  title: string;
  description: string;
  award: number;
}

export default class Quest implements QuestInterface {
  id: string;
  title: string;
  description: string;
  award: number;

  constructor(id: string, object: QuestInterface) {
    this.id = id;
    this.title = object?.title || 'Quest';
    this.description = object?.description || '';
    this.award = object?.award || 0;
  }
}
