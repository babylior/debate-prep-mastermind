
// Types for storing debate notes
export interface DebateNotes {
  motion: string;
  role: string;
  prep: Record<string, string>;
  listening: Record<string, string>;
  speech: Record<string, string>;
  lastUpdated: number;
  arguments?: Array<{id: string, title: string, content: string}>;
  prepArguments?: Array<{id: string, title: string, content: string}>;
  teamNotes?: {
    og: string;
    oo: string;
    cg: string;
    co: string;
  };
  interactivePrompts?: Array<{id: string, question: string, answer: string, rebuttal: string}>;
}

// Get notes from local storage
export const getNotes = (): DebateNotes | null => {
  const notes = localStorage.getItem('debate-notes');
  if (!notes) return null;
  
  try {
    return JSON.parse(notes) as DebateNotes;
  } catch (error) {
    console.error('Error parsing notes from localStorage:', error);
    return null;
  }
};

// Save notes to local storage
export const saveNotes = (notes: DebateNotes): void => {
  try {
    notes.lastUpdated = Date.now();
    localStorage.setItem('debate-notes', JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

// Clear notes from local storage
export const clearNotes = (): void => {
  localStorage.removeItem('debate-notes');
};

// Get motion from local storage
export const getMotion = (): string => {
  const notes = getNotes();
  return notes?.motion || '';
};

// Save motion to local storage
export const saveMotion = (motion: string): void => {
  const notes = getNotes() || {
    motion: '',
    role: '',
    prep: {},
    listening: {},
    speech: {},
    lastUpdated: Date.now()
  };
  
  notes.motion = motion;
  saveNotes(notes);
};

// Get selected role from local storage
export const getRole = (): string => {
  const notes = getNotes();
  return notes?.role || '';
};

// Save selected role to local storage
export const saveRole = (role: string): void => {
  const notes = getNotes() || {
    motion: '',
    role: '',
    prep: {},
    listening: {},
    speech: {},
    lastUpdated: Date.now()
  };
  
  notes.role = role;
  saveNotes(notes);
};
