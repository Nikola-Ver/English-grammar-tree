export interface TenseChoice {
  labelKey: string;
  icon: string;
  result?: string;
  next?: string;
}

export interface TenseNode {
  qKey: string;
  choices: TenseChoice[];
}

export const TENSE_TREE: Record<string, TenseNode> = {
  start: {
    qKey: 'tenseTree.start.q',
    choices: [
      { labelKey: 'tenseTree.start.c0', icon: '🔵', next: 'present' },
      { labelKey: 'tenseTree.start.c1', icon: '🟣', next: 'past' },
      { labelKey: 'tenseTree.start.c2', icon: '🟢', next: 'future' },
    ],
  },
  present: {
    qKey: 'tenseTree.present.q',
    choices: [
      { labelKey: 'tenseTree.present.c0', icon: '📅', result: 'present_simple' },
      { labelKey: 'tenseTree.present.c1', icon: '⏱️', next: 'present_now' },
      { labelKey: 'tenseTree.present.c2', icon: '🔗', next: 'present_perfect_branch' },
    ],
  },
  present_now: {
    qKey: 'tenseTree.present_now.q',
    choices: [
      { labelKey: 'tenseTree.present_now.c0', icon: '💭', result: 'present_simple' },
      { labelKey: 'tenseTree.present_now.c1', icon: '⚡', result: 'present_continuous' },
    ],
  },
  present_perfect_branch: {
    qKey: 'tenseTree.present_perfect_branch.q',
    choices: [
      { labelKey: 'tenseTree.present_perfect_branch.c0', icon: '✅', result: 'present_perfect' },
      {
        labelKey: 'tenseTree.present_perfect_branch.c1',
        icon: '⏳',
        result: 'present_perfect_continuous',
      },
    ],
  },
  past: {
    qKey: 'tenseTree.past.q',
    choices: [
      { labelKey: 'tenseTree.past.c0', icon: '📌', result: 'past_simple' },
      { labelKey: 'tenseTree.past.c1', icon: '🌊', result: 'past_continuous' },
      { labelKey: 'tenseTree.past.c2', icon: '⏪', next: 'past_perfect_branch' },
    ],
  },
  past_perfect_branch: {
    qKey: 'tenseTree.past_perfect_branch.q',
    choices: [
      { labelKey: 'tenseTree.past_perfect_branch.c0', icon: '✔️', result: 'past_perfect' },
      {
        labelKey: 'tenseTree.past_perfect_branch.c1',
        icon: '⏳',
        result: 'past_perfect_continuous',
      },
    ],
  },
  future: {
    qKey: 'tenseTree.future.q',
    choices: [
      { labelKey: 'tenseTree.future.c0', icon: '💡', result: 'future_will' },
      { labelKey: 'tenseTree.future.c1', icon: '📝', result: 'future_going_to' },
      { labelKey: 'tenseTree.future.c2', icon: '⏱️', result: 'future_continuous' },
      { labelKey: 'tenseTree.future.c3', icon: '✅', result: 'future_perfect' },
    ],
  },
};
