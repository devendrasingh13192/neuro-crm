export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  prospectClients: number;
  averageRelationshipScore: number;
  neurodiversityDistribution: {
    autistic: number;
    adhd: number;
    typical: number;
    mixed: number;
    unknown: number;
  };
}

export interface RecentActivity {
  _id?: string;
  clientName: string;
  clientId: string;
  type: 'email' | 'phone' | 'text' | 'video' | 'in-person';
  summary: string;
  date?: Date;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingInteractions: any[];
}