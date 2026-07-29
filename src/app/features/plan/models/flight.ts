export interface FlightsResponse {
  best_flights?: FlightGroup[];
  other_flights?: FlightGroup[];
  price_insights?: PriceInsights;
  airports?: AirportsGroup[];
}

export interface FlightGroup {
  flights: Flight[];              //always present
  layovers?: Layover[];           //optional
  total_duration: number;         //always present
  carbon_emissions?: CarbonEmissions;
  price: number;                  //always present
  type: string;                   //always present

  airline_logo?: string;
  extensions?: string[];
  booking_token?: string;
  departure_token?: string;
}

export interface Flight {
  departure_airport: Airport;
  arrival_airport: Airport;

  duration: number;
  airline: string;
  flight_number: string;

  airplane?: string;
  airline_logo?: string;
  travel_class?: string;
  extensions?: string[];
  ticket_also_sold_by?: string[];
  legroom?: string;
  overnight?: boolean;
  often_delayed_by_over_30_min?: boolean;
  plane_and_crew_by?: string;
}

export interface Airport {
  name: string;      
  id: string;        
  time?: string;     
}

export interface Layover {
  duration: number;
  name: string;
  id: string;
  overnight?: boolean;
}

export interface CarbonEmissions {
  this_flight: number;
  typical_for_this_route: number;
  difference_percent: number;
}

export interface PriceInsights {
  lowest_price?: number;
  price_level?: string;
  typical_price_range?: [number, number];
  price_history?: [number, number][];
}

export interface AirportsGroup {
  departure?: AirportInfo[];
  arrival?: AirportInfo[];
}

export interface AirportInfo {
  airport: AirportCore;     // ✅ usually present

  city?: string;
  country?: string;
  country_code?: string;

  image?: string;
  thumbnail?: string;
}

export interface AirportCore {
  name: string;             // ✅
  id: string;               // ✅
}