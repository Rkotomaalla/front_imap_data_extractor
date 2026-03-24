import { DirectoryList } from "@/types/entity";
import apiClient from "../apiClient";

export enum DirectoryApi {
  Directory = "/directory",
  mainDir = "/main",
}

const getMainDirList = () => apiClient.get<DirectoryList>(
  {
    url: `${DirectoryApi.Directory}${DirectoryApi.mainDir}`
  }
);
const getChildDirList = (dir_id :  number) => apiClient.get<DirectoryList>(
  {url: `${DirectoryApi.Directory}/${dir_id}/child`}
);

export default{
  getMainDirList,
  getChildDirList
}
