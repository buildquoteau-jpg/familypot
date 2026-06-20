export interface HistoricalSlide {
  id: string;
  decade: '1960s' | '1970s' | '1980s' | '1990s';
  year: number;
  title: string;
  content: string;
  imagePrompt: string;
  source: string;
  stat?: {
    label: string;
    then: string;
    now: string;
  };
}

export const historicalSlides: HistoricalSlide[] = [
  // 1960s
  {
    id: '60s-01',
    decade: '1960s',
    year: 1961,
    title: 'Australia in 1961',
    content: 'The 1961 Census counted 10,508,186 Australians. Most families had one income earner, and the average weekly wage for a man was around $23. Women who worked outside the home were the exception rather than the rule.',
    imagePrompt: 'A proud family outside their weatherboard home in suburban Australia, 1961. The father in a white shirt, the mother in an apron, two children on the front lawn.',
    source: 'Australian Bureau of Statistics, 1961 Census',
    stat: { label: 'Population', then: '10.5 million', now: '27 million' },
  },
  {
    id: '60s-02',
    decade: '1960s',
    year: 1963,
    title: 'The Family Car',
    content: 'The Holden EH was the car of choice for Australian families in 1963, costing around $2,100. In 1961, only 52% of households owned a car. Families with a car were considered comfortable.',
    imagePrompt: 'A polished Holden EH sedan parked in a driveway, family loading into it for a Sunday drive, 1963.',
    source: 'General Motors-Holden, National Archives of Australia',
    stat: { label: 'A new Holden EH', then: '$2,100', now: '$38,000+' },
  },
  {
    id: '60s-03',
    decade: '1960s',
    year: 1965,
    title: 'The Weekly Shop',
    content: 'An average Australian family spent around $15 on groceries each week in 1965. A loaf of bread cost 18 cents, milk was 12 cents a pint, and a dozen eggs cost 38 cents. The family shop happened at the local grocer, butcher, and greengrocer — rarely all under one roof.',
    imagePrompt: 'A mother in a floral dress pushing a wire trolley through a small grocery store, shelves stocked with tins and packets, 1965.',
    source: 'ABS Consumer Price Index, historical records',
    stat: { label: 'Loaf of bread', then: '18 cents', now: '$4.50' },
  },
  {
    id: '60s-04',
    decade: '1960s',
    year: 1966,
    title: 'Decimal Day',
    content: 'On 14 February 1966, Australia replaced pounds, shillings and pence with dollars and cents. "Dollar Bill" was the cartoon character on television who helped children understand the new money. Many adults found the change confusing at first.',
    imagePrompt: 'Children gathered around a television watching a cartoon character explaining new decimal coins, 1966.',
    source: 'Reserve Bank of Australia, Currency changeover 1966',
  },
  {
    id: '60s-05',
    decade: '1960s',
    year: 1968,
    title: 'Pocket Money',
    content: 'Children in the 1960s typically received between 10 and 30 cents pocket money each week. Most spent it at the corner shop on lollies, comics, and paddle pops. Saving up for weeks to buy a toy was a normal part of childhood.',
    imagePrompt: 'Two children at a corner shop counter, counting copper coins carefully to buy lollies from glass jars, 1968.',
    source: 'National Museum of Australia, Everyday Life collection',
    stat: { label: 'Average pocket money', then: '20 cents/week', now: '$10-$15/week' },
  },

  // 1970s
  {
    id: '70s-01',
    decade: '1970s',
    year: 1971,
    title: 'Australia in 1971',
    content: 'The 1971 Census recorded 12,755,638 Australians. The economy was strong and employment was high. A family could live comfortably on one wage of $60 per week — with money left over for savings.',
    imagePrompt: 'A bustling suburban street in Melbourne, 1971. Station wagons, women in midi-skirts, a milk bar with a hand-painted sign.',
    source: 'Australian Bureau of Statistics, 1971 Census',
    stat: { label: 'Average weekly wage', then: '$60', now: '$1,400+' },
  },
  {
    id: '70s-02',
    decade: '1970s',
    year: 1973,
    title: 'The Petrol Crisis',
    content: 'In October 1973, the OPEC oil embargo sent petrol prices soaring across the world. Australian families lined up at service stations, sometimes waiting hours to fill their tanks. The crisis taught a generation to be careful with fuel spending.',
    imagePrompt: 'A long queue of cars stretching around the block at a Caltex service station, anxious faces behind windscreens, 1973.',
    source: 'National Archives of Australia, oil crisis collection',
    stat: { label: 'Petrol price 1973', then: '8 cents/litre', now: '$2.00+/litre' },
  },
  {
    id: '70s-03',
    decade: '1970s',
    year: 1974,
    title: 'The Inflation Year',
    content: 'In 1974, inflation in Australia reached 17.6% — the highest ever recorded. Families felt the pinch at the supermarket checkout each week. Wages rose but often not fast enough to keep pace with prices.',
    imagePrompt: 'A tired-looking mother at a checkout register, examining her docket with concern, piles of groceries on the belt, 1974.',
    source: 'ABS Consumer Price Index, 1974',
    stat: { label: 'Inflation rate 1974', then: '17.6%', now: '2–3% target' },
  },
  {
    id: '70s-04',
    decade: '1970s',
    year: 1975,
    title: 'Colour Television',
    content: 'Colour television came to Australia in March 1975. Families gathered around their television sets to see sport, news, and entertainment in colour for the first time. A colour TV cost around $900 — months of savings for most families.',
    imagePrompt: 'A family of four on a floral lounge suite watching a large wooden-cabinet colour television together, 1975.',
    source: 'Australian Broadcasting Corporation archives',
    stat: { label: 'A colour television', then: '$900', now: '$300–500' },
  },
  {
    id: '70s-05',
    decade: '1970s',
    year: 1978,
    title: 'Working Mothers',
    content: 'By 1976, 38% of married women were in the workforce — up from 17% in the early 1960s. This was a time of significant change for Australian families. Many mothers juggled part-time work with raising children, and the two-income family was becoming more common.',
    imagePrompt: 'A woman in her work clothes picking up her children from school, shopping bags hanging from one arm, 1978.',
    source: 'ABS Labour Force Historical Statistics',
  },

  // 1980s
  {
    id: '80s-01',
    decade: '1980s',
    year: 1981,
    title: 'Australia in 1981',
    content: 'The 1981 Census counted 14,576,330 Australians. The average weekly wage had risen to $246. Two-income families were now the norm rather than the exception, and families had more to spend — but also more to spend it on.',
    imagePrompt: 'A suburban family sitting around a large kitchen table for Sunday dinner, the table covered in plates of roast meat and vegetables, 1981.',
    source: 'Australian Bureau of Statistics, 1981 Census',
    stat: { label: 'Average weekly wage', then: '$246', now: '$1,400+' },
  },
  {
    id: '80s-02',
    decade: '1980s',
    year: 1982,
    title: 'The Recession',
    content: 'Australia entered a severe recession in 1982-83, with unemployment rising above 10%. Families tightened their budgets, cut back on luxuries, and looked for ways to save. Many households returned to growing their own vegetables and making their own bread.',
    imagePrompt: 'A family in a backyard vegetable garden, all ages picking tomatoes and beans together, 1982.',
    source: 'ABS Economic Statistics, 1982–83',
    stat: { label: 'Unemployment 1983', then: '10.4%', now: '3–5%' },
  },
  {
    id: '80s-03',
    decade: '1980s',
    year: 1983,
    title: 'The Credit Card Arrives',
    content: 'Banking deregulation in 1983 opened the door for credit cards to reach ordinary Australian families. For the first time, you could spend money you did not yet have. This changed how families thought about money — and began the long relationship between households and debt.',
    imagePrompt: 'A man holding up a shiny credit card in a department store, wife beside him, looking at it with curiosity, 1983.',
    source: 'Reserve Bank of Australia, Financial Deregulation history',
  },
  {
    id: '80s-04',
    decade: '1980s',
    year: 1987,
    title: 'The Microwave Kitchen',
    content: 'By 1987, over half of Australian homes had a microwave oven. The Laminex kitchen benchtop — once the centrepiece of family life — now shared its space with electronic appliances. Family meals were changing.',
    imagePrompt: 'A 1980s kitchen with avocado green appliances, a microwave on the bench, family gathering around a Laminex table.',
    source: 'National Museum of Australia, 20th Century Domestic Life',
    stat: { label: 'Households with microwave', then: '52% by 1987', now: '95%+' },
  },
  {
    id: '80s-05',
    decade: '1980s',
    year: 1989,
    title: 'The Housing Boom',
    content: 'Sydney house prices tripled during the 1980s. A house that cost $35,000 in 1980 was worth $190,000 by 1989. For families who already owned, it was fantastic news. For young families trying to buy, it was a shock.',
    imagePrompt: 'An auctioneer on the front steps of a brick veneer home, a crowd of eager buyers with bidding paddles raised, 1989.',
    source: 'ABS Housing Price Indexes, historical',
    stat: { label: 'Sydney median house price', then: '$190,000 (1989)', now: '$1.1 million+' },
  },

  // 1990s
  {
    id: '90s-01',
    decade: '1990s',
    year: 1991,
    title: 'Australia in 1991',
    content: 'The 1991 Census recorded 16,850,540 Australians. Treasurer Paul Keating famously called the 1990-91 recession "the recession we had to have." Unemployment reached 11.2% and many families experienced real financial hardship for the first time.',
    imagePrompt: 'People reading a newspaper with the headline about the recession, queueing at a job centre, early 1990s.',
    source: 'ABS, 1991 Census. Treasury Economic Statement, 1991',
    stat: { label: 'Unemployment 1992', then: '11.2%', now: '3–5%' },
  },
  {
    id: '90s-02',
    decade: '1990s',
    year: 1993,
    title: 'The Corner Shop Disappears',
    content: 'During the 1990s, Woolworths and Coles expanded rapidly across Australia. The corner shop, the local milk bar, and the independent greengrocer began to disappear. Families did all their shopping under one roof for the first time.',
    imagePrompt: 'A brand new large Woolworths supermarket exterior, modern and bright, contrasted with a small milk bar next door that looks tired and empty, 1993.',
    source: 'National Museum of Australia, Retail History Collection',
  },
  {
    id: '90s-03',
    decade: '1990s',
    year: 1995,
    title: 'The Internet Arrives',
    content: 'The World Wide Web arrived in Australian homes in the mid-1990s. Early internet connections were slow dial-up — the modem screeched and families shared one phone line. Children discovered that you could look things up without going to the library.',
    imagePrompt: 'A teenager hunched over a desktop computer with a chunky monitor, a dial-up modem blinking on the desk, 1995.',
    source: 'ABS, Household Use of Information Technology, 1998',
    stat: { label: 'Internet in homes', then: '22% (1998)', now: '92%+' },
  },
  {
    id: '90s-04',
    decade: '1990s',
    year: 1997,
    title: 'Pocket Money Grows Up',
    content: 'By the late 1990s, the average pocket money for a child had risen to around $5 per week. Parents began to link pocket money to chores and responsibilities. The idea that children should learn to manage money was becoming important.',
    imagePrompt: 'A child carefully dropping coins into a ceramic piggy bank on a bedroom dresser, a handwritten chore chart on the wall behind, 1997.',
    source: 'Commonwealth Bank of Australia, Youth Savings Research, 1998',
    stat: { label: 'Average pocket money', then: '$5/week (1997)', now: '$10-$15/week' },
  },
  {
    id: '90s-05',
    decade: '1990s',
    year: 1999,
    title: 'End of a Century',
    content: 'As the 1990s closed, Australian families were more prosperous than at any time in history. Home ownership was high, unemployment was falling, and there was a sense of optimism. The family budget had changed enormously — but the conversations families had about money remained the same.',
    imagePrompt: 'A multi-generational family gathered around a table for New Year\'s Eve, grandparents, parents and children all smiling, 1999.',
    source: 'ABS, National Accounts, 2000',
  },
];

export function getSlidesForSunday(): HistoricalSlide[] {
  // Pick a decade based on the week of the year
  const weekOfYear = Math.ceil(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
    (7 * 24 * 60 * 60 * 1000)
  );
  const decades: Array<'1960s' | '1970s' | '1980s' | '1990s'> = ['1960s', '1970s', '1980s', '1990s'];
  const decade = decades[weekOfYear % 4];
  return historicalSlides.filter(s => s.decade === decade).slice(0, 4);
}

export function getDiscussionPrompts(
  envelopesSummary: Array<{ name: string; budget: number; spent: number }>
): string[] {
  const prompts: string[] = [];

  for (const env of envelopesSummary) {
    if (env.budget === 0) continue;
    const ratio = env.spent / env.budget;
    const remaining = env.budget - env.spent;

    if (ratio < 0.6 && remaining > 10) {
      prompts.push(
        `We spent less on ${env.name} this week — $${remaining.toFixed(0)} left over. Should we add it to the Travel Fund?`
      );
    } else if (ratio > 1.05) {
      const over = env.spent - env.budget;
      prompts.push(
        `${env.name} needed a little more this week — about $${over.toFixed(0)} over. Should we increase that envelope next week?`
      );
    } else if (ratio > 0.9 && ratio <= 1.0) {
      prompts.push(`We stayed right on budget for ${env.name} this week. Good effort everyone.`);
    }
  }

  // Add a general prompt if we have few
  if (prompts.length < 2) {
    prompts.push('What was the biggest surprise in our spending this week?');
    prompts.push('Is there something we saved for this week that deserves a mention?');
  }

  return prompts.slice(0, 4);
}
