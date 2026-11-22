export interface AnalyticalTool {
  name: string;
  url: string;
}

export interface UserDashboardData {
  subscriptions: {
    datasets: number;
    queries: number;
  };
  academy: {
    planned: number;
    current: number;
    finished: number;
  };
  lab: {
    analyses: number;
    researches: number;
  };
  suggestions: {
    active: number;
    inactive: number;
  };
  meetings: {
    planned: number;
    finished: number;
  };
  schedules: {
    started: number;
    ready: number;
    recommended: number;
    notifications_count: number;
    notifications: any[];
  };
  likes: {
    likes_count: number;
  };
  fav_charts: {
    'slot-1': {
      name?: string;
      ident?: string;
      thumb_url?: string;
    };
    'slot-2': {
      name?: string;
      ident?: string;
      thumb_url?: string;
    };
  };
  analytical_tools: AnalyticalTool[];
  cms_url: string;
}
