export interface NormalizedMedia {
  externalId: string;
  title: string;
  coverImageUrl: string | null;
  synopsis: string | null;
  releaseYear: number | null;
  totalEpisodes: number | null;
  totalChapters: number | null;
  genres: string[];
  averageScore: number | null;
}