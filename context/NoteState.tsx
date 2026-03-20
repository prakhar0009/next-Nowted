"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getArchiveNotes,
  getFavoriteNotes,
  getDeletedNotes,
  getRecentNotes,
  getNoteById,
  getNotesByFolder,
  getSearchNotes,
} from "../Api/note.api";
import { getFolders } from "../Api/folder.api";
import type { Folder, Note } from "../types/type";
import { NoteContext } from "./NoteContext";

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setnotes] = useState<Note[]>([]);
  const [folders, setfolders] = useState<Folder[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [currentNote, setcurrentNote] = useState<Note | null>(null);
  const [isSearching, setisSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const LIMIT = 10;

  const fetchNotes = useCallback(
    async (
      folderId?: string,
      type?: string,
      targetPage?: number,
      limit?: number,
    ): Promise<Note[]> => {
      const activePage = targetPage || 1;
      const activeLimit = limit || LIMIT;
      try {
        let res: Note[] = [];
        if (type === "trash") res = await getDeletedNotes(activePage);
        else if (type === "favorite") res = await getFavoriteNotes(activePage);
        else if (type === "archive") res = await getArchiveNotes(activePage);
        else if (folderId)
          res = await getNotesByFolder(folderId, activePage, activeLimit);
        return res || [];
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
        return [];
      }
    },
    [],
  );

  const renderNotes = useCallback(
    async (folderId?: string, type?: string) => {
      const res = await fetchNotes(folderId, type);
      setnotes(res);
    },
    [fetchNotes],
  );

  const fetchSearchNotes = useCallback(
    async (query: string, page: number = 1) => {
      try {
        const res = await getSearchNotes(query, page, 10);
        if (page === 1) {
          setnotes(res);
        } else {
          setnotes((prev: Note[]) => [...prev, ...res]);
        }
        setSearchHasMore(res.length === 10);
        setSearchPage(page);
        setSearchQuery(query);
      } catch (e) {
        if (e instanceof Error) console.error(e.message);
      }
    },
    [],
  );

  const renderFolders = useCallback(async () => {
    try {
      const data = await getFolders();
      setfolders(data || []);
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
    }
  }, []);

  const renderRecent = useCallback(async () => {
    try {
      const data = await getRecentNotes();
      setRecentNotes(data || []);
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
    }
  }, []);

  const reloadNote = useCallback(async (noteId: string) => {
    try {
      const res = await getNoteById(noteId);
      setcurrentNote(res);
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [fData, rData] = await Promise.all([
          getFolders(),
          getRecentNotes(),
        ]);
        if (isMounted) {
          setfolders(fData || []);
          setRecentNotes(rData || []);
        }
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <NoteContext.Provider
      value={{
        notes,
        setnotes,
        folders,
        setfolders,
        recentNotes,
        currentNote,
        setcurrentNote,
        isSearching,
        setisSearching,
        renderNotes,
        fetchNotes,
        renderFolders,
        renderRecent,
        reloadNote,
        searchQuery,
        searchPage,
        searchHasMore,
        fetchSearchNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
