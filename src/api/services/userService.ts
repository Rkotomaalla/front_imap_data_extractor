import apiClient from "../apiClient";

import type { UserData, UserList, UserTokens, UserUpdate } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserTokens & { user: UserData };

export enum UserApi {
	SignIn = "/user/login/",
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/users/",
	SimpleAuth = "/users/auth_user",
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (uid_number: number) => apiClient.get<UserData>({ url: `${UserApi.User}${uid_number}` });
const simpleAuth = (data: SignInReq) => apiClient.post<any>({ url: UserApi.SimpleAuth, data });

const getList = (params?: Record<string, any>) =>
	apiClient.get<UserList>({
		url: UserApi.User,
		params, // Axios construit automatiquement la query string
	});

const saveUser = (user: UserData) => apiClient.post<any>({ url: UserApi.User, data: user });
const updateUser = (user: UserUpdate, uid_number: number) =>
	apiClient.put<any>({ url: `${UserApi.User}${uid_number}`, data: user });

const deleteUser = (user_id: number, params?: Record<string, any>) =>
	apiClient.delete<any>({
		url: `${UserApi.User}${user_id}`,
		params, // Axios construit automatiquement la query string
	});

export default {
	signin,
	signup,
	findById,
	logout,
	saveUser,
	updateUser,
	getList,
	simpleAuth,
	deleteUser,
};
