import { Envelope } from './types';

const KEYWORD_MAP: Record<string, string[]> = {
  Food: [
    'grocery', 'groceries', 'supermarket', 'woolies', 'woolworths', 'coles', 'aldi',
    'iga', 'foodland', 'fruit', 'veg', 'vegetable', 'bread', 'milk', 'meat', 'chicken',
    'fish', 'chips', 'takeaway', 'takeout', 'pizza', 'burger', 'lunch', 'dinner',
    'breakfast', 'coffee', 'cafe', 'restaurant', 'bakery', 'butcher', 'deli',
    'sushi', 'kebab', 'maccas', "mcdonald's", 'kfc', 'subway', 'hungry jacks',
    'food', 'meal', 'snack', 'lollies', 'chocolate', 'biscuits', 'drinks',
    'juice', 'water', 'eggs', 'cheese', 'pasta', 'rice', 'noodles', 'soup',
    'ice cream', 'yoghurt', 'butter', 'sauce',
  ],
  Petrol: [
    'petrol', 'fuel', 'diesel', 'gas', 'servo', 'service station', 'bp', 'shell',
    'caltex', 'ampol', 'mobil', 'united', '7-eleven', 'speedway', 'liberty',
    'fuel', 'unleaded', 'premium', 'e10', 'ethanol',
  ],
  Entertainment: [
    'movie', 'cinema', 'film', 'netflix', 'spotify', 'disney', 'prime', 'streaming',
    'game', 'games', 'toy', 'toys', 'lego', 'book', 'books', 'magazine',
    'concert', 'show', 'theatre', 'theatre', 'event', 'ticket', 'tickets',
    'bowling', 'laser', 'theme park', 'zoo', 'museum', 'aquarium', 'beach',
    'sport', 'swimming', 'pool', 'park', 'outing', 'fun', 'activity',
    'gym', 'fitness', 'yoga', 'dance', 'music', 'subscription',
  ],
  School: [
    'school', 'education', 'stationery', 'stationary', 'pencil', 'pen', 'ruler',
    'notebook', 'textbook', 'uniform', 'excursion', 'camp', 'sport', 'swimming',
    'fees', 'tutor', 'tutoring', 'homework', 'study', 'library', 'school lunch',
    'canteen', 'disco', 'fundraiser', 'portrait', 'photo',
  ],
  Household: [
    'hardware', 'bunnings', 'cleaning', 'cleaner', 'mop', 'broom', 'vacuum',
    'electricity', 'power', 'gas bill', 'water bill', 'internet', 'phone bill',
    'rates', 'rent', 'mortgage', 'insurance', 'maintenance', 'repair', 'plumber',
    'electrician', 'garden', 'lawn', 'mowing', 'plants', 'pots', 'soil',
    'toilet paper', 'detergent', 'washing', 'laundry', 'dishwasher', 'bleach',
    'batteries', 'bulb', 'paint', 'timber', 'screw', 'tools',
  ],
  Personal: [
    'haircut', 'hair', 'barber', 'salon', 'clothing', 'clothes', 'shoes', 'boots',
    'shirt', 'pants', 'dress', 'jacket', 'underwear', 'socks', 'hat',
    'pharmacy', 'chemist', 'medicine', 'prescription', 'doctor', 'dentist',
    'medical', 'health', 'vitamin', 'sunscreen', 'cosmetics', 'makeup',
    'deodorant', 'shampoo', 'conditioner', 'soap', 'toothpaste', 'razor',
    'perfume', 'cologne', 'accessories', 'jewellery', 'watch', 'bag',
    'kmart', 'target', 'big w', 'cotton on',
  ],
};

export interface ParsedSpend {
  amount: number;
  description: string;
  suggestedEnvelopeName: string | null;
  confidence: 'high' | 'medium' | 'low';
}

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};

function parseNumberWords(text: string): number | null {
  const words = text.toLowerCase().split(/[\s-]+/);
  let total = 0;
  let current = 0;
  let found = false;

  for (const word of words) {
    if (word in NUMBER_WORDS) {
      found = true;
      const val = NUMBER_WORDS[word];
      if (val === 100) {
        current = (current === 0 ? 1 : current) * 100;
      } else {
        current += val;
      }
    }
  }

  if (found) {
    total = current;
    return total;
  }
  return null;
}

export function parseSpendText(text: string, envelopes: Envelope[]): ParsedSpend {
  const trimmed = text.trim();

  // Try to extract dollar amount: $42.50 or 42.50 at start
  const dollarMatch = trimmed.match(/^\$?([\d]+(?:\.\d{1,2})?)\s+(.+)$/);
  if (dollarMatch) {
    const amount = parseFloat(dollarMatch[1]);
    const description = dollarMatch[2].trim();
    const suggested = suggestEnvelope(description, envelopes);
    return {
      amount,
      description,
      suggestedEnvelopeName: suggested?.name ?? null,
      confidence: suggested ? 'high' : 'low',
    };
  }

  // Try description then amount: "lunch $18" or "lunch 18"
  const descFirstMatch = trimmed.match(/^(.+?)\s+\$?([\d]+(?:\.\d{1,2})?)$/);
  if (descFirstMatch) {
    const description = descFirstMatch[1].trim();
    const amount = parseFloat(descFirstMatch[2]);
    const suggested = suggestEnvelope(description, envelopes);
    return {
      amount,
      description,
      suggestedEnvelopeName: suggested?.name ?? null,
      confidence: suggested ? 'high' : 'low',
    };
  }

  // Try to handle word numbers: "twenty two dollars lunch"
  const wordNumberMatch = trimmed.match(
    /^((?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)(?:\s+(?:and\s+)?(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred))*)\s+(?:dollars?\s+)?(.+)$/i
  );

  if (wordNumberMatch) {
    const numText = wordNumberMatch[1];
    const description = wordNumberMatch[2].trim();
    const amount = parseNumberWords(numText);
    if (amount !== null && amount > 0) {
      const suggested = suggestEnvelope(description, envelopes);
      return {
        amount,
        description,
        suggestedEnvelopeName: suggested?.name ?? null,
        confidence: suggested ? 'medium' : 'low',
      };
    }
  }

  // Fallback: extract any number found
  const anyNumber = trimmed.match(/\$?([\d]+(?:\.\d{1,2})?)/);
  if (anyNumber) {
    const amount = parseFloat(anyNumber[1]);
    const description = trimmed.replace(anyNumber[0], '').trim();
    const suggested = suggestEnvelope(description || trimmed, envelopes);
    return {
      amount,
      description: description || trimmed,
      suggestedEnvelopeName: suggested?.name ?? null,
      confidence: 'low',
    };
  }

  return { amount: 0, description: trimmed, suggestedEnvelopeName: null, confidence: 'low' };
}

export function suggestEnvelope(description: string, envelopes: Envelope[]): Envelope | null {
  const lower = description.toLowerCase();

  // First try to match against envelope names directly
  for (const envelope of envelopes) {
    if (envelope.isTravelFund) continue;
    if (lower.includes(envelope.name.toLowerCase())) {
      return envelope;
    }
  }

  // Try keyword matching
  let bestEnvelope: Envelope | null = null;
  let bestScore = 0;

  for (const [categoryName, keywords] of Object.entries(KEYWORD_MAP)) {
    const envelope = envelopes.find(e =>
      e.name.toLowerCase() === categoryName.toLowerCase() && !e.isTravelFund
    );
    if (!envelope) continue;

    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // longer keyword matches score higher
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEnvelope = envelope;
    }
  }

  return bestScore > 0 ? bestEnvelope : null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
}

export function getPositiveLanguage(budget: number, spent: number): string {
  const ratio = spent / budget;
  if (ratio <= 0.5) return 'Well under budget';
  if (ratio <= 0.8) return 'Tracking well';
  if (ratio <= 0.95) return 'Almost there';
  if (ratio <= 1.0) return 'Right on budget';
  if (ratio <= 1.1) return 'Needed a little more';
  if (ratio <= 1.2) return 'Closer than expected';
  return 'A learning week';
}
