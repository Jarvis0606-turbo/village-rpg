export interface Player {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  level: number;
  inventory: InventoryItem[];
  suspicionLevel: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  dialogues: Dialogue[];
  missions: Mission[];
  type: 'normal' | 'suspicious' | 'corrupted';
}

export interface Dialogue {
  id: string;
  text: string;
  nextDialogueId?: string;
  choices?: DialogueChoice[];
  suspicionIncrease?: number;
}

export interface DialogueChoice {
  text: string;
  nextDialogueId?: string;
  missionId?: string;
  suspicionIncrease?: number;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  objective: string;
  reward: {
    experience: number;
    items?: InventoryItem[];
    suspicionIncrease?: number;
  };
  completed: boolean;
  type: 'daily' | 'regular' | 'mystery' | 'final';
}

export interface GameState {
  player: Player;
  npcs: NPC[];
  missions: Mission[];
  worldSuspicion: number;
  demonKingEncountered: boolean;
  gameEnded: boolean;
  ending: 'victory' | 'defeat' | null;
}
