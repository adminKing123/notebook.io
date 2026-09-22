import { NOTEBOOK_ACCESS, NOTEBOOK_ACCESS_LABELS } from '../notebooks/constants';

export const CREATE_NOTEBOOK_STEPS = {
  DETAILS: 0,
  ACCESS: 1,
  THUMBNAIL: 2,
};

export const CREATE_NOTEBOOK_STEP_COUNT = 3;

export const CREATE_NOTEBOOK_STEP_LABELS = ['Details', 'Access', 'Thumbnail'];

export const INITIAL_CREATE_NOTEBOOK_FORM = {
  title: '',
  description: '',
  access: NOTEBOOK_ACCESS.PRIVATE,
  thumbnailFile: null,
  thumbnailPreview: '',
};

export const NOTEBOOK_ACCESS_OPTIONS = [
  {
    value: NOTEBOOK_ACCESS.PRIVATE,
    label: NOTEBOOK_ACCESS_LABELS[NOTEBOOK_ACCESS.PRIVATE],
    description: 'Only you can view and edit this notebook.',
  },
  {
    value: NOTEBOOK_ACCESS.PUBLIC,
    label: NOTEBOOK_ACCESS_LABELS[NOTEBOOK_ACCESS.PUBLIC],
    description: 'Anyone can view this notebook. Only you can edit it.',
  },
  {
    value: NOTEBOOK_ACCESS.SHARED,
    label: NOTEBOOK_ACCESS_LABELS[NOTEBOOK_ACCESS.SHARED],
    description: 'Invite specific people to view or collaborate.',
  },
];

export const CREATE_NOTEBOOK_STEP_CONTENT = {
  [CREATE_NOTEBOOK_STEPS.DETAILS]: {
    title: 'Notebook details',
    description: 'Give your notebook a name and a short description.',
  },
  [CREATE_NOTEBOOK_STEPS.ACCESS]: {
    title: 'Choose access',
    description: 'Decide who can see and use this notebook.',
  },
  [CREATE_NOTEBOOK_STEPS.THUMBNAIL]: {
    title: 'Add a thumbnail',
    description: 'Upload a cover image and preview how it will appear.',
  },
};
