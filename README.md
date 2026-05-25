# Politik för unga

En React/Vite-prototyp som visar hur man kan bygga en app för politiska beslut med data från Riksdagens öppna API och Regeringens publiceringar.

## Funktioner

- Lista med dagens beslut och pressmeddelanden.
- Detaljvy med neutral AI-sammanfattning och partivis röstfördelning.
- Tema- och ämnesmarkeringar baserat på departement.
- Stöd för att kombinera Riksdagens dokument-API och regeringens data via exempel-JSON.

## API-mappning

### Riksdagen
- `https://data.riksdagen.se/dokumentlista/?utformat=json` för ärenden, propositioner och dokument.
- `https://data.riksdagen.se/voteringlista/?utformat=json` för voteringar.
- Filtrera med parametrar som `doktyp`, `rm`, `sok`, `org`, `begrepp`.

### Regeringen / g0v
- Officiellt API saknas, men civilsamhällesprojekt och JSON-endpoints kan användas.
- Exempel:
  - `pressmeddelanden.json`
  - `rattsliga-dokument/proposition.json`
  - `rattsliga-dokument/remiss.json`

### Datahantering
- Beslut kan kategoriseras med egna ämnesetiketter.
- Departement kan mappas till teman som `Ekonomi`, `Miljö`, `Utbildning`.
- Voteringsdata kan aggregeras per parti och visualiseras med staplar.

## Kör projektet

1. Installera:
   ```bash
   npm install
   ```
2. Starta:
   ```bash
   npm run dev
   ```

## Designprinciper

- Ungdomlig, färgstark och luftig design.
- Tydliga kort, stora rubriker och tillgängliga färgkontraster.
- Transparens: visa alltid länk till originalkälla.
- Neutral ton: separera regeringens motiv, oppositionens synpunkter och vad det betyder för användaren.

## Nästa steg

- Koppla in verkliga API-anrop i `src/api/riksdagen.ts` och `src/api/regeringen.ts`.
- Fyll i OpenAI-nyckel i sidofältet (`ApiKeyInput`) för att aktivera AI-sammanfattningar.
- Lägg till AI-sammanfattning via en modell och be den generera neutrala, faktabaserade texter.
- Implementera sparade favoriter, filter och ämnessök.
