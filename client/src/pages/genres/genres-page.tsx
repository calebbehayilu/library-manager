import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Search, Edit, Trash2, Eye, Tag } from "lucide-react";

interface Genre {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  createdDate: string;
  isActive: boolean;
}

const mockGenres: Genre[] = [
  {
    id: "1",
    name: "Fiction",
    description: "Literary works that are imaginary and not based on real events",
    bookCount: 45,
    createdDate: "2023-01-15",
    isActive: true
  },
  {
    id: "2",
    name: "Non-Fiction",
    description: "Books based on real facts, events, and information",
    bookCount: 32,
    createdDate: "2023-01-15",
    isActive: true
  },
  {
    id: "3",
    name: "Science Fiction",
    description: "Fiction dealing with advanced science and technology",
    bookCount: 18,
    createdDate: "2023-02-10",
    isActive: true
  },
  {
    id: "4",
    name: "Romance",
    description: "Stories focused on love and relationships",
    bookCount: 25,
    createdDate: "2023-03-05",
    isActive: true
  },
  {
    id: "5",
    name: "Mystery",
    description: "Stories involving puzzles, crimes, or unexplained events",
    bookCount: 15,
    createdDate: "2023-04-12",
    isActive: true
  },
  {
    id: "6",
    name: "Biography",
    description: "Life stories of real people",
    bookCount: 8,
    createdDate: "2023-05-20",
    isActive: false
  },
];

export default function GenresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genres] = useState<Genre[]>(mockGenres);

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genre.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeGenres = filteredGenres.filter(genre => genre.isActive);
  const inactiveGenres = filteredGenres.filter(genre => !genre.isActive);

  const getGenreColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    return colors[index % colors.length];
  };

  const GenreCard = ({ genre, index }: { genre: Genre; index: number }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-lg">{genre.name}</h3>
          </div>
          <Badge className={getGenreColor(index)} variant="secondary">
            {genre.bookCount} books
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{genre.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created: {new Date(genre.createdDate).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const GenreTable = ({ genres }: { genres: Genre[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Genre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Books</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {genres.map((genre, index) => (
          <TableRow key={genre.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{genre.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-md">
                <p className="text-sm text-gray-600 line-clamp-2">{genre.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getGenreColor(index)} variant="secondary">
                {genre.bookCount}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(genre.createdDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge variant={genre.isActive ? "default" : "secondary"}>
                {genre.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Genres Management</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Genre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Total Genres</span>
            </div>
            <div className="text-2xl font-bold mt-2">{genres.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Active Genres</span>
            </div>
            <div className="text-2xl font-bold mt-2">{activeGenres.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Total Books</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {genres.reduce((sum, genre) => sum + genre.bookCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by genre name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="active">Active ({activeGenres.length})</TabsTrigger>
          <TabsTrigger value="all">All Genres ({filteredGenres.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGenres.map((genre, index) => (
              <GenreCard key={genre.id} genre={genre} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Genres ({activeGenres.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <GenreTable genres={activeGenres} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Genres ({filteredGenres.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <GenreTable genres={filteredGenres} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
