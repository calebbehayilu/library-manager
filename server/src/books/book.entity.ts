import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @Column({ default: 0 })
  totalCopies: number;

  @Column({ default: 0 })
  availableCopies: number;

  @ManyToOne(() => Genre, { eager: true })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;

  @Column({ nullable: true })
  genreId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
