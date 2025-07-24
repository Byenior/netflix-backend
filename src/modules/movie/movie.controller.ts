import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  // Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // list movie for footer
  @Get('/list-movies')
  getMovies() {
    return this.movieService.findAll();
  }

  @Post('add-movies')
  addMovies(@Body() body: CreateMovieDto[] | CreateMovieDto) {
    if (!Array.isArray(body)) {
      return this.movieService.createOne(body);
    } else if (body.length > 0) {
      return this.movieService.createMany(body);
    }

    throw new Error(
      'Invalid data format. Expected array of movies or object with movies array.',
    );
  }

  //================

  // @Get()
  // findAll() {
  //   return this.movieService.findAll();
  // }

  // @Get('search')
  // search(@Query('q') query: string) {
  //   return this.movieService.searchMovies(query);
  // }

  // @Get('genre/:genre')
  // findByGenre(@Param('genre') genre: string) {
  //   return this.movieService.findByGenre(genre);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.movieService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.movieService.update(+id, updateMovieDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.movieService.remove(+id);
  // }
}
