export interface LandmarkDescription {
  official_name: string;
  summary: string;
  famous_for: string[];
  history: LandmarkHistory;
  architecture: LandmarkArchitecture;
  cultural_importance: string;
  interesting_facts: string[];
  must_see: MustSeeLocation[];
  best_time_to_visit: string;
  practical_information: PracticalInformation;
  look_around_now: string[];
}

export interface LandmarkHistory {
  construction_period: string;
  built_by: string;
  original_purpose: string;
  historical_events: HistoricalEvent[];
}

export interface HistoricalEvent {
  year: string;
  event: string;
}

export interface LandmarkArchitecture {
  style: string;
  materials: string[];
  notable_features: string[];
}

export interface MustSeeLocation {
  name: string;
  description: string;
}

export interface PracticalInformation {
  opening_hours: string;
  ticket_information: string;
  accessibility: string;
  visitor_tips: string[];
}