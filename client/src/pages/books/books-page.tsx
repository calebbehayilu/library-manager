import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash, Loader2 } from "lucide-react";
import { apiService } from '@/services/api';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: {
    id: string;
    name: string;
  };
  isAvailable: boolean;
  publishedYear?: number;
  description?: string;
}

interface Genre {
  id: string;
  name: string;
}

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    genreId: '',
    publishedYear: '',
    description: ''
  });

  useEffect(() => {
    loadBooks();
    loadGenres();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await apiService.getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const genresData = await apiService.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookData = {
        ...newBook,
        publishedYear: newBook.publishedYear ? parseInt(newBook.publishedYear) : undefined
      };
      await apiService.createBook(bookData);
      setIsAddDialogOpen(false);
      setNewBook({ title: '', author: '', isbn: '', genreId: '', publishedYear: '', description: '' });
      loadBooks();
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await apiService.deleteBook(id);
        loadBooks();
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'available') {
      return matchesSearch && book.isAvailable;
    } else if (selectedTab === 'borrowed') {
      return matchesSearch && !book.isAvailable;
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Books</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Select value={newBook.genreId} onValueChange={(value) => setNewBook({...newBook, genreId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publishedYear">Published Year</Label>
                <Input
                  id="publishedYear"
                  type="number"
                  value={newBook.publishedYear}
                  onChange={(e) => setNewBook({...newBook, publishedYear: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Book
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No books found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{book.title}</span>
                      <Badge variant={book.isAvailable ? "secondary" : "destructive"}>
                        {book.isAvailable ? "Available" : "Borrowed"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">By {book.author}</p>
                      <p className="text-sm">ISBN: {book.isbn}</p>
                      <p className="text-sm">Genre: {book.genre?.name}</p>
                      {book.publishedYear && (
                        <p className="text-sm">Published: {book.publishedYear}</p>
                      )}
                      {book.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                      )}
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
