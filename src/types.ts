// types.ts

export type AnalyticsData = {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  interactions: Interaction[];
};

export type Interaction = {
  type: string;
  timestamp: number;
  data: any;
};

export type AnalyticsResponse = {
  data: AnalyticsData[];
  errors: string[];
};

export type AnalyticsRequest = {
  data: AnalyticsData[];
  options: AnalyticsOptions;
};

export type AnalyticsOptions = {
  batchSize: number;
  batchTimeout: number;
};