import type { Topic } from '../types';

export const topicMap: Record<Topic, { label: string; color: string }> = {
  Ekonomi: { label: 'Ekonomi', color: '#3F7D20' },
  Miljö: { label: 'Miljö', color: '#147D5A' },
  Utbildning: { label: 'Utbildning', color: '#1D4E89' },
  Energi: { label: 'Energi', color: '#B26A00' },
  Hälsa: { label: 'Hälsa', color: '#8E2D30' },
  Rättsväsende: { label: 'Rättsväsende', color: '#5E4A7D' },
};

export const departmentTopic: Record<string, Topic> = {
  Finansdepartementet: 'Ekonomi',
  Miljödepartementet: 'Miljö',
  Utbildningsdepartementet: 'Utbildning',
  Socialdepartementet: 'Hälsa',
  Näringsdepartementet: 'Energi',
  Justitiedepartementet: 'Rättsväsende',
};
