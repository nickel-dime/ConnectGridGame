export interface AnswerData {
  boxData: PlayerData[];
  daily: DailyData | false;
}

export interface PlayerData {
  playerGuessed: Player | null;
  answers: any[];
}

export interface DailyData {
  place: string;
  rarity: string;
  average_score: string;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  yearStart: string;
  yearEnd: string;
  profilePic: string;
  percentGuessed: string;
  link: string;
}
