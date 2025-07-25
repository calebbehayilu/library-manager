import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  findAll(): Promise<Genre[]> {
    return this.genresRepository.find();
  }

  findOne(id: string): Promise<Genre | null> {
    return this.genresRepository.findOne({ where: { id } });
  }

  create(genre: Partial<Genre>): Promise<Genre> {
    const newGenre = this.genresRepository.create(genre);
    return this.genresRepository.save(newGenre);
  }

  async update(id: string, genre: Partial<Genre>): Promise<Genre | null> {
    await this.genresRepository.update(id, genre);
    return this.genresRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.genresRepository.delete(id);
  }
}