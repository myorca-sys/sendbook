export interface AnimeSource {
  quality: string;
  provider: string;
  url: string;
  type: string;
}

export interface AnimeSourceRule {
  id: string;
  domain: string;
  pipeline: any[];
}
