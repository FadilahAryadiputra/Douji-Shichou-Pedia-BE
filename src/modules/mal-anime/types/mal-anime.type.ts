export interface MalAnimeGenre {
  id: number;
  name: string;
}

export interface MalAnimePicture {
  medium: string;
  large: string;
}

export interface MalAnimeAlternativeTitles {
  synonyms?: string[];
  en?: string;
  ja?: string;
}

export interface MalAnime {
  id: number; 
  title: string;
  main_picture: MalAnimePicture;
  alternative_titles: MalAnimeAlternativeTitles;
  start_date: string;
  end_date: string;
  synopsis: string;
  mean: number;
  genres: MalAnimeGenre[];
  media_type: string;
  status: string;
  num_episodes: number;
  start_season: string;
  studios: string;
}

export interface MalAnimeSearchResponse {
  data: {
    node: MalAnime;
  }[];

  paging?: {
    next?: string;
    previous?: string;
  };
}