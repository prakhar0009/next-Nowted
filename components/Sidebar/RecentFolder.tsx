"use client";
import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotes } from "@/context/NoteContext";
import type { Note } from "@/types/type";

type RecentNotesContextType = {
  recentNotes: Note[];
};

const RecentFolder = () => {
  const { recentNotes } = useNotes() as RecentNotesContextType;
  const pathname: string = usePathname();

  return (
    <div className="w-full">
      <h3 className="text-primary text-xs font-semibold tracking-wider mb-4 px-[8%]">
        Recents
      </h3>
      <div className="flex flex-col gap-1">
        {recentNotes?.map((curr: Note) => {
          const path = `/${curr.folderId}/${curr.id}`;
          const isActive: boolean = pathname === path;

          return (
            <Link
              href={path}
              key={curr.id}
              className={`py-2.5 rounded-md flex items-center pl-[8%] gap-5 cursor-pointer duration-200
              ${
                isActive
                  ? "bg-secondary-hover text-secondary shadow-sm"
                  : "text-primary hover:bg-primary-hover hover:text-secondary"
              }`}
            >
              <span>
                <FileText />
              </span>
              <span className="text-sm w-65 truncate font-medium">
                {curr.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentFolder;
