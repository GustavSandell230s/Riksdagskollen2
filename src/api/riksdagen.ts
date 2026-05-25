import type { Decision, VoteParty } from '../types';

const baseUrl = 'https://data.riksdagen.se';

export async function fetchDecisions(query: string): Promise<Decision[]> {
  const url = `${baseUrl}/dokumentlista/?sok=${encodeURIComponent(query)}&utformat=json`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error('Riksdagen dokumentfetch misslyckades', response.status, response.statusText);
    return [];
  }

  const data = await response.json();
  const docs = data.dokumentlista?.dokument || [];

  return docs.map((item: any) => ({
    id: item.dok_id || item.dok_id || 'okänt',
    title: item.titel || 'Ingen titel',
    date: item.dok_datum || item.senastandrad || '',
    source: 'Riksdagen',
    type: item.doktyp || 'Okänt',
    department: item.departement || 'Okänt departement',
    committee: item.beredande_utskott || 'Okänt utskott',
    topics: [],
    summary: item.undertitel || item.ingress || '',
    voteSummary: [],
    riksdagenLink: item.dok_url || '',
    governmentLink: '',
    status: item.status || 'Okänd status',
  }));
}

export async function fetchVoteResults(dokId: string): Promise<VoteParty[]> {
  const url = `${baseUrl}/voteringlista/?dokument=${encodeURIComponent(dokId)}&utformat=json`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error('Riksdagen voteringsfetch misslyckades', response.status, response.statusText);
    return [];
  }

  const data = await response.json();
  const voting = data.voteringlista?.votering?.[0];

  if (!voting) {
    return [];
  }

  const parties = (voting.voteringsresultat || []).map((item: any) => ({
    party: item.parti || item.partinamn || 'Okänt',
    yes: Number(item.ja) || 0,
    no: Number(item.nej) || 0,
    abstain: Number(item.avstod) || 0,
  }));

  return parties;
}
