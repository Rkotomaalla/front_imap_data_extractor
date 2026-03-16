import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import axios, { type AxiosRequestConfig, type AxiosError } from "axios";

const publicRoutes = ["/auth/login", "/user/register"];

const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
	(config) => {
		if (!publicRoutes.some((route) => config.url?.includes(route))) {
			const token = userStore.getState().userTokens.access;
			if (token) config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (!response.data) {
			throw new Error(t("sys.api.apiRequestFailed") || "Réponse vide");
		}
		return response.data;
	},
	(error: AxiosError) => {
		const data = error.response?.data as { message?: string } | undefined;
		const msg = data?.message || error.message || "Erreur inconnue";

		if (error.response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}

		// ✅ Retourner l'erreur complète, pas juste le message
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	patch<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PATCH" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
