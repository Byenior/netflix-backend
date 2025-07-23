import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: createMovieDto,
    });
  }

  async findAll() {
    return this.prisma.movie.findMany({
      // orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  async findByGenre(genre: string) {
    return this.prisma.movie.findMany({
      where: {
        genre: {
          contains: genre,
          mode: 'insensitive', // case insensitive search
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchMovies(query: string) {
    return this.prisma.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
