import toast from "react-hot-toast";
import api from "./api";
import type { Folder } from "@/types/type";

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const res = await api.get("/folders");
    return res.data.folders || [];
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
    else toast.error("Internal Error");
    return [];
  }
};

export const createFolder = async (name: string) => {
  try {
    const res = await api.post("/folders", { name });
    return res.data;
  } catch (e) {
    if (e instanceof Error) return e.message;
    else toast.error("Internal Error");
  }
};

export const putFolders = async (folderId: string, folderName: string) => {
  try {
    const res = await api.patch(`/folders/${folderId}`, { name: folderName });
    return res.data;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
    else toast.error("Internal Error");
  }
};

export const DeleteFolder = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/folders/${id}`);
    return true;
  } catch {
    return false;
  }
};
