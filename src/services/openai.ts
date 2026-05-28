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

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resolvedKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på svensk politik. Ditt uppdrag är att skapa korta, neutrala och lättförståliga sammanfattningar av riksdagsbeslut och regeringspropositioner. Svaret ska vara på svenska och fokusera på vad beslutet betyder för vanliga människor.',
          },
          {
            role: 'user',
            content: `Skapa en kort sammanfattning (2-3 meningar) av följande riksdagsbeslut eller regeringsproposition:\n\n${text}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return `Kunde inte generera sammanfattning: ${error.error?.message || 'Okänt fel'}`;
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;
    
    if (!summary) {
      return 'Kunde inte generera sammanfattning. Försök igen senare.';
    }

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Ett fel uppstod när AI-sammanfattningen skulle genereras. Kontrollera din internetanslutning.';
  }
}
