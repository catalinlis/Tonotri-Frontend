export interface CityDescription{
    city: string;
    country: string;
    summary: string;
    population: number;
    best_time_to_visit: string;
    // to add
    currency: string;
    language: string;
    annual_events: AnnualEvent[];
    //
    famous_for: DescriptionItem[];
    districts: District[];
    top_places: TopPlace[];
    local_foods: DescriptionItem[];
    transportation: Transportation;

    // Available for Big City Schemas
    nightlife_areas?: NightlifeArea[];
    shopping_areas?: DescriptionItem[];
    travel_tips: string[];
}

export interface DescriptionItem {
  name: string;
  description: string;
}


export interface District {
  name: string;
  description: string;
  known_for: string;
}


export interface TopPlace {
  name: string;
  description: string;
  category: PlaceCategory | string;
}


export type PlaceCategory =
  | 'Landmark'
  | 'Museum'
  | 'Park'
  | 'Church'
  | 'Square'
  | 'Castle'
  | 'Nature'
  | 'Entertainment'
  | 'Shopping'
  | 'Historic Site'
  | 'Other';


export interface NightlifeArea {
  name: string;
  summary: string;
  best_for: string;
}


export interface Transportation {
  metro: boolean;
  tram: boolean;
  bus: boolean;
  bike_friendly: boolean;
  airport: boolean;
}

export interface AnnualEvent{
  name: string;
  description: string;
  period: string;
  category: string;
}