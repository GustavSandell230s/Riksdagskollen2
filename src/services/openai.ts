const LOCAL_STORAGE_KEY = 'OPENAI_API_KEY';

export function getSavedApiKey(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function saveApiKey(key: string) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, key);
}

export function clearSavedApiKey() {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export async function generateSummary(text: string, apiKey?: string): Promise<string> {
  const resolvedKey = apiKey || getSavedApiKey() || (import.meta.env.VITE_OPENAI_API_KEY as string | undefined);
  if (!resolvedKey) {
    return 'Ingen API-nyckel är konfigurerad. Klistra in din nyckel i sidofältet för att aktivera AI-sammanfattningar.';
  }

  return 'AI-sammanfattning aktiverad - här kan du använda modellen för att skapa en kort, neutral text baserad på officiella källor.';
}
