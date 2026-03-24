import apiClient from "../apiClient";
import type { OperatorsByFieldId, FieldsList } from "#/entity";

export enum FilterApi {
	GetFields = "/fields/",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
}

const getAllFields = () => apiClient.get<FieldsList>({ url: FilterApi.GetFields });
const getFieldOperators = (fieldId: number) =>
	apiClient.get<OperatorsByFieldId>({
		url: `${FilterApi.GetFields}${fieldId}/operators`, // interpolation correcte
	});

export default {
	getAllFields,
	getFieldOperators,
};
