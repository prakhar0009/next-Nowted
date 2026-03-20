"use client";
import { FolderIcon, FolderOpen, FolderPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { putFolders, DeleteFolder, createFolder } from "@/Api/folder.api";
import { useNotes } from "@/context/NoteContext";
import ConfirmDialog from "@/components/UI/ConfirmDialog";
import type { Folder } from "@/types/type";

const NewFolder = () => {
  const { folders, renderFolders, reloadNote } = useNotes();
  const [fName, setfName] = useState<string>("");
  const [isFolder, setisFolder] = useState(false);
  // const { folderId, noteId } = useParams();
  const [editFolder, seteditFolder] = useState<string | null>(null);
  const [tempFName, settempFName] = useState("");
  const [confirmFolder, setconfirmFolder] = useState<string | null>(null);

  const params = useParams();
  const folderId = params.folderId as string | undefined;
  const noteId = params.noteId as string | undefined;

  const router = useRouter();
  const pathname = usePathname();

  const handleNewFolder = async () => {
    if (fName.trim() === "") {
      toast.error(`Folder name is required`);
      return;
    }
    try {
      await createFolder(fName);
      toast.success(`Folder created`);
      renderFolders();
      setfName("");
      setisFolder(false);
      router.push(`/`);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const handleRenameFolder = async (id: string) => {
    if (tempFName.trim() === "") {
      seteditFolder(null);
      toast.error(`Folder name is required`);
      return;
    }
    try {
      await putFolders(id, tempFName);
      toast.success(`Folder renamed`);
      seteditFolder(null);
      await renderFolders();
      if (noteId) reloadNote(noteId);
      router.push(`/${id}/folder/${encodeURIComponent(tempFName)}`);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      seteditFolder(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-[8%]">
        <h3 className="text-primary text-xs font-semibold tracking-wider">
          Folders
        </h3>
        <button
          onClick={() => setisFolder(!isFolder)}
          className="text-primary hover:text-text "
        >
          <FolderPlus />
        </button>
      </div>

      {isFolder && (
        <div className="flex gap-2 mb-3 px-[8%]">
          <input
            type="text"
            value={fName}
            onChange={(e) => setfName(e.target.value)}
            placeholder="Folder name"
            className="bg-middle-active text-text text-sm rounded px-2 py-1 w-full outline-none"
          />
          <button
            onClick={handleNewFolder}
            className="text-xs text-text bg-middle px-2 py-1 rounded hover:bg-middle-active"
          >
            Add
          </button>
        </div>
      )}
      <ul className="flex flex-col gap-3 min-h-0 overflow-y-auto hide-scrollbar">
        {folders?.map((curr: Folder) => {
          const path = `/${curr.id}/folder/${curr.name}`;
          const isActive = pathname === path;
          return (
            <Link
              className={`flex items-center gap-5 text-sm cursor-pointer rounded px-1 py-2 group duration-200 pl-[8%]
                
              ${
                isActive || editFolder === curr.id
                  ? "bg-secondary-hover text-secondary"
                  : "text-primary hover:bg-primary-hover hover:text-secondary"
              }`}
              key={curr.id}
              href={path}
              onDoubleClick={(e) => {
                e.preventDefault();
                seteditFolder(curr.id);
                settempFName(curr.name);
              }}
            >
              <span>
                {String(folderId) === curr.id ? <FolderOpen /> : <FolderIcon />}
              </span>
              {editFolder === curr.id ? (
                <input
                  autoFocus
                  onChange={(e) => settempFName(e.target.value)}
                  onBlur={() => handleRenameFolder(curr.id)}
                  className="bg-middle-active text-text rounded px-1 outline-none w-full"
                  value={tempFName}
                  onClick={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameFolder(curr.id);
                    if (e.key === "Escape") seteditFolder(null);
                  }}
                  type="text"
                />
              ) : (
                <span className="truncate w-full">{curr.name}</span>
              )}
              <div className="group flex justify-end mr-3 items-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setconfirmFolder(curr.id);
                  }}
                  className="text-primary hover:text-red-400 transition-all ml-2 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </Link>
          );
        })}
      </ul>

      {confirmFolder && (
        <ConfirmDialog
          message="This will permanently delete the folder and all its notes."
          onCancel={() => setconfirmFolder(null)}
          onConfirm={async () => {
            try {
              await DeleteFolder(confirmFolder);
              toast.success("Folder is Deleted");
              setconfirmFolder(null);
              renderFolders();
              router.push(`/`);
            } catch {
              toast.error("Can't delete Folder");
              setconfirmFolder(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default NewFolder;
