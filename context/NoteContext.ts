"use client";
import { createContext, useContext } from "react";
import type { NoteContextType } from "../types/type";

export const NoteContext = createContext<NoteContextType | null>(null);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error("Not in Provider");
  return context;
};
