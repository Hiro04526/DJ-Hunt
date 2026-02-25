// --- DJ PROP FOR VOTING FORM ---
export interface DJ {
  id: number
  name: string
  image: string
  description: string
  videoshoot: string
  stinger: string
  segue: string
  voiceover: string
}

// --- AUDIO PLAYER ---
export interface AudioPlayerProps {
  src: string | null | undefined
}

// --- EQUAL DURATION TYPEWRITER ---
export interface TypeWriterProps {
  lines: string[];
  typeMs?: number;      // total time to fully type a line
  holdMs?: number;      // time to keep full line on screen
  backspaceMs?: number; // total time to fully delete a line
  className?: string;
  showCursor?: boolean;
};