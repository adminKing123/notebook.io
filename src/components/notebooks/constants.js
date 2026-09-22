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

export const CREATE_NOTEBOOK_CARD = {
  title: 'Create New Notebook',
  description: 'Start a fresh notebook for your thoughts and ideas.',
  footerLabel: 'New',
};

export const NOTEBOOK_INFO_FIELDS = [
  { id: 'created', label: 'Created', key: 'createdAt', type: 'datetime' },
  { id: 'updated', label: 'Last updated', key: 'lastUpdatedAt', type: 'datetime' },
  { id: 'owner', label: 'Owned by', key: 'ownedBy', type: 'text' },
];
