import { DbConfig } from "@/types/entity";
import apiClient from "../apiClient";

export enum ConfigApi {
	config = "/configuration/db/",
}

const saveConfig = (config: DbConfig) => apiClient.post<any>({ url: ConfigApi.config, data: config });
const getActiveConfig = () => apiClient.get<DbConfig>({ url: ConfigApi.config });

export default {
	saveConfig,
	getActiveConfig,
};
