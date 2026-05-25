import type { Decision } from '../types';

const g0vBase = 'https://g0v.se/regeringen';

export async function fetchGovernmentPressReleases(): Promise<Decision[]> {
  const url = `${g0vBase}/pressmeddelanden.json`;
  const response = await fetch(url);
  const data = await response.json();

  return (data || []).map((item: any) => ({
    id: item.id || item.url || 'okänd',
    title: item.title,
    date: item.date || item.published_at,
    source: 'Regeringen',
    type: 'Pressmeddelande',
    department: item.department || 'Okänt departement',
    committee: 'Ej utskott',
    topics: [],
    summary: item.description || item.intro || '',
    voteSummary: [],
    riksdagenLink: '',
    governmentLink: item.url || '',
    status: 'Pressmeddelande',
  }));
}

export async function fetchGovernmentPropositions(): Promise<Decision[]> {
  const url = `${g0vBase}/rattsliga-dokument/proposition.json`;
  const response = await fetch(url);
  const data = await response.json();

  return (data || []).map((item: any) => ({
    id: item.dokument_id || item.slug || 'okänd',
    title: item.title,
    date: item.date || item.published_at,
    source: 'Regeringen',
    type: 'Proposition',
    department: item.department || 'Okänt departement',
    committee: 'Ej utskott',
    topics: [],
    summary: item.description || '',
    voteSummary: [],
    riksdagenLink: '',
    governmentLink: item.url || '',
    status: 'Förslag',
  }));
}
