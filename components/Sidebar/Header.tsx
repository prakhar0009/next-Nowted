"use client";

import { Plus, X, Search } from "lucide-react";
import { createNote } from "../../Api/note.api";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Nowted from "@/public/Nowted.svg";
import toast from "react-hot-toast";
import { useNotes } from "../../context/NoteContext";

const Header = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const folderId = params.folderId as string;

  const { renderRecent, fetchSearchNotes, setisSearching } = useNotes();

  const [search, setsearch] = useState(false);
  const searchData = searchParams.get("search") || "";

  useEffect(() => {
    if (searchData.trim() === "") {
      setisSearching(false);
      return;
    }

    setisSearching(true);

    const timer = setTimeout(async () => {
      await fetchSearchNotes(searchData, 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchData, setisSearching, fetchSearchNotes]);

  const updateSearchParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() === " ") {
      params.delete("search");
    } else {
      params.set("search", value);
    }
    router.push(`?${params.toString()}`);
  };

  const handleCloseSearch = () => {
    setsearch(false);
    updateSearchParams("");
    setisSearching(false);
  };

  const handleNewNote = async () => {
    if (!folderId) return toast.error(`Select a folder first!`);

    try {
      const res = await createNote(folderId, "Untitled", "");
      renderRecent();
      router.push(`/${folderId}/${res.id}`);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      else toast.error("Internal Error");
    }
  };

  return (
    <div className="flex flex-col gap-6 px-[8%]">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <img
            src={Nowted}
            alt="Nowted_logo"
            className="dark:invert-0 invert-100"
          />
          <button
            onClick={() => {
              if (search) {
                handleCloseSearch();
              } else {
                setsearch(true);
              }
            }}
            className="text-xl cursor-pointer text-primary hover:text-secondary"
          >
            {search ? <X size={20} /> : <Search />}
          </button>
        </div>
      </div>

      {search ? (
        <input
          autoFocus
          value={searchData}
          placeholder="Search note here"
          onChange={(e) => {
            updateSearchParams(e.target.value);
          }}
          onBlur={() => {
            if (searchData.trim() === "") handleCloseSearch();
          }}
          className="w-full py-3 px-4 border-0 rounded-md bg-secondary-hover text-text outline-none"
          type="text"
        />
      ) : (
        <button
          className="w-full py-3 rounded-md bg-secondary-hover flex items-center justify-center cursor-pointer gap-2"
          onClick={handleNewNote}
        >
          <span className="text-lg">
            <Plus />
          </span>
          <span className="font-medium">New Note</span>
        </button>
      )}
    </div>
  );
};

export default Header;
