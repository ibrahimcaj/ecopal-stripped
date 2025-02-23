export enum QUEST_ASSERTIONS {
  ELECTRIC_BILL,
  WATER_BILL,
  ASSERTION,
  RECYCLE_INQUIRY,
}

export interface QuestInterface {
  id: string;
  title: string;
  description: string;
  assertionType: QUEST_ASSERTIONS;
  assertion?: string;
  award: number;
}

export const QUESTS: QuestInterface[] = [
  {
    id: '1',
    title: 'Skeniraj račun za električnu energiju',
    description: 'Skeniraj račun za električnu energiju',
    assertionType: QUEST_ASSERTIONS.ELECTRIC_BILL,
    award: 50,
  },
  {
    id: '2',
    title: 'Skeniraj račun za vodu',
    description: 'Skeniraj račun za vodu',
    assertionType: QUEST_ASSERTIONS.WATER_BILL,
    award: 50,
  },
  {
    id: '3',
    title: 'Šetnja na posao/školu',
    description: 'Šetanje na posao/školu',
    assertionType: QUEST_ASSERTIONS.ASSERTION,
    assertion: 'Na slici se vide noge muškarca ili žene kako hodaju.',
    award: 30,
  },
  {
    id: '4',
    title: 'Šetnja u parku',
    description: 'Šetnja u parku',
    assertionType: QUEST_ASSERTIONS.ASSERTION,
    assertion: 'Na slici se vide muškarca ili žene kako šetaju parkom.',
    award: 20,
  },
  {
    id: '5',
    title: 'Slikanje psa/mačke',
    description: 'Slikanje psa/mačke',
    assertionType: QUEST_ASSERTIONS.ASSERTION,
    assertion: 'Na slici se vidi mačka ili pas, ili bilo koji ljubimac, u parku.',
    award: 40,
  },
  {
    id: '6',
    title: 'Saznaj kako reciklirati neki predmet',
    description: 'Skeniraj svesku ili neki drugi predmet',
    assertionType: QUEST_ASSERTIONS.RECYCLE_INQUIRY,
    award: 40,
  },
  {
    id: '7',
    title: 'Zalij svoje kućne biljke',
    description: 'Zalij bilje bez silje',
    assertionType: QUEST_ASSERTIONS.ASSERTION,
    assertion: 'Na slici se vidi muškarac/žena (ili dio, po mogućnosti ruka) koji zalijeva biljku.',
    award: 20,
  },
  {
    id: '8',
    title: 'Uslikaj crnu boju',
    description: '',
    assertionType: QUEST_ASSERTIONS.ASSERTION,
    assertion: 'Na slici se ne vidi ništa.',
    award: 20,
  },
];

export const getDailyQuest = (completedQuests: string[]): QuestInterface | null => {
  const today = new Date().toISOString().split('T')[0];
  const dailyQuest = QUESTS.find(
    (quest) =>
      !completedQuests.includes(quest.id) &&
      quest.id !== today &&
      quest.assertionType !== QUEST_ASSERTIONS.ELECTRIC_BILL &&
      quest.assertionType !== QUEST_ASSERTIONS.WATER_BILL
  );
  return dailyQuest || null;
};

export const getMonthlyBillQuest = (completedQuests: string[]): QuestInterface | null => {
  const currentMonth = new Date().getMonth();
  const monthlyBillQuest = QUESTS.find(
    (quest) =>
      !completedQuests.includes(quest.id) &&
      (quest.assertionType === QUEST_ASSERTIONS.ELECTRIC_BILL || quest.assertionType === QUEST_ASSERTIONS.WATER_BILL) &&
      new Date(quest.id).getMonth() !== currentMonth
  );
  return monthlyBillQuest || null;
};
