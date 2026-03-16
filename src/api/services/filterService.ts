import apiClient from "../apiClient";
import type { OperatorsByFieldId, FieldsList } from "#/entity";

export enum FilterApi {
	GetFieds = "/fields/",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
}

const getAllFields = () => apiClient.get<FieldsList>({ url: FilterApi.GetFieds });
const getFieldOperators = (fieldId: number) =>
	apiClient.get<OperatorsByFieldId>({
		url: `${FilterApi.GetFieds}${fieldId}/operators`, // interpolation correcte
	});

export default {
	getAllFields,
	getFieldOperators,
};
