import Anthropic from '@anthropic-ai/sdk';

// Get API key from environment variables
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

interface RecommendationRequest {
  mood: string;
  genre?: string;
  year?: string;
  type?: 'movie' | 'series';
}

interface AIRecommendation {
  title: string;
  year: string;
  reason: string;
  imdbId?: string;
}

export async function getAIRecommendations(
  request: RecommendationRequest
): Promise<AIRecommendation[]> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Claude API key is not configured');
  }

  const prompt = `
You are a movie recommendation expert. Based on the user's request, suggest 5 movies or series that match their preferences.

User Request:
- Mood: ${request.mood || 'any mood'}
${request.genre ? `- Genre: ${request.genre}` : ''}
${request.year ? `- Year: ${request.year}` : ''}
${request.type ? `- Type: ${request.type}` : ''}

Instructions:
1. Select 5 movies that best match the user's request
2. For each movie, provide:
   - Title
   - Year
   - A one-sentence explanation of why it matches
   - The IMDb ID (if you know it, otherwise leave empty)
3. If you can't find exact matches, suggest popular movies in similar categories
4. Format your response as a valid JSON array with this structure:
   [{ "title": "Movie Name", "year": "2023", "reason": "Explanation", "imdbId": "tt1234567" }]

Return ONLY the JSON array, no other text.
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    const text = content.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(recommendations)) {
      throw new Error('Invalid response format');
    }

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to get AI recommendations'
    );
  }
}

// Fallback recommendations if API fails
export function getFallbackRecommendations(mood: string): AIRecommendation[] {
  const fallbacks: Record<string, AIRecommendation[]> = {
    'happy': [
      { title: 'The Greatest Showman', year: '2017', reason: 'Uplifting musical with infectious energy' },
      { title: 'Singin\' in the Rain', year: '1952', reason: 'Classic feel-good musical comedy' },
      { title: 'Amélie', year: '2001', reason: 'Whimsical French comedy about finding joy in small things' },
    ],
    'sad': [
      { title: 'The Pursuit of Happyness', year: '2006', reason: 'Inspiring story of perseverance against odds' },
      { title: 'Eternal Sunshine', year: '2004', reason: 'Poignant exploration of memory and love' },
      { title: 'Life is Beautiful', year: '1997', reason: 'Finding hope and humor in dark times' },
    ],
    'scary': [
      { title: 'Hereditary', year: '2018', reason: 'Modern horror masterpiece with psychological depth' },
      { title: 'The Others', year: '2001', reason: 'Atmospheric ghost story with a twist' },
      { title: 'Get Out', year: '2017', reason: 'Horror meets social commentary brilliantly' },
    ],
    'thoughtful': [
      { title: 'Inception', year: '2010', reason: 'Mind-bending exploration of dreams and reality' },
      { title: 'Interstellar', year: '2014', reason: 'Epic sci-fi about love and time' },
      { title: 'The Matrix', year: '1999', reason: 'Philosophical action film about reality and choice' },
    ],
    'action': [
      { title: 'Mad Max: Fury Road', year: '2015', reason: 'Non-stop action masterpiece' },
      { title: 'John Wick', year: '2014', reason: 'Stylish action with incredible choreography' },
      { title: 'The Dark Knight', year: '2008', reason: 'Action thriller with depth' },
    ],
  };

  const key = Object.keys(fallbacks).find(k => mood.toLowerCase().includes(k));
  return (key ? fallbacks[key] : fallbacks.thoughtful).slice(0, 3);
}