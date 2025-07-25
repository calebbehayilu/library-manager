const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jwt_token");
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    // Debug logging
    console.log("Making request to:", url);
    console.log("Token exists:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 20) + "...");
    }

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log("Request headers:", config.headers);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        console.error(`HTTP ${response.status} for ${endpoint}`);
        console.error(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(
    username: string,
    password: string
  ): Promise<{ access_token: string }> {
    return this.request<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  // Books endpoints
  async getBooks(): Promise<any[]> {
    return this.request<any[]>("/api/books");
  }

  async getBook(id: string): Promise<any> {
    return this.request<any>(`/api/books/${id}`);
  }

  async createBook(book: any): Promise<any> {
    return this.request<any>("/api/books", {
      method: "POST",
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: string, book: any): Promise<any> {
    return this.request<any>(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: string): Promise<void> {
    return this.request<void>(`/api/books/${id}`, {
      method: "DELETE",
    });
  }

  // Members endpoints
  async getMembers(): Promise<any[]> {
    return this.request<any[]>("/api/members");
  }

  async getMember(id: string): Promise<any> {
    return this.request<any>(`/api/members/${id}`);
  }

  async createMember(member: any): Promise<any> {
    return this.request<any>("/api/members", {
      method: "POST",
      body: JSON.stringify(member),
    });
  }

  async updateMember(id: string, member: any): Promise<any> {
    return this.request<any>(`/api/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(member),
    });
  }

  async deleteMember(id: string): Promise<void> {
    return this.request<void>(`/api/members/${id}`, {
      method: "DELETE",
    });
  }

  // Genres endpoints
  async getGenres(): Promise<any[]> {
    return this.request<any[]>("/api/genres");
  }

  async getGenre(id: string): Promise<any> {
    return this.request<any>(`/api/genres/${id}`);
  }

  async createGenre(genre: any): Promise<any> {
    return this.request<any>("/api/genres", {
      method: "POST",
      body: JSON.stringify(genre),
    });
  }

  async updateGenre(id: string, genre: any): Promise<any> {
    return this.request<any>(`/api/genres/${id}`, {
      method: "PUT",
      body: JSON.stringify(genre),
    });
  }

  async deleteGenre(id: string): Promise<void> {
    return this.request<void>(`/api/genres/${id}`, {
      method: "DELETE",
    });
  }

  // Borrowings endpoints
  async getBorrowings(): Promise<any[]> {
    return this.request<any[]>("/api/borrowings");
  }

  async getBorrowing(id: string): Promise<any> {
    return this.request<any>(`/api/borrowings/${id}`);
  }

  async createBorrowing(borrowing: any): Promise<any> {
    return this.request<any>("/api/borrowings", {
      method: "POST",
      body: JSON.stringify(borrowing),
    });
  }

  async updateBorrowing(id: string, borrowing: any): Promise<any> {
    return this.request<any>(`/api/borrowings/${id}`, {
      method: "PUT",
      body: JSON.stringify(borrowing),
    });
  }

  async deleteBorrowing(id: string): Promise<void> {
    return this.request<void>(`/api/borrowings/${id}`, {
      method: "DELETE",
    });
  }

  // Users endpoints
  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/api/users");
  }

  async getUser(id: string): Promise<any> {
    return this.request<any>(`/api/users/${id}`);
  }

  async createUser(user: any): Promise<any> {
    return this.request<any>("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, user: any): Promise<unknown> {
    return this.request<unknown>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/users/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
