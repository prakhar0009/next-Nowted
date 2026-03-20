export type Note = {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  preview: string;
  folder: { name: string };
};

export type Folder = {
  id: string;
  name: string;
  createdAt: string;
};

export interface NoteContextType {
  notes: Note[];
  setnotes: React.Dispatch<React.SetStateAction<Note[]>>;
  folders: Folder[];
  setfolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  recentNotes: Note[];
  currentNote: Note | null;
  setcurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
  isSearching: boolean;
  setisSearching: React.Dispatch<React.SetStateAction<boolean>>;
  renderNotes: (folderId?: string, type?: string) => Promise<void>;
  fetchNotes: (
    folderId?: string,
    type?: string,
    targetPage?: number,
    limit?: number,
  ) => Promise<Note[]>;
  renderFolders: () => Promise<void>;
  renderRecent: () => Promise<void>;
  reloadNote: (noteId: string) => Promise<void>;
  searchQuery: string;
  searchPage: number;
  searchHasMore: boolean;
  fetchSearchNotes: (query: string, page: number) => Promise<void>;
}
