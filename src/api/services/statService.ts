import { BotRanking } from "@/types/entity";
import apiClient from "../apiClient";

export enum StatApi {
	Stat = "/stats",
	MailCount = "/email/all",
	ActiveTask = "/task/active",
	AllTask = "/task",
	RawEmail = "/raw_email/all",
	BotRanking = "/bot/ranking",
}

const getMailCount = (params?: Record<string, any>) =>
	apiClient.get<any>({
		url: StatApi.Stat + StatApi.MailCount,
		params, // Axios construit automatiquement la query string
	});

const getRawEmail = (params?: Record<string, any>) =>
	apiClient.get<any>({
		url: StatApi.Stat + StatApi.RawEmail,
		params, // Axios construit automatiquement la query string
	});

const getAllTask = (params?: Record<string, any>) =>
	apiClient.get<number>({
		url: StatApi.Stat + StatApi.AllTask,
		params, // Axios construit automatiquement la query string
	});

const getActiveTask = (params?: Record<string, any>) =>
	apiClient.get<any>({
		url: StatApi.Stat + StatApi.ActiveTask,
		params, // Axios construit automatiquement la query string
	});

const getBotRanking = (params?: Record<string, any>) =>
	apiClient.get<BotRanking[]>({
		url: StatApi.Stat + StatApi.BotRanking,
		params, // Axios construit automatiquement la query string
	});

export default {
	getMailCount,
	getRawEmail,
	getActiveTask,
	getBotRanking,
	getAllTask,
};
