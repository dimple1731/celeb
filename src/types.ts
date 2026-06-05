export interface CelebrityProfile {
  name: string;
  shortDescription: string;
  category: string; // e.g., Actor, Physicist, Athlete, Musician, Tech Leader
  biography: {
    birthDate: string;
    birthPlace: string;
    earlyLife: string;
    careerTrajectory: string;
    personalLife: string;
    impactAndLegacy: string;
  };
  keyPersonalTraits: string[];
  careerHighlights: {
    year: string;
    title: string;
    description: string;
    impact: string;
  }[];
  awardsAndRecognition: {
    award: string;
    year: string;
    category: string;
  }[];
  socialMediaUpdates: {
    id: string;
    platform: 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
    username: string;
    timestamp: string;
    content: string;
    likes: number;
    sharesCount: number;
    repliesCount: number;
    hasImage?: boolean;
    imageType?: string;
  }[];
  newsAlerts: {
    id: string;
    title: string;
    source: string;
    timeAgo: string;
    summary: string;
    category: 'breaking' | 'achievement' | 'trending' | 'announcement';
    importance: 'high' | 'medium' | 'low';
  }[];
  quotes: string[];
  trivia: string[];
  searchSuggestions: string[]; // Related famous figures for user exploration
}

export interface NewsNotification {
  id: string;
  celebrityName: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  timeAgo?: string;
  category: 'breaking' | 'achievement' | 'trending' | 'announcement';
  importance: 'high' | 'medium' | 'low';
  read: boolean;
}
