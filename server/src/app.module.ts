import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { GenresModule } from './genres/genres.module';
import { MembersModule } from './members/members.module';
import { BorrowingsModule } from './borrowings/borrowings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DB_NAME', 'library.db'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    BooksModule,
    GenresModule,
    MembersModule,
    BorrowingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
