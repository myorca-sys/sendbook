export interface UnifiedMediaItem {
  id: string;
  title: string;
  subTitle?: string;
  nativeTitle?: string;
  imageUrl: string;
  bannerUrl?: string;
  episode: string;
  score: number;
  views: number;
  genres: string[];
  status?: string;
  format?: string;
  color?: string;
  mediaType?: "anime" | "manga";
}

export interface UnifiedMediaDetail extends UnifiedMediaItem {
  synopsis: string;
  author: string;
  studios: string[];
  season?: string;
  seasonYear?: number;
  totalEpisodes?: number;
  nextAiringEpisode?: any;
  relations: any[];
  episodes: any[];
}
