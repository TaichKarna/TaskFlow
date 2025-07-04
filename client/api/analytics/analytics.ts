import api from '@/api';
import { AnalyticsData } from '@/types/analytics';

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get<AnalyticsData>('/analytics');
  return response;
};
