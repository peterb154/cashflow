const profiles = [
  {
    id: 'doctor',
    name: 'New Attending Doctor',
    role: 'High income, heavy student debt',
    challenge: 'Lifestyle inflation and debt service can quietly eat the whole paycheck.',
    hiddenAdvantage: 'High active income gives you a fast snowball if you resist the upgrade treadmill.',
    cash: 8000,
    activeIncome: 14200,
    passiveIncome: 0,
    expenses: 8200,
    skill: 4,
    jobTime: 6,
    jobLabel: 'Hospital schedule',
    time: 2,
    risk: 4,
    debts: [
      { name: 'Student loans', balance: 285000, payment: 2400, rate: 0.065 },
      { name: 'Car note', balance: 38000, payment: 740, rate: 0.078 },
      { name: 'Credit card', balance: 9000, payment: 310, rate: 0.219 },
    ],
    assets: [{ name: 'Retirement index fund', value: 18000, passive: 0, sellable: true }],
  },
  {
    id: 'plumber',
    name: 'Journeyman Plumber',
    role: 'Skilled trade, no business cushion',
    challenge: 'You earn well by the hour, but no capital or business systems means every surprise matters.',
    hiddenAdvantage: 'Your craft can become a route, crew, or service business once you build owner skills.',
    cash: 1200,
    activeIncome: 6400,
    passiveIncome: 0,
    expenses: 4100,
    skill: 4,
    jobTime: 5,
    jobLabel: 'Plumbing job',
    time: 5,
    risk: 5,
    debts: [
      { name: 'Truck loan', balance: 21000, payment: 480, rate: 0.083 },
      { name: 'Tool financing', balance: 6200, payment: 210, rate: 0.12 },
    ],
    assets: [{ name: 'Paid tools', value: 8500, passive: 0, sellable: true }],
  },
  {
    id: 'barista',
    name: 'Beauty School Dropout',
    role: 'Minimum wage, flexible schedule',
    challenge: 'Low income makes every dollar feel too small to matter.',
    hiddenAdvantage: 'Low fixed expenses and flexible time make skill-building and side hustles powerful.',
    cash: 450,
    activeIncome: 2100,
    passiveIncome: 0,
    expenses: 1600,
    skill: 2,
    jobTime: 4,
    jobLabel: 'Starbucks shifts',
    time: 8,
    risk: 6,
    debts: [{ name: 'Credit card', balance: 2400, payment: 90, rate: 0.24 }],
    assets: [],
  },
  {
    id: 'sales',
    name: 'Commission Sales Rep',
    role: 'Variable income, high temptation',
    challenge: 'Good months invite big lifestyle decisions that become bad-month obligations.',
    hiddenAdvantage: 'Upside income can rapidly fund assets when you bank the bonuses.',
    cash: 3600,
    activeIncome: 5800,
    passiveIncome: 0,
    expenses: 4700,
    skill: 5,
    jobTime: 5,
    jobLabel: 'Sales job',
    time: 4,
    risk: 7,
    debts: [
      { name: 'Credit card', balance: 7700, payment: 240, rate: 0.22 },
      { name: 'Car lease', balance: 0, payment: 610, rate: 0 },
    ],
    assets: [{ name: 'Taxable brokerage', value: 4200, passive: 12, sellable: true }],
  },
  {
    id: 'manager',
    name: 'Corporate Manager',
    role: 'Strong salary, expensive life',
    challenge: 'You look successful, but the run rate keeps moving the FIRE line away.',
    hiddenAdvantage: 'Management skills transfer well into buying and systematizing small businesses.',
    cash: 9800,
    activeIncome: 9200,
    passiveIncome: 70,
    expenses: 7600,
    skill: 6,
    jobTime: 6,
    jobLabel: 'Management job',
    time: 3,
    risk: 4,
    debts: [
      { name: 'Student loans', balance: 42000, payment: 520, rate: 0.052 },
      { name: 'Credit card', balance: 12500, payment: 360, rate: 0.205 },
    ],
    assets: [{ name: '401k balance', value: 61000, passive: 70, sellable: false }],
  },
  {
    id: 'single-parent',
    name: 'Single Parent Nurse',
    role: 'Stable income, tight time',
    challenge: 'Time is scarce, childcare is real, and emergencies hit hard.',
    hiddenAdvantage: 'Discipline and stability create an excellent base for boring wealth.',
    cash: 2600,
    activeIncome: 6100,
    passiveIncome: 0,
    expenses: 4300,
    skill: 4,
    jobTime: 5,
    jobLabel: 'Nursing job',
    time: 2,
    risk: 3,
    defaultFamily: { status: 'single', kids: 2 },
    debts: [
      { name: 'Student loans', balance: 31000, payment: 310, rate: 0.049 },
      { name: 'Car note', balance: 12600, payment: 310, rate: 0.071 },
    ],
    assets: [{ name: 'Emergency fund CD', value: 1800, passive: 6, sellable: true }],
  },
];

const EXTRA_OPPORTUNITIES = [
  {
    id: 'cleaning-route',
    type: 'opportunity',
    title: 'Buy a tiny cleaning route',
    description: 'Five recurring office clients, messy books, and an owner who wants out.',
    cost: 6500,
    cashFlow: 520,
    value: 9000,
    terminalValue: 26000,
    timeCost: 2,
    recurringTime: 2,
    skillRequired: 2,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'Recurring customers are valuable, but operations decide whether it is an asset or a job.',
  },
  {
    id: 'pressure-washing',
    type: 'opportunity',
    title: 'Start pressure washing weekends',
    description: 'Cheap equipment, fast cash, and very little sellable value until you build a crew.',
    cost: 1400,
    cashFlow: 800,
    value: 1800,
    timeCost: 3,
    recurringTime: 3,
    skillRequired: 1,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'High cash flow that depends on your weekends is useful but not freedom yet.',
  },
  {
    id: 'boring-dividend-basket',
    type: 'opportunity',
    title: 'Dividend ETF basket',
    description: 'A small automated investment with modest cash yield and high liquidity.',
    cost: 2500,
    cashFlow: 9,
    value: 2500,
    timeCost: 0,
    recurringTime: 0,
    skillRequired: 0,
    risk: 'Low',
    sellability: 'High',
    lesson: 'Liquid assets are easy to own, but small yields require lots of capital.',
  },
  {
    id: 'atm-placement',
    type: 'opportunity',
    title: 'ATM in a busy barbershop',
    description: 'The location is strong, but cash loading and downtime are your problem.',
    cost: 5200,
    cashFlow: 260,
    value: 6000,
    terminalValue: 11000,
    timeCost: 1,
    recurringTime: 1,
    skillRequired: 2,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'Semi-passive assets still have operating details.',
  },
  {
    id: 'lawn-crew',
    type: 'opportunity',
    title: 'Partner into a lawn crew',
    description: 'A reliable operator needs capital for equipment. You get a minority cash-flow share.',
    cost: 8000,
    cashFlow: 430,
    value: 8500,
    terminalValue: 18000,
    timeCost: 1,
    recurringTime: 0,
    skillRequired: 3,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'Operator risk matters when you are not the one doing the work.',
  },
  {
    id: 'online-course',
    type: 'opportunity',
    title: 'Build a tiny online course',
    description: 'Turn a skill into lessons. It takes upfront work and may flop, but it can sell while you sleep.',
    cost: 1100,
    cashFlow: 140,
    value: 3500,
    terminalValue: 16000,
    timeCost: 4,
    recurringTime: 1,
    skillRequired: 5,
    risk: 'High',
    sellability: 'Medium',
    lesson: 'Products can decouple income from hours, but distribution is the hard part.',
  },
  {
    id: 'tax-prep-seasonal',
    type: 'opportunity',
    title: 'Seasonal tax prep book',
    description: 'A retiring preparer offers a small client list. Cash is seasonal and trust-heavy.',
    cost: 12000,
    cashFlow: 500,
    value: 15000,
    terminalValue: 36000,
    timeCost: 2,
    recurringTime: 2,
    skillRequired: 6,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'Seasonal businesses can be excellent if you manage calendar and client trust.',
  },
  {
    id: 'storage-units',
    type: 'opportunity',
    title: 'Four mini storage units',
    description: 'A tiny real estate-adjacent asset with low drama and low growth.',
    cost: 18000,
    cashFlow: 510,
    value: 22000,
    terminalValue: 36000,
    timeCost: 1,
    recurringTime: 0,
    skillRequired: 2,
    risk: 'Low',
    sellability: 'High',
    lesson: 'Some assets are boring because the work has already been systematized.',
  },
  {
    id: 'amazon-return-pallets',
    type: 'opportunity',
    title: 'Flip return pallets',
    description: 'Big gross margins, chaotic inventory, and lots of sorting in your garage.',
    cost: 1800,
    cashFlow: 700,
    value: 1000,
    timeCost: 4,
    recurringTime: 3,
    skillRequired: 2,
    risk: 'High',
    sellability: 'Low',
    lesson: 'Gross profit is not freedom if the process consumes your nights.',
  },
  {
    id: 'mobile-notary',
    type: 'opportunity',
    title: 'Mobile notary appointments',
    description: 'Certification, evening appointments, and steady side cash.',
    cost: 650,
    cashFlow: 360,
    value: 900,
    timeCost: 2,
    recurringTime: 2,
    skillRequired: 1,
    risk: 'Low',
    sellability: 'Low',
    lesson: 'A simple side hustle can fund the next asset, even if it is not the destination.',
  },
  {
    id: 'fractional-cfo',
    type: 'opportunity',
    title: 'Fractional CFO retainer',
    description: 'One small business wants monthly financial strategy, reporting, and cash-flow help. Excellent cash flow, but only for someone with serious finance chops.',
    cost: 2400,
    cashFlow: 2200,
    value: 4000,
    timeCost: 3,
    recurringTime: 3,
    skillRequired: 9,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'Specialized business expertise can create large cash flow, but craft skill alone is not enough.',
  },
  {
    id: 'royalty-catalog',
    type: 'opportunity',
    title: 'Small royalty catalog',
    description: 'Buy rights to a niche digital product that pays slowly but requires almost no work.',
    cost: 6000,
    cashFlow: 190,
    value: 7000,
    terminalValue: 10000,
    timeCost: 0,
    recurringTime: 0,
    skillRequired: 3,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'True passive income usually costs more capital or accepts more uncertainty.',
  },
];

const familyStarts = [
  { status: 'single', kids: 0, label: 'Single, no kids' },
  { status: 'single', kids: 1, label: 'Single parent, 1 kid' },
  { status: 'single', kids: 2, label: 'Single parent, 2 kids' },
  { status: 'married', kids: 0, label: 'Married, no kids' },
  { status: 'married', kids: 1, label: 'Married, 1 kid' },
  { status: 'married', kids: 2, label: 'Married, 2 kids' },
  { status: 'married', kids: 3, label: 'Married, 3 kids' },
];

const EXTRA_PROFILES = [
  {
    id: 'teacher',
    name: 'Public School Teacher',
    role: 'Stable income, low upside without a plan',
    challenge: 'A reliable paycheck can hide the fact that there is not much margin.',
    hiddenAdvantage: 'Summer flexibility and trust-based skills make tutoring, curriculum, and small service businesses realistic.',
    cash: 1900,
    activeIncome: 4300,
    passiveIncome: 0,
    expenses: 3100,
    skill: 4,
    jobTime: 5,
    jobLabel: 'Teaching job',
    time: 10,
    risk: 3,
    debts: [
      { name: 'Student loans', balance: 27000, payment: 260, rate: 0.052 },
      { name: 'Credit card', balance: 3800, payment: 130, rate: 0.219 },
    ],
    assets: [{ name: 'Pension credit', value: 12000, passive: 0, sellable: false }],
  },
  {
    id: 'developer',
    name: 'Burned-Out Software Developer',
    role: 'High salary, low time and energy',
    challenge: 'Strong income is paired with golden handcuffs and recovery time.',
    hiddenAdvantage: 'Technical skill can create scalable assets if you buy back time.',
    cash: 14000,
    activeIncome: 11800,
    passiveIncome: 120,
    expenses: 7800,
    skill: 6,
    jobTime: 6,
    jobLabel: 'Software job',
    time: 10,
    risk: 4,
    debts: [{ name: 'Car note', balance: 24000, payment: 510, rate: 0.069 }],
    assets: [{ name: 'Index portfolio', value: 76000, passive: 120, sellable: true }],
  },
  {
    id: 'server',
    name: 'Restaurant Server',
    role: 'Tip income, flexible schedule',
    challenge: 'Income swings and cash leaks make it hard to see the real statement.',
    hiddenAdvantage: 'Flexible hours and people skills can turn into sales, events, or service routes.',
    cash: 900,
    activeIncome: 3400,
    passiveIncome: 0,
    expenses: 2300,
    skill: 3,
    jobTime: 4,
    jobLabel: 'Restaurant shifts',
    time: 10,
    risk: 6,
    debts: [{ name: 'Credit card', balance: 5100, payment: 170, rate: 0.239 }],
    assets: [],
  },
  {
    id: 'electrician',
    name: 'Licensed Electrician',
    role: 'Skilled trade, path to crew ownership',
    challenge: 'Side jobs pay well but can eat every weekend.',
    hiddenAdvantage: 'Licensing, reputation, and referrals can become a real service business once you add owner skills.',
    cash: 5200,
    activeIncome: 7200,
    passiveIncome: 0,
    expenses: 4600,
    skill: 5,
    jobTime: 5,
    jobLabel: 'Electrical work',
    time: 10,
    risk: 5,
    debts: [
      { name: 'Work van', balance: 26000, payment: 540, rate: 0.082 },
      { name: 'Tool account', balance: 4500, payment: 180, rate: 0.11 },
    ],
    assets: [{ name: 'Tools and license', value: 16000, passive: 0, sellable: true }],
  },
  {
    id: 'military',
    name: 'Recently Separated Veteran',
    role: 'Benefits, transition uncertainty',
    challenge: 'The next income engine is not obvious yet.',
    hiddenAdvantage: 'Discipline, benefits, and operations experience travel well into boring businesses.',
    cash: 6500,
    activeIncome: 3600,
    passiveIncome: 900,
    expenses: 3600,
    skill: 5,
    jobTime: 3,
    jobLabel: 'Transition work',
    time: 10,
    risk: 4,
    debts: [{ name: 'Credit card', balance: 2200, payment: 80, rate: 0.21 }],
    assets: [{ name: 'VA disability benefit stream', value: 0, passive: 900, sellable: false }],
  },
  {
    id: 'artist',
    name: 'Freelance Designer',
    role: 'Creative upside, unstable pipeline',
    challenge: 'Great months and scary months average out worse than they feel.',
    hiddenAdvantage: 'Creative assets can be productized into templates, courses, retainers, and licensing.',
    cash: 2800,
    activeIncome: 4700,
    passiveIncome: 60,
    expenses: 3300,
    skill: 6,
    jobTime: 4,
    jobLabel: 'Client work',
    time: 10,
    risk: 7,
    debts: [{ name: 'Laptop financing', balance: 1800, payment: 90, rate: 0.15 }],
    assets: [{ name: 'Template store', value: 2500, passive: 60, sellable: true, recurringTime: 1 }],
  },
];

profiles.push(...EXTRA_PROFILES);

const deck = [
  {
    id: 'consulting',
    type: 'opportunity',
    title: 'Build a consulting sprint',
    description:
      'Use your current skill to land two monthly clients. Great cash flow, but it mostly depends on you.',
    cost: 1200,
    cashFlow: 1800,
    value: 6000,
    timeCost: 3,
    recurringTime: 3,
    skillRequired: 4,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'High cash flow does not always mean sellable equity.',
  },
  {
    id: 'laundry-route',
    type: 'opportunity',
    title: 'Buy a small laundry pickup route',
    description:
      'A tired operator wants out. It is unglamorous, manager-friendly, and only mildly profitable today.',
    cost: 9000,
    cashFlow: 420,
    value: 18000,
    terminalValue: 42000,
    timeCost: 1,
    recurringTime: 1,
    skillRequired: 3,
    risk: 'Low',
    sellability: 'Medium',
    lesson: 'A modest current return can still be attractive when systems and exit value exist.',
  },
  {
    id: 'hvac-leads',
    type: 'opportunity',
    title: 'Local HVAC lead-gen site',
    description:
      'Build a tiny web property and sell inbound calls to a contractor. Slow start, scalable later.',
    cost: 1800,
    cashFlow: 260,
    value: 5000,
    terminalValue: 22000,
    timeCost: 2,
    recurringTime: 1,
    skillRequired: 3,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'Digital assets can start small but compound if distribution works.',
  },
  {
    id: 'vending',
    type: 'opportunity',
    title: 'Two vending machines',
    description: 'A friend offers two machines in decent locations. Boring, finite, and understandable.',
    cost: 4200,
    cashFlow: 210,
    value: 5200,
    timeCost: 1,
    recurringTime: 1,
    skillRequired: 1,
    risk: 'Low',
    sellability: 'Medium',
    lesson: 'Simple assets teach maintenance, route density, and cash-on-cash returns.',
  },
  {
    id: 'micro-saas',
    type: 'opportunity',
    title: 'Niche scheduling micro-SaaS',
    description:
      'A tiny software tool for independent tutors. No cash flow yet, but the upside is real if you can ship.',
    cost: 3000,
    cashFlow: -120,
    value: 2000,
    terminalValue: 85000,
    timeCost: 4,
    recurringTime: 2,
    skillRequired: 5,
    risk: 'High',
    sellability: 'High',
    lesson: 'Some businesses are option value first and cash flow later.',
  },
  {
    id: 'index-fund',
    type: 'opportunity',
    title: 'Automate boring index investing',
    description:
      'Not exciting. Not a story for social media. But it quietly increases assets and future passive income.',
    cost: 1000,
    cashFlow: 4,
    value: 1000,
    timeCost: 0,
    recurringTime: 0,
    skillRequired: 0,
    risk: 'Low',
    sellability: 'High',
    lesson: 'Boring can be excellent when the habit is automatic.',
  },
  {
    id: 'bookkeeping',
    type: 'opportunity',
    title: 'Buy a bookkeeping book',
    description:
      'An owner has six sticky clients and no growth plan. Improve process, then hire part-time help.',
    cost: 15000,
    cashFlow: 900,
    value: 21000,
    terminalValue: 48000,
    timeCost: 2,
    recurringTime: 2,
    skillRequired: 4,
    risk: 'Medium',
    sellability: 'Medium',
    lesson: 'A service book can become an asset when process replaces personality.',
  },
  {
    id: 'mobile-detail',
    type: 'opportunity',
    title: 'Weekend mobile detailing',
    description:
      'Start with supplies, hustle, and repeat customers. Cash flow is strong; sellability depends on hiring.',
    cost: 900,
    cashFlow: 650,
    value: 1200,
    timeCost: 3,
    recurringTime: 3,
    skillRequired: 1,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'A side hustle can be a bridge, not the final asset.',
  },
  {
    id: 'operator-note',
    type: 'opportunity',
    title: 'Small business operator note',
    description:
      'Lend to a trusted operator expanding a route business. You get monthly payments but limited control.',
    cost: 5000,
    cashFlow: 58,
    value: 5000,
    timeCost: 0,
    recurringTime: 0,
    skillRequired: 2,
    risk: 'Medium',
    sellability: 'Low',
    lesson: 'Passive income can come with counterparty risk.',
  },
  {
    id: 'rental-small',
    type: 'opportunity',
    title: 'Small rental garage bay',
    description:
      'A tiny real estate deal appears. It is not the whole game, but it can still be a useful asset.',
    cost: 7000,
    cashFlow: 180,
    value: 9000,
    timeCost: 1,
    recurringTime: 1,
    skillRequired: 2,
    risk: 'Low',
    sellability: 'High',
    lesson: 'Real estate belongs in the toolkit, not as the only path.',
  },
];

deck.push(...EXTRA_OPPORTUNITIES);

const doodads = [
  {
    id: 'car-upgrade',
    type: 'doodad',
    title: 'The car upgrade feels deserved',
    description: 'The new payment is manageable. The old car was fine. The monthly nut gets bigger.',
    cost: 2500,
    expenseChange: 520,
    happiness: 2,
    lesson: 'Lifestyle upgrades raise the FIRE target every month.',
  },
  {
    id: 'concert-weekend',
    type: 'doodad',
    title: 'Concert weekend with friends',
    description: 'A great memory, a hotel bill, and a credit card swipe if you are short on cash.',
    cost: 900,
    expenseChange: 0,
    happiness: 3,
    lesson: 'One-time spending is not evil, but it competes with capital.',
  },
  {
    id: 'luxury-apartment',
    type: 'doodad',
    title: 'Move into the nicer apartment',
    description: 'Better gym, better view, and a permanent increase in monthly expenses.',
    cost: 1300,
    expenseChange: 650,
    happiness: 2,
    lesson: 'Recurring doodads are more dangerous than one-time doodads.',
  },
  {
    id: 'phone',
    type: 'doodad',
    title: 'New phone on monthly plan',
    description: 'Only a little per month, which is how the pile gets built.',
    cost: 120,
    expenseChange: 55,
    happiness: 1,
    lesson: 'Small recurring payments hide inside the cash flow statement.',
  },
  {
    id: 'boat',
    type: 'doodad',
    title: 'Used boat, great deal',
    description: 'The seller says boats hold value. The marina and maintenance disagree.',
    cost: 6000,
    expenseChange: 240,
    happiness: 4,
    lesson: 'A non-asset can look like an asset when resale value is the excuse.',
  },
  {
    id: 'reliable-car',
    type: 'doodad',
    title: 'Replace the unreliable car',
    description:
      'The old car is bleeding surprise repairs. A newer used car lowers repair drama but locks in a real payment.',
    cost: 1800,
    expenseChange: 310,
    expenseReduction: 90,
    happiness: 3,
    lesson: 'Sometimes a doodad converts variable pain into a fixed obligation. Read the net cash flow.',
  },
  {
    id: 'closer-apartment',
    type: 'doodad',
    title: 'Move closer to work',
    description:
      'Shorter commute, better sleep, and less friction. The rent increase is permanent.',
    cost: 1600,
    expenseChange: 420,
    timeChange: 1,
    happiness: 3,
    lesson: 'Buying time can be rational, but the FIRE target moves when fixed expenses rise.',
  },
  {
    id: 'house-cleaner',
    type: 'doodad',
    title: 'Hire a monthly house cleaner',
    description:
      'This is not an asset, but it buys back evenings and reduces domestic stress.',
    cost: 0,
    expenseChange: 220,
    timeChange: 1,
    happiness: 2,
    lesson: 'Convenience spending can buy time, but it must fit the statement.',
  },
  {
    id: 'kids-travel-sports',
    type: 'doodad',
    title: 'Kid makes the travel team',
    description:
      'The family is excited and the memories are real. Fees, hotels, and weekend travel hit cash flow.',
    cost: 600,
    expenseChange: 260,
    timeChange: -1,
    happiness: 4,
    lesson: 'Family spending has a strong pull because the benefit is emotional, not financial.',
  },
  {
    id: 'wedding-season',
    type: 'doodad',
    title: 'Wedding season pressure',
    description:
      'Flights, hotel, gifts, and clothes. Skipping saves money but costs social capital.',
    cost: 1500,
    expenseChange: 0,
    happiness: 3,
    lesson: 'One-time spending still matters when it eats capital that could have created options.',
  },
  {
    id: 'meal-service',
    type: 'doodad',
    title: 'Meal kit subscription',
    description:
      'Less grocery planning and fewer drive-through nights, but the subscription stays on the card.',
    cost: 0,
    expenseChange: 180,
    expenseReduction: 60,
    timeChange: 1,
    happiness: 2,
    lesson: 'A convenience doodad can reduce some waste and still raise the monthly nut.',
  },
];

const events = [
  {
    id: 'emergency',
    type: 'event',
    title: 'Emergency expense',
    description: 'A real life surprise hits. Cash absorbs it; debt magnifies it.',
    cost: 950,
    expenseChange: 0,
    lesson: 'Runway is a financial shock absorber.',
  },
  {
    id: 'bonus',
    type: 'event',
    title: 'Unexpected bonus',
    description: 'Extra money appears. It can become capital, snowball fuel, or a doodad story.',
    cost: -1800,
    expenseChange: 0,
    lesson: 'Windfalls reveal the plan you already had.',
  },
  {
    id: 'rent-up',
    type: 'event',
    title: 'Rent and groceries rise',
    description: 'Inflation nudges the run rate higher unless you actively redesign expenses.',
    cost: 0,
    expenseChange: 160,
    lesson: 'Expense drift quietly moves the FIRE line.',
  },
  {
    id: 'referral',
    type: 'event',
    title: 'A referral improves active income',
    description: 'Your reputation creates a higher-paying opportunity.',
    cost: 0,
    incomeChange: 420,
    lesson: 'Skills and network are assets even when they are not on the balance sheet.',
  },
  {
    id: 'repair',
    type: 'event',
    title: 'Car repair',
    description: 'Not glamorous, but transportation keeps active income alive.',
    cost: 700,
    expenseChange: 0,
    lesson: 'Some expenses protect the income engine.',
  },
  {
    id: 'new-baby',
    type: 'event',
    title: 'A child joins the family',
    description: 'Life changes. This is not optional; you adjust the financial statement and keep moving.',
    cost: 900,
    expenseChange: 0,
    familyAction: 'addKid',
    required: true,
    lesson: 'Kids consume time and increase expenses, but the game is still winnable.',
  },
  {
    id: 'marriage',
    type: 'event',
    title: 'You get married',
    description: 'Responsibilities and expenses change, and kid time can now be shared.',
    cost: 1200,
    expenseChange: 0,
    familyAction: 'marry',
    required: true,
    lesson: 'Marriage can add costs but also share family time obligations.',
  },
  {
    id: 'divorce',
    type: 'event',
    title: 'Divorce reshapes the household',
    description: 'The time split changes, expenses shift, and the plan has to survive reality.',
    cost: 2500,
    expenseChange: 350,
    familyAction: 'divorce',
    required: true,
    lesson: 'Some events are not strategy choices. The skill is managing through them.',
  },
];

events.push(
  {
    id: 'childcare-gap',
    type: 'event',
    title: 'Childcare gap',
    description: 'A schedule change forces paid help or lost work capacity this month.',
    cost: 450,
    expenseChange: 120,
    lesson: 'Family logistics show up as both time and money pressure.',
  },
  {
    id: 'promotion-more-hours',
    type: 'event',
    title: 'Promotion offer with longer hours',
    description: 'The raise is real, but the job gets heavier and crowds out deal flow.',
    cost: 0,
    incomeChange: 900,
    expenseChange: 120,
    lesson: 'Active income can rise while freedom gets farther away if expenses and time pressure rise too.',
  },
  {
    id: 'insurance-rate-hike',
    type: 'event',
    title: 'Insurance renewal jumps',
    description: 'No drama, just a higher monthly bill you now have to absorb.',
    cost: 0,
    expenseChange: 95,
    lesson: 'The run rate drifts upward unless you actively manage it.',
  },
  {
    id: 'tax-refund',
    type: 'event',
    title: 'Tax refund arrives',
    description: 'A lump sum shows up. The statement will reveal whether it becomes freedom or consumption.',
    cost: -2400,
    expenseChange: 0,
    lesson: 'Windfalls are accelerants, not plans.',
  },
  {
    id: 'parent-needs-help',
    type: 'event',
    title: 'Parent needs help',
    description: 'Family responsibility increases for a season. You cannot optimize every human obligation away.',
    cost: 600,
    expenseChange: 100,
    lesson: 'A resilient plan has margin for people, not just assets.',
  },
  {
    id: 'layoff-scare',
    type: 'event',
    title: 'Layoff scare cuts hours',
    description: 'Your active income dips. Cash flow reveals how fragile the plan is.',
    cost: 0,
    incomeChange: -650,
    expenseChange: 0,
    lesson: 'Depending only on active income is a concentration risk.',
  },
);

const state = {
  phase: 'intro',
  profile: null,
  month: 1,
  cash: 0,
  activeIncome: 0,
  passiveIncome: 0,
  expenses: 0,
  debts: [],
  assets: [],
  skill: 0,
  baseTime: 0,
  time: 0,
  risk: 0,
  family: null,
  currentCard: null,
  statementTab: 'income',
  log: [],
  toast: null,
  lastMonth: null,
  totalDoodads: 0,
  totalDebtPaid: 0,
  expenseCuts: 0,
  gameWon: false,
};

const app = document.getElementById('app');
let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);

function money(value, options = {}) {
  const maximumFractionDigits = options.cents ? 2 : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
    minimumFractionDigits: options.cents ? 2 : 0,
  }).format(value);
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function cloneProfile(profile) {
  return {
    ...profile,
    debts: profile.debts.map((debt) => ({ ...debt })),
    assets: profile.assets.map((asset) => ({ ...asset })),
  };
}

function totalDebt() {
  return state.debts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
}

function debtPayments() {
  return state.debts.reduce((sum, debt) => sum + (debt.balance > 0 ? debt.payment : 0), 0);
}

function recurringTime() {
  return state.assets.reduce((sum, asset) => sum + (asset.recurringTime || 0), 0);
}

function jobTime() {
  return state.profile?.jobTime || 0;
}

function familyTime() {
  if (!state.family) return 0;
  const perKid = state.family.status === 'married' ? 1.5 : 2;
  return state.family.kids * perKid;
}

function familyExpense() {
  if (!state.family) return 0;
  return state.family.kids * 450 + (state.family.status === 'married' ? 250 : 0);
}

function familyLabel() {
  if (!state.family) return 'No family roll';
  const kids = state.family.kids === 1 ? '1 kid' : `${state.family.kids} kids`;
  if (state.family.kids === 0) return state.family.status === 'married' ? 'Married, no kids' : 'Single, no kids';
  return `${state.family.status === 'married' ? 'Married' : 'Single parent'}, ${kids}`;
}

function monthlyTimeCapacity() {
  return Math.max(0, state.baseTime - jobTime() - recurringTime() - familyTime());
}

function obligatedTime() {
  return jobTime() + familyTime() + recurringTime();
}

function timeUsageRows() {
  const rows = [];
  if (jobTime()) rows.push([state.profile?.jobLabel || `${state.profile?.name || 'Job'} work`, jobTime()]);
  if (state.family?.kids) {
    const perKid = state.family.status === 'married' ? 1.5 : 2;
    rows.push([`Kids: ${state.family.kids} × ${perKid} time`, familyTime()]);
  } else if (state.family?.status === 'married') {
    rows.push(['Marriage / household coordination', familyTime()]);
  }
  state.assets
    .filter((asset) => (asset.recurringTime || 0) > 0)
    .forEach((asset) => rows.push([asset.name, asset.recurringTime || 0]));
  return rows;
}

function cashInterestIncome() {
  return Math.floor(state.cash * 0.08 / 12);
}

function totalPassiveIncome() {
  return state.passiveIncome + cashInterestIncome();
}

function assetValue() {
  return state.assets.reduce((sum, asset) => sum + asset.value, 0);
}

function netWorth() {
  return state.cash + assetValue() - totalDebt();
}

function monthlyCashFlow() {
  return state.activeIncome + totalPassiveIncome() - state.expenses - debtPayments();
}

function fireProgress() {
  if (state.expenses <= 0) return 100;
  return Math.min(100, Math.max(0, (totalPassiveIncome() / state.expenses) * 100));
}

function fireGap() {
  return Math.max(0, state.expenses - totalPassiveIncome());
}

function runwayMonths() {
  const burn = Math.max(0, -monthlyCashFlow());
  if (burn === 0) return Infinity;
  return state.cash / burn;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function initializeRun(profile, family = randomFrom(familyStarts), logVerb = 'Rolled life') {
  state.profile = profile;
  state.month = 1;
  state.family = { ...(profile.defaultFamily || family) };
  state.cash = profile.cash;
  state.activeIncome = profile.activeIncome;
  state.passiveIncome = profile.passiveIncome;
  state.expenses = profile.expenses + familyExpense();
  state.debts = profile.debts;
  state.assets = profile.assets;
  state.skill = profile.skill;
  state.baseTime = 10;
  state.time = monthlyTimeCapacity();
  state.risk = profile.risk;
  state.currentCard = drawCard();
  state.phase = 'play';
  state.log = [
    `${logVerb}: ${profile.name}. Family roll: ${familyLabel()}.`,
    `Challenge: ${profile.challenge}`,
    `Hidden advantage: ${profile.hiddenAdvantage}`,
  ];
  state.totalDoodads = 0;
  state.totalDebtPaid = 0;
  state.expenseCuts = 0;
  state.gameWon = false;
  state.lastMonth = null;
  showToast(logVerb, `${profile.name}: ${profile.role}. ${familyLabel()} adds ${familyTime()} obligated time and ${money(familyExpense())}/mo.`);
  render();
}

function rollLife() {
  const selected = cloneProfile(randomFrom(profiles));
  initializeRun(selected, selected.defaultFamily || randomFrom(familyStarts), 'Rolled life');
}

function drawCard() {
  const exitAssets = exitCandidates();
  if (exitAssets.length && Math.random() < 0.14) {
    return buildExitCard(randomFrom(exitAssets));
  }
  const roll = Math.random();
  if (roll < 0.48) return { ...randomFrom(deck) };
  if (roll < 0.78) return { ...randomFrom(doodads) };
  return { ...randomFrom(events) };
}

function exitCandidates() {
  return state.assets.filter((asset) => asset.terminalValue && asset.terminalValue > asset.value);
}

function buildExitCard(asset) {
  const marketFactor = 0.75 + Math.random() * 0.35;
  const offer = Math.max(asset.value, Math.round(asset.terminalValue * marketFactor));
  return {
    type: 'exit',
    title: `Exit offer: ${asset.name}`,
    description: `A buyer shows up for ${asset.name}. You can turn future upside into cash now, but you lose the monthly cash flow and any time burden attached to it.`,
    assetId: asset.id,
    assetName: asset.name,
    offerValue: offer,
    passiveLost: asset.passive || 0,
    timeFreed: asset.recurringTime || 0,
    lesson: 'An exit is not just a big number. Compare liquidity today against lost cash flow, lost optionality, and whether the asset still consumes your time.',
  };
}

function nextMonth() {
  const before = snapshot();
  const cashFlow = monthlyCashFlow();
  state.cash += cashFlow;
  addDebtInterest();
  if (state.cash < 0) {
    const shortage = Math.abs(state.cash);
    state.cash = 0;
    addOrIncreaseDebt('Credit card', shortage, Math.max(35, Math.round(shortage * 0.035)), 0.24);
    state.log.unshift(`Month ${state.month}: cash shortfall became ${money(shortage)} of credit card debt.`);
  }
  state.month += 1;
  state.time = monthlyTimeCapacity();
  state.currentCard = drawCard();
  state.lastMonth = {
    before,
    after: snapshot(),
    cashFlow,
  };
  checkWin();
  state.log.unshift(`Month ${state.month - 1} closed with ${money(cashFlow)} net cash flow.`);
  render();
}

function addDebtInterest() {
  state.debts.forEach((debt) => {
    if (debt.balance <= 0 || debt.rate <= 0) return;
    const monthlyInterest = debt.balance * (debt.rate / 12);
    const principalPayment = Math.max(0, debt.payment - monthlyInterest);
    debt.balance = Math.max(0, debt.balance + monthlyInterest - principalPayment);
  });
  state.debts = state.debts.filter((debt) => debt.balance > 1 || debt.payment > 0);
}

function addOrIncreaseDebt(name, amount, payment, rate) {
  const existing = state.debts.find((debt) => debt.name === name);
  if (existing) {
    existing.balance += amount;
    existing.payment += payment;
  } else {
    state.debts.push({ name, balance: amount, payment, rate });
  }
}

function snapshot() {
  return {
    cash: state.cash,
    activeIncome: state.activeIncome,
    passiveIncome: totalPassiveIncome(),
    assetPassiveIncome: state.passiveIncome,
    cashInterestIncome: cashInterestIncome(),
    expenses: state.expenses,
    debt: totalDebt(),
    debtPayments: debtPayments(),
    netWorth: netWorth(),
    cashFlow: monthlyCashFlow(),
    fireProgress: fireProgress(),
    timeRemaining: state.time,
    timeCapacity: monthlyTimeCapacity(),
    recurringTime: recurringTime(),
  };
}

function canAfford(cost) {
  return state.cash >= cost;
}

function opportunityBlockers(card) {
  const blockers = [];
  if (state.cash < card.cost) blockers.push(`cash: need ${money(card.cost)}, have ${money(state.cash)}`);
  if (state.time < card.timeCost) blockers.push(`time: need ${card.timeCost}, have ${state.time}`);
  if (state.skill < card.skillRequired) blockers.push(`business skill: need ${card.skillRequired}/10, have ${state.skill}/10`);
  return blockers;
}

function debtSnowballAmount() {
  const activeDebts = state.debts.filter((debt) => debt.balance > 0).sort((a, b) => a.balance - b.balance);
  if (!activeDebts.length) return { target: null, amount: 0 };
  const target = activeDebts[0];
  const available = Math.max(0, state.cash - 1000);
  return { target, amount: Math.min(available, target.balance) };
}

function expenseCutAmount() {
  const intendedCut = Math.min(state.expenses * 0.06, 350);
  return Math.max(0, state.expenses - Math.max(600, state.expenses - intendedCut));
}

function bestSellableAsset() {
  return state.assets.filter((asset) => asset.sellable).sort((a, b) => b.value - a.value)[0] || null;
}

function bestSystematizeAsset() {
  return (
    state.assets
      .filter((asset) => (asset.recurringTime || 0) > 0)
      .sort((a, b) => (b.recurringTime || 0) - (a.recurringTime || 0))[0] || null
  );
}

function applyFamilyEvent(card) {
  const beforeTime = familyTime();
  const beforeExpense = familyExpense();
  if (!state.family) state.family = { status: 'single', kids: 0 };
  if (card.familyAction === 'addKid') {
    state.family.kids += 1;
  }
  if (card.familyAction === 'marry') {
    state.family.status = 'married';
  }
  if (card.familyAction === 'divorce') {
    state.family.status = 'single';
  }
  const timeDelta = familyTime() - beforeTime;
  const expenseDelta = familyExpense() - beforeExpense;
  state.expenses += expenseDelta;
  state.time = Math.min(state.time, monthlyTimeCapacity());
  state.log.unshift(
    `Family changed: ${familyLabel()}. Obligated time changed by ${timeDelta} and expenses changed by ${money(expenseDelta)}/mo.`,
  );
}

function acceptCard() {
  const card = state.currentCard;
  if (!card) return;

  if (card.type === 'opportunity') {
    const blockers = opportunityBlockers(card);
    if (blockers.length) {
      showToast('You can’t take this deal yet', blockers.join(' • '));
      return;
    }
    state.cash -= card.cost;
    state.passiveIncome += Math.max(0, card.cashFlow);
    if (card.cashFlow < 0) {
      state.expenses += Math.abs(card.cashFlow);
    }
    state.time = Math.max(0, state.time - card.timeCost);
    state.assets.push({
      id: `${card.id}-${state.month}-${state.assets.length}`,
      name: card.title,
      value: card.value + (card.terminalValue ? Math.round(card.terminalValue * 0.12) : 0),
      terminalValue: card.terminalValue || null,
      passive: Math.max(0, card.cashFlow),
      sellable: card.sellability !== 'Low',
      recurringTime: card.recurringTime || 0,
    });
    state.log.unshift(
      `Took opportunity: ${card.title}. Passive income changed by ${money(Math.max(0, card.cashFlow))}/mo and ${card.recurringTime || 0} time is now committed monthly.`,
    );
    showToast('Opportunity accepted', card.lesson);
  }

  if (card.type === 'doodad') {
    if (card.cost > 0 && !canAfford(card.cost)) {
      const shortfall = card.cost - state.cash;
      state.cash = 0;
      addOrIncreaseDebt('Credit card', shortfall, Math.max(35, Math.round(shortfall * 0.035)), 0.24);
    } else {
      state.cash -= card.cost;
    }
    const netExpenseChange = (card.expenseChange || 0) - (card.expenseReduction || 0);
    state.expenses += netExpenseChange;
    if (card.timeChange) {
      state.time = Math.max(0, Math.min(monthlyTimeCapacity(), state.time + card.timeChange));
    }
    state.totalDoodads += card.cost + netExpenseChange * 12;
    state.log.unshift(
      `Bought doodad: ${card.title}. Net expenses changed by ${money(netExpenseChange)}/mo${card.timeChange ? ` and time changed by ${card.timeChange}` : ''}.`,
    );
    showToast('Doodad accepted', card.lesson);
  }

  if (card.type === 'event') {
    if (card.familyAction) {
      applyFamilyEvent(card);
    }
    if (card.cost < 0) {
      state.cash += Math.abs(card.cost);
    } else if (card.cost > 0 && canAfford(card.cost)) {
      state.cash -= card.cost;
    } else if (card.cost > 0) {
      const shortage = card.cost - state.cash;
      state.cash = 0;
      addOrIncreaseDebt('Credit card', shortage, Math.max(35, Math.round(shortage * 0.035)), 0.24);
    }
    state.expenses += card.expenseChange || 0;
    state.activeIncome += card.incomeChange || 0;
    state.log.unshift(`Event resolved: ${card.title}.`);
    showToast('Life happened', card.lesson);
  }

  if (card.type === 'exit') {
    const asset = state.assets.find((item) => item.id === card.assetId);
    if (!asset) {
      showToast('Exit expired', 'That asset is no longer on your balance sheet.');
      state.currentCard = null;
      render();
      return;
    }
    state.cash += card.offerValue;
    state.passiveIncome = Math.max(0, state.passiveIncome - (asset.passive || 0));
    state.assets = state.assets.filter((item) => item !== asset);
    state.time = Math.min(monthlyTimeCapacity(), state.time + (asset.recurringTime || 0));
    state.log.unshift(
      `Accepted exit: ${asset.name} sold for ${money(card.offerValue)}. Lost ${money(asset.passive || 0)}/mo passive income and freed ${asset.recurringTime || 0} time.`,
    );
    showToast('Exit accepted', 'Cash increased, but the asset and its monthly income are gone.');
  }

  state.currentCard = null;
  checkWin();
  render();
}

function passCard() {
  const card = state.currentCard;
  if (!card) return;
  if (card.type === 'event' && card.required) {
    showToast('This life event is not optional', 'Resolve it and then manage through the time and cash-flow impact.');
    return;
  }
  state.log.unshift(`Passed: ${card.title}.`);
  showToast('Passed', card.type === 'doodad' ? 'That restraint kept your FIRE number lower.' : card.lesson);
  state.currentCard = null;
  render();
}

function payDebtSnowball() {
  const { target, amount } = debtSnowballAmount();
  if (!target) {
    showToast('No consumer debt', 'You have no active debts to snowball.');
    return;
  }
  if (amount <= 0) {
    showToast('Keep the buffer', 'Debt snowball uses all cash above a $1,000 emergency buffer. You have nothing extra right now.');
    return;
  }
  state.cash -= amount;
  target.balance = Math.max(0, target.balance - amount);
  state.totalDebtPaid += amount;
  if (target.balance === 0) {
    state.expenses = Math.max(0, state.expenses);
    state.log.unshift(`Debt killed: ${target.name}. Freed ${money(target.payment)}/mo of required payments.`);
    target.payment = 0;
  } else {
    state.log.unshift(`Debt snowball: paid ${money(amount)} toward ${target.name}.`);
  }
  showToast('Debt snowball', `Paid ${money(amount)} toward ${target.name}.`);
  checkWin();
  render();
}

function cutExpenses() {
  if (!spendTime(1, 'expense audit')) return;
  const cut = expenseCutAmount();
  if (cut <= 0) {
    state.time += 1;
    showToast('No more easy cuts', 'Your living expenses are already at the minimum floor for this prototype.');
    return;
  }
  state.expenses = Math.max(600, state.expenses - cut);
  state.assets.push({
    name: 'DIY expense cuts',
    value: 0,
    passive: 0,
    sellable: false,
    recurringTime: 1,
  });
  state.expenseCuts += cut;
  state.log.unshift(`Expense audit cut the monthly run rate by ${money(cut)} but added 1 recurring time commitment.`);
  showToast('Run rate lowered', `You traded 1 recurring time for ${money(cut)}/mo of lower expenses.`);
  checkWin();
  render();
}

function buildSkill() {
  if (!spendTime(2, 'skill building')) return;
  const cost = 650;
  if (!canAfford(cost)) {
    state.time += 2;
    showToast('Need cash', `Skill-building costs ${money(cost)} this month.`);
    return;
  }
  state.cash -= cost;
  state.skill = Math.min(10, state.skill + 1);
  if (state.skill % 2 === 0) {
    state.activeIncome += 250;
  }
  state.log.unshift(`Invested in business skill. Business skill is now ${state.skill}/10.`);
  showToast('Business skill built', 'Higher business skill unlocks better opportunities and can increase active income.');
  render();
}

function sellAsset() {
  const asset = bestSellableAsset();
  if (!asset) {
    showToast('No sellable asset', 'Some assets create value but cannot be easily sold yet.');
    return;
  }
  state.cash += asset.value;
  state.passiveIncome = Math.max(0, state.passiveIncome - asset.passive);
  state.assets = state.assets.filter((item) => item !== asset);
  state.log.unshift(`Sold ${asset.name} for ${money(asset.value)}. Passive income fell by ${money(asset.passive)}/mo.`);
  showToast('Asset sold', 'Liquidity is useful, but selling cash-flow assets can move FIRE farther away.');
  render();
}

function systematizeBusiness() {
  const asset = bestSystematizeAsset();
  if (!asset) {
    showToast('Nothing to systematize', 'You need a time-consuming business before systems can buy back your calendar.');
    return;
  }
  const cost = 1800;
  if (!canAfford(cost)) {
    showToast('Need cash', `Systems, delegation, or process cleanup costs ${money(cost)}.`);
    return;
  }
  state.cash -= cost;
  asset.recurringTime = Math.max(0, (asset.recurringTime || 0) - 1);
  state.time = Math.min(monthlyTimeCapacity(), state.time + 1);
  asset.value += 2500;
  state.log.unshift(`Systematized ${asset.name}. Monthly time commitment fell by 1 and asset value improved.`);
  showToast('Calendar bought back', 'Systems turn a hustle into more of an asset.');
  render();
}

function spendTime(amount, label) {
  if (state.time < amount) {
    showToast('No time left', `${label} needs ${amount} time. Close the month or free up capacity.`);
    return false;
  }
  state.time -= amount;
  return true;
}

function resetGame() {
  state.phase = 'intro';
  state.profile = null;
  state.toast = null;
  render();
}

function checkWin() {
  if (totalPassiveIncome() >= state.expenses && !state.gameWon) {
    state.gameWon = true;
    state.phase = 'won';
    state.log.unshift(`Reached FIRE in month ${state.month}: passive income exceeds expenses.`);
  }
}

function showToast(title, detail) {
  state.toast = { title, detail };
  window.clearTimeout(showToast.timer);
  render();
  showToast.timer = window.setTimeout(() => {
    state.toast = null;
    render();
  }, 3200);
}

function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  render();
}

function setStatementTab(tab) {
  state.statementTab = tab;
  render();
}

function logoSvg() {
  return `
    <svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-label="FIRE Fastlane logo">
      <path d="M10 32C10 19 20 11 24 6C28 14 38 19 38 31C38 39 32 44 24 44C16 44 10 39 10 32Z" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M19 33C19 27 23 23 25 19C27 24 31 27 31 33C31 37 28 40 24.8 40C21.5 40 19 37 19 33Z" fill="currentColor"/>
      <path d="M14 15H22M26 15H34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
}

function topbar() {
  return `
    <header class="topbar">
      <div class="brand">
        ${logoSvg()}
        <div class="brand-copy">
          <span class="eyebrow">Prototype</span>
          <h1>FIRE Fastlane</h1>
        </div>
      </div>
      <div class="button-row" style="gap: var(--space-2); align-items: center;">
        ${
          state.phase !== 'intro'
            ? `<span class="month-pill"><span>Month</span><strong data-testid="text-month">${state.month}</strong></span>`
            : ''
        }
        <button class="icon-button" type="button" data-testid="button-theme" aria-label="Toggle theme" onclick="toggleTheme()">
          ${theme === 'dark' ? sunIcon() : moonIcon()}
        </button>
      </div>
    </header>`;
}

function sunIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function moonIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 13.1A8.5 8.5 0 1 1 10.9 3a6.5 6.5 0 0 0 10.1 10.1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

function renderIntro() {
  return `
    <div class="screen hero">
      <section class="intro-card">
        <span class="eyebrow">Single-player slice</span>
        <h2>Roll a life. Read the numbers. Buy freedom.</h2>
        <p>
          This first prototype is one-player only. It tests the core loop: monthly turns, financial statements,
          asymmetric starting lives, doodad temptations, business opportunities, debt snowball, and FIRE progress.
        </p>
        <div class="button-row">
          <button class="primary-button" type="button" data-testid="button-roll-life" onclick="rollLife()">
            Roll my life
          </button>
        </div>
      </section>
      <aside class="panel">
        <div class="panel-title">
          <span class="eyebrow">What this tests</span>
          <h2>Financial freedom is a ratio</h2>
          <p>
            You win when passive income exceeds monthly expenses. Increase passive income, lower the run rate,
            and keep doodads from becoming permanent obligations.
          </p>
        </div>
        <div class="lesson-strip">
          <div class="lesson"><strong>Statements</strong><span>Income, balance sheet, debt, and cash flow.</span></div>
          <div class="lesson"><strong>Tradeoffs</strong><span>Cash flow businesses versus sellable assets.</span></div>
          <div class="lesson"><strong>Behavior</strong><span>Temptation, restraint, snowball, and runway.</span></div>
        </div>
      </aside>
    </div>`;
}

function startSpecificProfile(id) {
  const profile = cloneProfile(profiles.find((item) => item.id === id) || profiles[0]);
  initializeRun(profile, profile.defaultFamily || randomFrom(familyStarts), 'Selected life');
}

function renderPlay() {
  return `
    <div class="screen">
      <section class="panel profile-card" data-testid="section-profile">
        ${renderProfileHeader()}
        ${renderLifeLessons()}
      </section>
      <section class="panel financial-panel" data-testid="section-statements">
        ${renderStats()}
        ${renderTimeAccounting()}
        ${renderStatements()}
        ${renderFireProgress()}
      </section>
      <div class="mobile-only" data-testid="section-mobile-card">
        <section class="panel">
          ${renderCurrentCard(true)}
        </section>
      </div>
      <div class="desktop-grid">
        <section class="panel desktop-only" data-testid="section-monthly-card">
          ${renderCurrentCard()}
        </section>
        <div class="turn-side-stack">
          ${renderActions()}
          <section class="panel" data-testid="section-log">
            ${renderLog()}
          </section>
        </div>
      </div>
    </div>
    <div class="mobile-bottom-space"></div>`;
}

function renderProfileHeader() {
  return `
    <div class="profile-top">
      <div>
        <span class="eyebrow">Roll of life</span>
        <h2 class="profile-name" data-testid="text-profile-name">${state.profile.name}</h2>
        <p class="profile-note">${state.profile.role}</p>
      </div>
      <button class="quiet-button" type="button" data-testid="button-reset" onclick="resetGame()">Reset</button>
    </div>
    <div class="tag-row">
      <span class="tag primary">Business skill ${state.skill}/10</span>
      <span class="tag">Free time now ${state.time}/${state.baseTime}</span>
      <span class="tag warning">Recurring obligations ${obligatedTime()}/10</span>
      <span class="tag success">Family: ${familyLabel()}</span>
    </div>`;
}

function renderLifeLessons() {
  return `
    <div class="lesson">
      <strong>Challenge</strong>
      <span>${state.profile.challenge}</span>
    </div>
    <div class="lesson">
      <strong>Hidden advantage</strong>
      <span>${state.profile.hiddenAdvantage}</span>
    </div>`;
}

function renderStats() {
  const runway = runwayMonths();
  return `
    <div class="stat-grid">
      <div class="stat-card">
        <span class="label">Cash</span>
        <span class="value" data-testid="text-cash">${money(state.cash)}</span>
        <span class="subvalue">Runway ${runway === Infinity ? 'positive' : `${runway.toFixed(1)} mo`}</span>
      </div>
      <div class="stat-card">
        <span class="label">Cash flow</span>
        <span class="value ${monthlyCashFlow() >= 0 ? 'positive' : 'negative'}" data-testid="text-cash-flow">${money(monthlyCashFlow())}</span>
        <span class="subvalue">After debt payments</span>
      </div>
      <div class="stat-card">
        <span class="label">Passive</span>
        <span class="value positive" data-testid="text-passive">${money(totalPassiveIncome())}</span>
        <span class="subvalue">${money(state.passiveIncome)} assets + ${money(cashInterestIncome())} cash interest</span>
      </div>
      <div class="stat-card">
        <span class="label">FIRE gap</span>
        <span class="value ${fireGap() === 0 ? 'positive' : 'warning'}" data-testid="text-fire-gap">${money(fireGap())}</span>
        <span class="subvalue">expenses minus passive</span>
      </div>
      <div class="stat-card">
        <span class="label">Free time now</span>
        <span class="value ${state.time === 0 ? 'warning' : 'positive'}" data-testid="text-time-left">${state.time}/${state.baseTime}</span>
        <span class="subvalue">${obligatedTime()} recurring obligations; ${monthlyTimeCapacity()} starts free each month</span>
      </div>
    </div>`;
}

function renderTimeAccounting() {
  const sources = timeUsageRows();
  return `
    <div class="time-accounting" data-testid="section-time-accounting">
      <div>
        <span class="eyebrow">Time accounting</span>
        <strong>${state.time}/${state.baseTime} free units now</strong>
      </div>
      <div class="time-accounting-grid">
        <span>Budget <strong>${state.baseTime}/10</strong></span>
        <span>Recurring obligations <strong>-${obligatedTime()}/10</strong></span>
        <span>Starts free each month <strong>${monthlyTimeCapacity()}/10</strong></span>
      </div>
      <div class="time-source-list">
        ${sources.length ? sources.map(([label, amount], index) => `<div class="time-source" data-testid="row-time-source-${index}"><span>${label}</span><strong>-${amount}</strong></div>`).join('') : '<div class="time-source"><span>No recurring obligations yet</span><strong>0</strong></div>'}
      </div>
    </div>`;
}

function renderFireProgress() {
  return `
    <div class="panel" style="box-shadow: none;">
      <div class="panel-header">
        <div class="panel-title">
          <span class="eyebrow">Financial freedom</span>
          <h2>${percent(fireProgress() / 100)} of the way to FIRE</h2>
          <p>Passive income must cover monthly expenses: ${money(totalPassiveIncome())} / ${money(state.expenses)}.</p>
        </div>
      </div>
      <div class="progress-track" aria-label="FIRE progress">
        <div class="progress-fill" data-testid="progress-fire" style="width:${fireProgress()}%"></div>
      </div>
    </div>`;
}

function renderActions() {
  const hasCard = Boolean(state.currentCard);
  const snowball = debtSnowballAmount();
  const cut = expenseCutAmount();
  const sellableAsset = bestSellableAsset();
  const systemAsset = bestSystematizeAsset();
  return `
    <section class="panel action-panel" aria-labelledby="monthly-actions" data-testid="section-actions">
      <div class="panel-title">
        <span class="eyebrow">Monthly actions</span>
        <h2 id="monthly-actions">Choose your lever</h2>
      </div>
      <div class="action-grid">
        <button class="action-card" type="button" data-testid="button-debt-snowball" onclick="payDebtSnowball()">
          <strong>Debt snowball</strong>
          <span>No time cost. ${snowball.amount > 0 ? `Pay ${money(snowball.amount)} toward ${snowball.target.name}; keep $1,000 buffer.` : 'No extra cash above the $1,000 buffer right now.'}</span>
        </button>
        <button class="action-card" type="button" data-testid="button-cut-expenses" onclick="cutExpenses()">
          <strong>Cut expenses</strong>
          <span>Trade 1 recurring time to cut ${money(cut)}/mo from living expenses.</span>
        </button>
        <button class="action-card" type="button" data-testid="button-build-skill" onclick="buildSkill()">
          <strong>Build business skill</strong>
          <span>Costs 2 time and ${money(650)} to unlock better deal flow.</span>
        </button>
        <button class="action-card" type="button" data-testid="button-sell-asset" onclick="sellAsset()">
          <strong>Sell best asset</strong>
          <span>${sellableAsset ? `Sell ${sellableAsset.name} for ${money(sellableAsset.value)}; lose ${money(sellableAsset.passive || 0)}/mo income.` : 'No sellable asset on the balance sheet yet.'}</span>
        </button>
        <button class="action-card" type="button" data-testid="button-systematize" onclick="systematizeBusiness()">
          <strong>Systematize</strong>
          <span>${systemAsset ? `Spend ${money(1800)} on ${systemAsset.name} to buy back 1 time unit/month.` : `Need a time-consuming asset first; systematizing buys back 1 time unit/month.`}</span>
        </button>
      </div>
      <button class="primary-button" type="button" data-testid="button-next-month" onclick="nextMonth()" ${hasCard ? 'disabled' : ''}>
        Close month ${state.month}
      </button>
      ${hasCard ? `<p class="profile-note">Resolve or pass the monthly card before closing the month.</p>` : '<p class="profile-note">Debt Snowball uses all cash above a $1,000 emergency buffer.</p>'}
    </section>`;
}

function renderCurrentCard(compact = false) {
  const card = state.currentCard;
  if (!card) {
    return `
      <div class="choice-card">
        <span class="choice-kicker">Month ${state.month}</span>
        <h2 class="choice-title">No active card</h2>
        <p>You handled this month’s choice. Close the month to post income, expenses, debt payments, and interest.</p>
      </div>`;
  }
  const className = card.type;
  return `
    <article class="choice-card ${className}" data-testid="card-current">
      <span class="choice-kicker">${card.type === 'opportunity' ? 'Opportunity' : card.type === 'doodad' ? 'Doodad temptation' : card.type === 'exit' ? 'Exit offer' : 'Life event'}</span>
      <h2 class="choice-title" data-testid="text-card-title">${card.title}</h2>
      <p>${card.description}</p>
      ${renderCardEffects(card, compact)}
      <div class="lesson ${compact ? 'compact-lesson' : ''}">
        <strong>Lesson</strong>
        <span>${card.lesson}</span>
      </div>
      <div class="button-row">
        <button class="${card.type === 'doodad' ? 'danger-button' : 'success-button'}" type="button" data-testid="button-accept-card" onclick="acceptCard()">
          ${card.type === 'doodad' ? 'Buy it' : card.type === 'opportunity' ? 'Take deal' : card.type === 'exit' ? 'Sell asset' : 'Resolve event'}
        </button>
        <button class="secondary-button" type="button" data-testid="button-pass-card" onclick="passCard()">
          ${card.type === 'event' ? 'Defer it' : 'Pass'}
        </button>
      </div>
    </article>`;
}

function renderCardEffects(card, compact = false) {
  const rows = [];
  if ('cost' in card) {
    rows.push(['Cash impact', card.cost < 0 ? `+${money(Math.abs(card.cost))}` : `-${money(card.cost)}`]);
  }
  if ('cashFlow' in card) rows.push(['Monthly cash flow', `${card.cashFlow >= 0 ? '+' : ''}${money(card.cashFlow)}`]);
  if ('offerValue' in card) rows.push(['Exit cash offer', `+${money(card.offerValue)}`]);
  if ('passiveLost' in card && card.passiveLost) rows.push(['Passive income lost', `-${money(card.passiveLost)}/mo`]);
  if ('timeFreed' in card && card.timeFreed) rows.push(['Time freed', `+${card.timeFreed}/month`]);
  if ('expenseChange' in card && card.expenseChange) rows.push(['Monthly expenses', `+${money(card.expenseChange)}`]);
  if ('expenseReduction' in card && card.expenseReduction) rows.push(['Expense avoided', `-${money(card.expenseReduction)}`]);
  if ('timeChange' in card && card.timeChange) rows.push(['Time effect', `${card.timeChange > 0 ? '+' : ''}${card.timeChange}`]);
  if ('incomeChange' in card && card.incomeChange) rows.push(['Active income', `+${money(card.incomeChange)}`]);
  if ('value' in card) rows.push(['Balance sheet value', money(card.value)]);
  if ('terminalValue' in card) rows.push(['Possible future exit', money(card.terminalValue)]);
  if ('timeCost' in card) rows.push(['Time required', `${card.timeCost}/10`]);
  if ('recurringTime' in card && card.recurringTime) rows.push(['Ongoing time', `${card.recurringTime}/month`]);
  if ('skillRequired' in card) rows.push(['Business skill required', `${card.skillRequired}/10`]);
  if ('sellability' in card) rows.push(['Sellability', card.sellability]);
  if ('risk' in card) rows.push(['Risk', card.risk]);

  const compactRows =
    compact && (card.type === 'opportunity' || card.type === 'exit')
      ? rows.filter(([label]) =>
          [
            'Cash impact',
            'Monthly cash flow',
            'Exit cash offer',
            'Passive income lost',
            'Time freed',
            'Possible future exit',
            'Balance sheet value',
            'Time required',
            'Ongoing time',
            'Business skill required',
          ].includes(label),
        )
      : rows;

  return `<div class="effect-list ${compact ? 'compact-effects' : ''}">${compactRows
    .map(([label, value]) => `<div class="effect-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join('')}</div>`;
}

function renderStatements() {
  const tabs = [
    ['income', 'P&L'],
    ['balance', 'Balance'],
    ['debt', 'Debt'],
  ];
  return `
    <div class="panel-header">
      <div class="panel-title">
        <span class="eyebrow">Financial statements</span>
        <h2>Read before acting</h2>
      </div>
    </div>
    <div class="statement-tabs" role="tablist" aria-label="Statement tabs">
      ${tabs.map(([tab, label]) => `<button class="tab-button ${state.statementTab === tab ? 'active' : ''}" type="button" role="tab" data-testid="button-tab-${tab}" onclick="setStatementTab('${tab}')">${label}</button>`).join('')}
    </div>
    ${state.statementTab === 'income' ? renderIncomeStatement() : state.statementTab === 'balance' ? renderBalanceSheet() : renderDebtStatement()}`;
}

function renderIncomeStatement() {
  const timeRows = timeUsageRows().map(([label, amount]) => [`Time use: ${label}`, `-${amount}/10 units`]);
  const rows = [
    ['Time inventory', ''],
    ['Monthly time budget', `${state.baseTime}/10 units`],
    ...timeRows,
    ['Time already obligated', `-${obligatedTime()}/10 units`],
    ['Usable time this month', `${monthlyTimeCapacity()}/10 units`],
    ['Cash P&L', ''],
    ['Active income', money(state.activeIncome)],
    ['Asset passive income', money(state.passiveIncome)],
    ['Cash interest income (8% APY)', money(cashInterestIncome())],
    ['Total passive income', money(totalPassiveIncome())],
    ['Living expenses', `-${money(state.expenses)}`],
    ['Debt payments', `-${money(debtPayments())}`],
    ['Net monthly cash flow', money(monthlyCashFlow())],
  ];
  return renderRows(rows);
}

function renderBalanceSheet() {
  const rows = [
    ['Cash', money(state.cash)],
    ['Asset value', money(assetValue())],
    ['Total debt', `-${money(totalDebt())}`],
    ['Net worth', money(netWorth())],
    ['Free time inventory', `${state.time}/10 units`],
    ['Obligated time liability', `-${obligatedTime()}/10 units`],
    ['Business skill asset', `${state.skill}/10`],
  ];
  return renderRows(rows);
}

function renderDebtStatement() {
  if (!state.debts.length || totalDebt() <= 0) {
    return `<div class="lesson"><strong>Debt free</strong><span>No active debt balances. Keep the run rate under control.</span></div>`;
  }
  return `<div class="debt-list">${state.debts
    .filter((debt) => debt.balance > 0)
    .sort((a, b) => a.balance - b.balance)
    .map(
      (debt, index) => `
        <div class="debt-card" data-testid="card-debt-${index}">
          <div class="debt-head"><span>${debt.name}</span><span>${money(debt.balance)}</span></div>
          <div class="debt-meta"><span>Payment ${money(debt.payment)}/mo</span><span>APR ${percent(debt.rate)}</span></div>
        </div>`,
    )
    .join('')}</div>`;
}

function renderRows(rows) {
  return `<div class="statement-list">${rows
    .map(([label, value], index) =>
      value === ''
        ? `<div class="statement-row statement-section" data-testid="row-statement-${index}"><span>${label}</span><span></span></div>`
        : `<div class="statement-row" data-testid="row-statement-${index}"><span>${label}</span><span>${value}</span></div>`,
    )
    .join('')}</div>`;
}

function renderLog() {
  return `
    <div class="panel-title">
      <span class="eyebrow">Game log</span>
      <h2>Cause and effect</h2>
    </div>
    <div class="log-list">
      ${state.log
        .slice(0, 7)
        .map((entry, index) => `<div class="log-item" data-testid="text-log-${index}">${entry}</div>`)
        .join('')}
    </div>`;
}

function renderWon() {
  return `
    <section class="hero">
      <div class="recap-card" data-testid="section-victory">
        <span class="eyebrow">Financial freedom</span>
        <h2 class="screen-title">You reached the Fastlane in month ${state.month}</h2>
        <p>
          Passive income is now ${money(totalPassiveIncome())}/mo against expenses of ${money(state.expenses)}/mo.
          The lesson: FIRE is not a fixed number. It changes when your run rate changes.
        </p>
        ${renderStats()}
        <div class="button-row">
          <button class="primary-button" type="button" data-testid="button-play-again" onclick="resetGame()">Roll again</button>
          <button class="secondary-button" type="button" data-testid="button-continue" onclick="state.phase='play'; render()">Keep playing</button>
        </div>
      </div>
      <aside class="panel">
        ${renderLog()}
      </aside>
    </section>`;
}

function renderToast() {
  if (!state.toast) return '';
  return `<aside class="toast" role="status" data-testid="toast"><strong>${state.toast.title}</strong><span>${state.toast.detail}</span></aside>`;
}

function render() {
  app.innerHTML = `
    <div class="prototype-frame">
      ${topbar()}
      ${state.phase === 'intro' ? renderIntro() : state.phase === 'won' ? renderWon() : renderPlay()}
    </div>
    ${renderToast()}`;
}

window.rollLife = rollLife;
window.startSpecificProfile = startSpecificProfile;
window.toggleTheme = toggleTheme;
window.acceptCard = acceptCard;
window.passCard = passCard;
window.nextMonth = nextMonth;
window.payDebtSnowball = payDebtSnowball;
window.cutExpenses = cutExpenses;
window.buildSkill = buildSkill;
window.sellAsset = sellAsset;
window.systematizeBusiness = systematizeBusiness;
window.resetGame = resetGame;
window.setStatementTab = setStatementTab;
window.render_game_to_text = () =>
  JSON.stringify({
    phase: state.phase,
    profile: state.profile?.name || null,
    month: state.month,
    cash: Math.round(state.cash),
    activeIncome: Math.round(state.activeIncome),
    passiveIncome: Math.round(totalPassiveIncome()),
    assetPassiveIncome: Math.round(state.passiveIncome),
    cashInterestIncome: Math.round(cashInterestIncome()),
    expenses: Math.round(state.expenses),
    family: familyLabel(),
    familyTime: familyTime(),
    timeRemaining: state.time,
    timeCapacity: monthlyTimeCapacity(),
    recurringTime: recurringTime(),
    debt: Math.round(totalDebt()),
    debtPayments: Math.round(debtPayments()),
    cashFlow: Math.round(monthlyCashFlow()),
    fireProgress: Math.round(fireProgress()),
    currentCard: state.currentCard ? { type: state.currentCard.type, title: state.currentCard.title } : null,
    log: state.log.slice(0, 3),
  });
window.advanceTime = () => render();

render();
