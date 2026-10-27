export interface UserDetailedInfo {
  username: string;
  first_name: string;
  last_name: string;
  birthday: string;
  gender: string;
  image_path: string | null;
  visited_countries: string[];
  followers_count?: number;
  following_count?: number;
}