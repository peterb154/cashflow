import type { FamilyStart } from '../types';

export const familyStarts: FamilyStart[] = [
  { status: 'single', kids: 0, label: 'Single, no kids' },
  { status: 'single', kids: 1, label: 'Single parent, 1 kid' },
  { status: 'single', kids: 2, label: 'Single parent, 2 kids' },
  { status: 'married', kids: 0, label: 'Married, no kids' },
  { status: 'married', kids: 1, label: 'Married, 1 kid' },
  { status: 'married', kids: 2, label: 'Married, 2 kids' },
  { status: 'married', kids: 3, label: 'Married, 3 kids' },
];
