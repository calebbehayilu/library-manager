import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { GenresService } from './genres/genres.service';
import { BooksService } from './books/books.service';
import { MembersService } from './members/members.service';
import { UserRole } from './users/user.entity';
import { Genre } from './genres/genre.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const genresService = app.get(GenresService);
  const booksService = app.get(BooksService);
  const membersService = app.get(MembersService);

  try {
    console.log('Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await usersService.create({
      username: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    console.log('Admin user created:', adminUser.username);

    // Create librarian user
    const librarianPassword = await bcrypt.hash('librarian123', 10);
    const librarianUser = await usersService.create({
      username: 'librarian',
      password: librarianPassword,
      role: UserRole.LIBRARIAN,
    });
    console.log('Librarian user created:', librarianUser.username);

    // Create genres
    const genres = [
      { name: 'Fiction' },
      { name: 'Non-Fiction' },
      { name: 'Science Fiction' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
      { name: 'Romance' },
      { name: 'Biography' },
      { name: 'History' },
      { name: 'Science' },
      { name: 'Technology' },
    ];

    const createdGenres: Genre[] = [];
    for (const genre of genres) {
      const createdGenre = await genresService.create(genre);
      createdGenres.push(createdGenre);
      console.log('Genre created:', createdGenre.name);
    }

    // Create sample books
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        totalCopies: 5,
        availableCopies: 5,
        genreId: createdGenres.find(g => g.name === 'Fiction')?.id,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        totalCopies: 3,
        availableCopies: 3,
        genreId: createdGenres.find(g => g.name === 'Fiction')?.id,
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '978-0-441-17271-9',
        totalCopies: 4,
        availableCopies: 4,
        genreId: createdGenres.find(g => g.name === 'Science Fiction')?.id,
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        isbn: '978-0-544-00341-5',
        totalCopies: 6,
        availableCopies: 6,
        genreId: createdGenres.find(g => g.name === 'Fantasy')?.id,
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        totalCopies: 2,
        availableCopies: 2,
        genreId: createdGenres.find(g => g.name === 'Technology')?.id,
      },
    ];

    for (const book of books) {
      const createdBook = await booksService.create(book);
      console.log('Book created:', createdBook.title);
    }

    // Create sample members
    const members = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        membershipNumber: 'LIB001',
        phone: '+1-555-0123',
        address: '123 Main St, Anytown, ST 12345',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isActive: true,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        membershipNumber: 'LIB002',
        phone: '+1-555-0124',
        address: '456 Oak Ave, Anytown, ST 12345',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        membershipNumber: 'LIB003',
        phone: '+1-555-0125',
        address: '789 Pine St, Anytown, ST 12345',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ];

    for (const member of members) {
      const createdMember = await membersService.create(member);
      console.log('Member created:', `${createdMember.firstName} ${createdMember.lastName}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
