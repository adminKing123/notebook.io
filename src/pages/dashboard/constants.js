export const NOTEBOOKS_SECTION = {
  title: 'Recent Notebooks',
  description: 'Jump back into a recent notebook or create a new one.',
};

export const CREATE_NOTEBOOK_CARD = {
  title: 'Create New Notebook',
  description: 'Start a fresh notebook for your thoughts and ideas.',
  footerLabel: 'New',
};

export const NOTEBOOK_ACCESS = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  SHARED: 'shared',
};

export const NOTEBOOK_ACCESS_LABELS = {
  [NOTEBOOK_ACCESS.PUBLIC]: 'Public',
  [NOTEBOOK_ACCESS.PRIVATE]: 'Private',
  [NOTEBOOK_ACCESS.SHARED]: 'Shared',
};

export const NOTEBOOK_INFO_FIELDS = [
  { id: 'created', label: 'Created', key: 'createdAt', type: 'datetime' },
  { id: 'updated', label: 'Last updated', key: 'lastUpdatedAt', type: 'datetime' },
  { id: 'owner', label: 'Owned by', key: 'ownedBy', type: 'text' },
];

export const RECENT_NOTEBOOKS = [
  {
    id: 'notebook-1',
    title: 'Morning Pages',
    description: 'Daily reflections, gratitude notes, and quick thoughts before the day begins.',
    fullDescription:
      'Daily reflections, gratitude notes, and quick thoughts before the day begins. Includes weekend recap entries, monthly intention setting, and short prompts for mindfulness.',
    pageCount: 42,
    access: NOTEBOOK_ACCESS.PRIVATE,
    createdAt: '2025-11-12T08:30:00',
    lastUpdatedAt: '2026-09-20T19:45:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-2',
    title: 'Travel Sketches',
    description: 'Places visited, small observations, and memories from recent trips.',
    fullDescription:
      'Places visited, small observations, and memories from recent trips. Notes on cafes, city walks, museum visits, and photo captions for future albums.',
    pageCount: 18,
    access: NOTEBOOK_ACCESS.SHARED,
    createdAt: '2026-01-05T14:15:00',
    lastUpdatedAt: '2026-09-18T11:20:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-3',
    title: 'Project Ideas',
    description: 'App concepts, feature notes, and rough plans for future builds.',
    fullDescription:
      'App concepts, feature notes, and rough plans for future builds. Tracks UI experiments, API sketches, and milestone ideas for Personal Diary and side projects.',
    pageCount: 31,
    access: NOTEBOOK_ACCESS.PRIVATE,
    createdAt: '2025-09-02T10:00:00',
    lastUpdatedAt: '2026-09-21T22:10:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-4',
    title: 'Reading Notes',
    description: 'Quotes, summaries, and takeaways from books and articles.',
    fullDescription:
      'Quotes, summaries, and takeaways from books and articles. Organized by title with page references, key ideas, and follow-up reading lists.',
    pageCount: 27,
    access: NOTEBOOK_ACCESS.PUBLIC,
    createdAt: '2026-02-18T09:40:00',
    lastUpdatedAt: '2026-09-15T16:35:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-5',
    title: 'Weekly Review',
    description: 'End-of-week summaries, wins, and priorities for the next week.',
    fullDescription:
      'End-of-week summaries, wins, and priorities for the next week. Includes habit check-ins, blockers, and a short plan for Monday morning.',
    pageCount: 12,
    access: NOTEBOOK_ACCESS.PRIVATE,
    createdAt: '2026-03-01T18:00:00',
    lastUpdatedAt: '2026-09-19T20:05:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-6',
    title: 'Family Stories',
    description: 'Shared memories and stories collected with family members.',
    fullDescription:
      'Shared memories and stories collected with family members. Childhood anecdotes, holiday traditions, and interview notes from conversations with relatives.',
    pageCount: 15,
    access: NOTEBOOK_ACCESS.SHARED,
    createdAt: '2025-12-20T12:25:00',
    lastUpdatedAt: '2026-09-10T09:50:00',
    ownedBy: 'Harsh Verma',
  },
  {
    id: 'notebook-7',
    title: 'Study Log',
    description: 'Course notes, practice problems, and revision checkpoints.',
    fullDescription:
      'Course notes, practice problems, and revision checkpoints. Tracks lecture summaries, exam prep schedules, and topics that need another review pass.',
    pageCount: 36,
    access: NOTEBOOK_ACCESS.PUBLIC,
    createdAt: '2026-04-08T07:55:00',
    lastUpdatedAt: '2026-09-22T08:15:00',
    ownedBy: 'Harsh Verma',
  },
];
