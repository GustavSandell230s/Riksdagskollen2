import { createClient } from '@supabase/supabase-js';
import type { Decision } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

function toDatabaseDecision(decision: Decision) {
  return {
    id: decision.id,
    title: decision.title,
    date: decision.date,
    source: decision.source,
    type: decision.type,
    department: decision.department,
    committee: decision.committee,
    topics: decision.topics,
    summary: decision.summary,
    vote_summary: decision.voteSummary,
    riksdagen_link: decision.riksdagenLink,
    government_link: decision.governmentLink,
    status: decision.status,
  };
}

function fromDatabaseDecision(item: any): Decision {
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    source: item.source,
    type: item.type,
    department: item.department,
    committee: item.committee,
    topics: item.topics || [],
    summary: item.summary || '',
    voteSummary: item.voteSummary || item.vote_summary || [],
    riksdagenLink: item.riksdagenLink || item.riksdagen_link || '',
    governmentLink: item.governmentLink || item.government_link || '',
    status: item.status || '',
  };
}

function toDatabaseUpdates(updates: Partial<Decision>) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (key === 'voteSummary') {
      result['vote_summary'] = value;
    } else if (key === 'riksdagenLink') {
      result['riksdagen_link'] = value;
    } else if (key === 'governmentLink') {
      result['government_link'] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Get all decisions from database
export async function getAllDecisions(): Promise<Decision[]> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching decisions:', error);
      return [];
    }

    return (data || []).map(fromDatabaseDecision);
  } catch (error) {
    console.error('Exception fetching decisions:', error);
    return [];
  }
}

// Get a single decision by ID
export async function getDecisionById(id: string): Promise<Decision | null> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching decision:', error);
      return null;
    }

    return data ? fromDatabaseDecision(data) : null;
  } catch (error) {
    console.error('Exception fetching decision:', error);
    return null;
  }
}

// Search decisions by title or summary
export async function searchDecisions(query: string): Promise<Decision[]> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error searching decisions:', error);
      return [];
    }

    return (data || []).map(fromDatabaseDecision);
  } catch (error) {
    console.error('Exception searching decisions:', error);
    return [];
  }
}

// Filter decisions by source
export async function getDecisionsBySource(
  source: 'Riksdagen' | 'Regeringen'
): Promise<Decision[]> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('source', source)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching by source:', error);
      return [];
    }

    return (data || []).map(fromDatabaseDecision);
  } catch (error) {
    console.error('Exception fetching by source:', error);
    return [];
  }
}

// Filter decisions by topic
export async function getDecisionsByTopic(topic: string): Promise<Decision[]> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .contains('topics', [topic])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching by topic:', error);
      return [];
    }

    return (data || []).map(fromDatabaseDecision);
  } catch (error) {
    console.error('Exception fetching by topic:', error);
    return [];
  }
}

// Insert a single decision
export async function insertDecision(decision: Decision): Promise<Decision | null> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .insert([toDatabaseDecision(decision)])
      .select()
      .single();

    if (error) {
      console.error('Error inserting decision:', error);
      return null;
    }

    return data ? fromDatabaseDecision(data) : null;
  } catch (error) {
    console.error('Exception inserting decision:', error);
    return null;
  }
}

// Insert multiple decisions (batch)
export async function insertDecisions(decisions: Decision[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('decisions')
      .insert(decisions.map(toDatabaseDecision));

    if (error) {
      const message = error.message || JSON.stringify(error);
      console.error('Error batch inserting decisions:', error);
      return { success: false, error: message };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Exception batch inserting decisions:', error);
    return { success: false, error: message };
  }
}

// Update a decision
export async function updateDecision(id: string, updates: Partial<Decision>): Promise<Decision | null> {
  try {
    const { data, error } = await supabase
      .from('decisions')
      .update(toDatabaseUpdates(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating decision:', error);
      return null;
    }

    return data ? fromDatabaseDecision(data) : null;
  } catch (error) {
    console.error('Exception updating decision:', error);
    return null;
  }
}

// Delete a decision
export async function deleteDecision(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('decisions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting decision:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting decision:', error);
    return false;
  }
}

// Check if database has any decisions
export async function hasDecisions(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('decisions')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking decisions:', error);
      return false;
    }

    return (count ?? 0) > 0;
  } catch (error) {
    console.error('Exception checking decisions:', error);
    return false;
  }
}
