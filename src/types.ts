export type Topic = 'Ekonomi' | 'Miljö' | 'Utbildning' | 'Energi' | 'Hälsa' | 'Rättsväsende';

export interface VoteParty {
  party: string;
  yes: number;
  no: number;
  abstain: number;
}

export interface Decision {
  id: string;
  title: string;
  date: string;
  source: 'Riksdagen' | 'Regeringen';
  type: string;
  department: string;
  committee: string;
  topics: Topic[];
  summary: string;
  voteSummary: VoteParty[];
  riksdagenLink: string;
  governmentLink: string;
  status: string;
}
