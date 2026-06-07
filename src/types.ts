export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  skills: string;
  availability: string;
  message: string;
  createdAt: string;
}

export interface InitiativeApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  message: string;
  createdAt: string;
}

export interface WasteMetrics {
  currentKg: number;
  targetKg: number;
  volunteersCount: number;
  eventsCount: number;
  communitiesCount: number;
}

export interface ActivityLog {
  id: string;
  type: 'waste_update' | 'new_volunteer' | 'new_initiative';
  description: string;
  value?: string;
  timestamp: string;
}
