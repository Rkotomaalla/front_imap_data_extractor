import apiClient from "../apiClient";
import type { Department } from "#/entity";

export enum FilterApi {
	baseUrl = "/departments/",
}

const getAllDepartments = () => apiClient.get<Department[]>({ url: FilterApi.baseUrl });

export default {
	getAllDepartments,
};
