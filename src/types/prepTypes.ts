
export interface Argument {
  id: string;
  claim: string;
  whyTrue: string;
  mechanism: string;
  impact: string;
  weighing: string;
}

export interface PrepNotes {
  problem: string;
  mechanism: string;
  framing: string;
  ideaDump: string;
  notes: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
