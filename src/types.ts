export interface Player {
  id: string;
  name: string;
  team: string;
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  price: number;
  form: number;
  expectedPoints: number;
  totalPoints: number;
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  ictIndex: number;
  fixtures: Fixture[];
  injuryRisk: 'Low' | 'Medium' | 'High';
  similarityCluster: number;
  consistencyScore: number;
  shotsOnTargetPer90: number;
  keyPassesPer90: number;
  nextFivePredictions: number[];
}

export interface Fixture {
  opponent: string;
  difficulty: number;
  isHome: boolean;
  gameweek: number;
}

export interface PredictionResult {
  playerId: string;
  predictedPoints: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}
