export interface PartyInfo {
  label: string;
  abbreviation: string;
  color: string;
}

export const partyMap: Record<string, PartyInfo> = {
  Socialdemokraterna: { label: 'Socialdemokraterna', abbreviation: 'S', color: '#c1272d' },
  Moderaterna: { label: 'Moderaterna', abbreviation: 'M', color: '#1f4a8a' },
  Centerpartiet: { label: 'Centerpartiet', abbreviation: 'C', color: '#6f9f3d' },
  Liberalerna: { label: 'Liberalerna', abbreviation: 'L', color: '#ffd100' },
  Kristdemokraterna: { label: 'Kristdemokraterna', abbreviation: 'KD', color: '#003f74' },
  Sverigedemokraterna: { label: 'Sverigedemokraterna', abbreviation: 'SD', color: '#1d5c97' },
  Vänsterpartiet: { label: 'Vänsterpartiet', abbreviation: 'V', color: '#d44f6c' },
  Miljöpartiet: { label: 'Miljöpartiet', abbreviation: 'MP', color: '#6bb741' },
  Övriga: { label: 'Övriga', abbreviation: 'Ö', color: '#6b7280' },
};

export const getPartyInfo = (party: string): PartyInfo => {
  return partyMap[party] ?? { label: party, abbreviation: party.slice(0, 2).toUpperCase(), color: '#6b7280' };
};
