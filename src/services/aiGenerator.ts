import { generateSummary } from './openai';
import { insertDecisions } from './supabase';
import type { Decision, Topic } from '../types';

const TOPICS: Topic[] = ['Ekonomi', 'Miljö', 'Utbildning', 'Energi', 'Hälsa', 'Rättsväsende'];
const PARTIES = ['S', 'M', 'SD', 'V', 'MP', 'L', 'C', 'KD', 'D'];
const DEPARTMENTS = ['Finansdepartementet', 'Miljödepartementet', 'Utbildningsdepartementet', 'Energidepartementet', 'Socialdepartementet', 'Justitiedepartementet'];
const COMMITTEES = ['Finansutskottet', 'Miljö- och jordbruksutskottet', 'Utbildningsutskottet', 'Energi- och näringsutskottet', 'Socialutskottet', 'Justitieutskottet'];

// Swedish political decision titles
const DECISION_TEMPLATES = [
  'Förslag om {topic}-reform: {subject}',
  'Proposition om ny {topic}-politik för {subject}',
  'Riksdagsbeslut: {subject} inom {topic}',
  'Regeringsproposition: Stärkt {topic} genom {subject}',
  'Motion om {subject}: En ny väg för {topic} i Sverige',
  'Betänkande om {subject} och dess {topic}-inverkan',
  'Lagförslag: {subject} för förbättrad {topic}',
  'Direktiv för {subject}: {topic}-område',
];

const SUBJECTS = [
  'klimatmål och hållbarhet',
  'infrastruktur och vägtransport',
  'skattereformen',
  'sjukvårdsreformen',
  'utbildningsstandarden',
  'pensionssystemet',
  'arbetsmiljölagen',
  'bostadsmarknaden',
  'energiomställningen',
  'jämställdhetsfrågor',
  'invandringspolitiken',
  'kommunalekonomin',
  'it-säkerheten',
  'konsumentskyddet',
  'miljöstandarden',
];

// Generate a realistic Swedish political summary
function generatePoliticalSummary(title: string, topic: Topic, subject: string): string {
  const summaries = [
    `Regeringen föreslår nya riktlinjer för ${topic.toLowerCase()} som fokuserar på ${subject}. Förslaget syftar till att modernisera regelverket och förbättra effektiviteten inom området.`,
    `Denna proposition behandlar viktiga frågor kring ${subject} med fokus på ${topic.toLowerCase()}. Målet är att skapa ett mer hållbart system genom att implementera nya bestämmelser.`,
    `Riksdagen diskuterar förslag om förbättringar inom ${topic.toLowerCase()} relaterat till ${subject}. Beslutet handlar om att balansera ekonomi med samhällets behov.`,
    `Denna reform syftar till att stärka ${topic.toLowerCase()} genom bättre reglering av ${subject}. Flera riksdagspartier har framfört synpunkter på lagförslaget.`,
    `Regeringens proposition presenterar en ny strategi för ${subject} inom ${topic.toLowerCase()}. Förslagets syfte är att möta framtidens utmaningar på ett konstruktivt sätt.`,
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}

// Generate random vote distribution
function generateVotes() {
  const yes = Math.floor(Math.random() * 50) + 100;
  const no = Math.floor(Math.random() * 40) + 20;
  return { yes, no, abstain: Math.floor(Math.random() * 5) };
}

// Generate a single decision
export function generateDecision(index: number, topics: Topic[] = []): Decision {
  const topicPool = topics.length ? topics : TOPICS;
  const topicCount = Math.min(topicPool.length, Math.floor(Math.random() * 2) + 1);
  const shuffledTopics = [...topicPool].sort(() => Math.random() - 0.5);
  const topicsSelected = shuffledTopics.slice(0, topicCount) as Topic[];
  const primaryTopic = topicsSelected[0];
  const template = DECISION_TEMPLATES[Math.floor(Math.random() * DECISION_TEMPLATES.length)];
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  
  const title = template
    .replace('{topic}', primaryTopic.toLowerCase())
    .replace('{subject}', subject);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 180));
  
  const votes = PARTIES.map(party => ({
    party,
    ...generateVotes(),
  }));

  const source = Math.random() > 0.5 ? 'Riksdagen' : 'Regeringen';

  return {
    id: `decision-${Date.now()}-${index}`,
    title,
    date: baseDate.toISOString().split('T')[0],
    source,
    type: source === 'Riksdagen' ? 'Riksdagsbeslut' : 'Proposition',
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    committee: COMMITTEES[Math.floor(Math.random() * COMMITTEES.length)],
    topics,
    summary: generatePoliticalSummary(title, primaryTopic, subject),
    voteSummary: votes,
    riksdagenLink: `https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/2024/${Math.floor(Math.random() * 1000)}`,
    governmentLink: `https://www.regeringen.se/pressmeddelanden/2024/${Math.floor(Math.random() * 1000)}/`,
    status: Math.random() > 0.3 ? 'Antagen' : 'Pågående',
  };
}

// Generate batch of decisions
export function generateDecisionsBatch(count: number, topics: Topic[] = []): Decision[] {
  const decisions: Decision[] = [];
  for (let i = 0; i < count; i++) {
    decisions.push(generateDecision(i, topics));
  }
  return decisions;
}

// Generate and save decisions to database
export async function generateAndSaveDecisions(
  count: number,
  topics: Topic[] = [],
  onProgress?: (progress: number, total: number) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Starting to generate ${count} decisions...`);
    
    // Generate decisions in batches to avoid overwhelming the API
    const batchSize = 10;
    const batches = Math.ceil(count / batchSize);
    
    for (let b = 0; b < batches; b++) {
      const start = b * batchSize;
      const end = Math.min(start + batchSize, count);
      const batchCount = end - start;
      
      const decisions = generateDecisionsBatch(batchCount, topics);
      
      // Enhance with AI summaries (optional - can be slow)
      // const enhanced = await Promise.all(
      //   decisions.map(async (decision) => ({
      //     ...decision,
      //     summary: await generateSummary(decision.summary),
      //   }))
      // );
      
      const result = await insertDecisions(decisions);
      
      if (!result.success) {
        console.error(`Failed to save batch ${b + 1}/${batches}`, result.error);
        return { success: false, error: result.error };
      }
      
      if (onProgress) {
        onProgress(end, count);
      }
      
      console.log(`Batch ${b + 1}/${batches} saved (${end}/${count})`);
    }
    
    console.log(`Successfully generated and saved ${count} decisions!`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error generating decisions:', error);
    return { success: false, error: message };
  }
}
