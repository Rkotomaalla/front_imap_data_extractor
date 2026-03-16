import apiClient from "../apiClient";

const gmailAuth = () => apiClient.get<any>({ url: "/gmail/start/" });

export default {
	gmailAuth,
};
