import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash, Loader2, Tag } from "lucide-react";
import { apiService } from '@/services/api';

interface Genre {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGenre, setNewGenre] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const genresData = await apiService.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createGenre(newGenre);
      setIsAddDialogOpen(false);
      setNewGenre({ name: '', description: '' });
      loadGenres();
    } catch (error) {
      console.error('Failed to add genre:', error);
    }
  };

  const handleDeleteGenre = async (id: string) => {
    if (confirm('Are you sure you want to delete this genre?')) {
      try {
        await apiService.deleteGenre(id);
        loadGenres();
      } catch (error) {
        console.error('Failed to delete genre:', error);
      }
    }
  };

  const filteredGenres = genres.filter(genre => 
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold tracking-tight">Genres</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Genre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Genre</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGenre} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Genre Name</Label>
                <Input
                  id="name"
                  value={newGenre.name}
                  onChange={(e) => setNewGenre({...newGenre, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newGenre.description}
                  onChange={(e) => setNewGenre({...newGenre, description: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Add Genre
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search genres..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredGenres.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No genres found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGenres.map((genre) => (
            <Card key={genre.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span className="truncate">{genre.name}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {genre.description && (
                    <p className="text-sm text-gray-600">{genre.description}</p>
                  )}
                  {genre.createdAt && (
                    <p className="text-xs text-gray-500">
                      Created: {new Date(genre.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteGenre(genre.id)}
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
    </div>
  );
}
