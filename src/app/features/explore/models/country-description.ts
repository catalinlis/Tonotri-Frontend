export interface CountryDescription{
    country: string;
    summary: string;
    best_time_to_visit: string;
    currency: string;
    language: string;
    top_cities: {
        name: string;
        description: string;
    }[];
    top_places: {
        name: string;
        description: string;
        category: string;
        recommended_days: number;
    }[];
    annual_events: {
        name: string;
        city: string;
        description: string;
        period: string;
        category: string;
    }[];
    travel_tips: string[];
}