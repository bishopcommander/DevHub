export const landingFeatures = [
  {
    title: 'AI Code Explainer',
    description: 'Understand complex snippets in seconds with plain-language walkthroughs and edge-case callouts.',
    icon: 'spark',
  },
  {
    title: 'Dev Tracker',
    description: 'Track coding time, focus blocks, and streak consistency to build better coding habits.',
    icon: 'clock',
  },
  {
    title: 'Dev Bingo',
    description: 'Turn deep work into a game with daily board challenges designed for meaningful progress.',
    icon: 'grid',
  },
  {
    title: 'Mood Music',
    description: 'Match your workflow with focus playlists and ambient tracks that keep you in the zone.',
    icon: 'music',
  },
];

export const testimonials = [
  {
    name: 'Anika Patel',
    role: 'Frontend Engineer at LayerStack',
    quote: 'DevHub turned my scattered coding sessions into clear momentum. My streak has never been this consistent.',
  },
  {
    name: 'Jordan Lee',
    role: 'Indie Hacker',
    quote: 'The AI explainer plus tracker combo helps me ship faster while understanding every line I write.',
  },
  {
    name: 'Marcus Dunn',
    role: 'CS Student',
    quote: 'Dev Bingo keeps me accountable and surprisingly makes practice feel fun again.',
  },
];

export const pricing = [
  {
    tier: 'Free',
    price: '$0',
    description: 'Great for getting started',
    features: ['Basic AI explanations', 'Weekly coding stats', '1 bingo board template', 'Standard music presets'],
  },
  {
    tier: 'Pro',
    price: '$12/mo',
    description: 'For focused developers and teams',
    features: ['Unlimited AI explanations', 'Advanced tracker analytics', 'Custom bingo boards', 'Spotify-powered music modes'],
  },
];

export const trackerStats = [
  { label: 'Hours Coded', value: '42h' },
  { label: 'Current Streak', value: '11 days' },
  { label: 'Tasks Closed', value: '27' },
  { label: 'Focus Score', value: '89%' },
];

export const codeSample = `function rankSession(session) {
  const flowBonus = session.deepWorkMinutes > 90 ? 15 : 6;
  const streakBonus = session.streakDays * 2;

  return {
    score: session.baseScore + flowBonus + streakBonus,
    tip: session.distractions > 2 ? 'Try Focus Mode' : 'Great momentum',
  };
}`;

export const explanationSteps = [
  'The function computes an overall productivity score for one coding session.',
  'It awards a higher bonus when deep work exceeds 90 minutes.',
  'Streak consistency adds incremental points to reinforce daily coding habits.',
  'It returns both a numeric score and a tailored focus tip based on distractions.',
];

export const weeklyFocusData = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 6 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 7 },
  { day: 'Fri', hours: 8 },
  { day: 'Sat', hours: 6 },
  { day: 'Sun', hours: 6 },
];

export const bingoTasks = [
  'Ship 1 feature', 'Write tests', 'No social scroll', 'Refactor module', 'Solve 2 bugs',
  'Pair review', 'Clean TODOs', 'Keyboard-only hour', 'Read docs', 'Update README',
  'Pomodoro x4', 'Close 3 issues', 'Optimize query', 'Focus playlist', 'Learn new API',
  'Ship micro-fix', 'Deep work 120m', 'Practice DSA', 'Write changelog', 'Cut one meeting',
  'Code journal', 'Review PRs', 'Fix lint debt', 'Tidy components', 'Celebrate win',
];
