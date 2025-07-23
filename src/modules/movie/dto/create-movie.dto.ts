export class CreateMovieDto {
  title: string;
  description?: string;
  genre?: string;
  releaseYear?: number;
  duration?: number;
  imageUrl: string;
  videoUrl?: string;
  rating?: number;
}
