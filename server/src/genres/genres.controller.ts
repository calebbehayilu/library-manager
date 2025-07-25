import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from './genre.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('genres')
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll(): Promise<Genre[]> {
    return this.genresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre> {
    const genre = await this.genresService.findOne(id);
    if (!genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
    return genre;
  }

  @Post()
  create(@Body() genre: Partial<Genre>): Promise<Genre> {
    return this.genresService.create(genre);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() genre: Partial<Genre>): Promise<Genre> {
    const updatedGenre = await this.genresService.update(id, genre);
    if (!updatedGenre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
    return updatedGenre;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.genresService.remove(id);
  }
}
