import apiClient from "../apiClient";
import type { Bot, BotList, CountBot } from "#/entity";

export enum BotApi {
	Bot = "/bots/",
	CountBot = "/bots/count",
	countOwnBot = "/bots/count_own",
}

const saveBot = (bot: Bot) => apiClient.post<Bot>({ url: BotApi.Bot, data: bot });
const updateBot = (bot_id: number, bot: Bot) => apiClient.patch<Bot>({ url: `${BotApi.Bot}${bot_id}/`, data: bot });
const getList = (params?: Record<string, any>) =>
	apiClient.get<BotList>({
		url: BotApi.Bot,
		params, // Axios construit automatiquement la query string
	});

const findById = (bot_id: number) => apiClient.get<Bot>({ url: `${BotApi.Bot}${bot_id}/` });
const countBot = () => apiClient.get<CountBot>({ url: `${BotApi.CountBot}` });

// active/ stop  / delete / pause bot
const activeBot = (bot_id: number) => apiClient.post<any>({ url: `${BotApi.Bot}${bot_id}/activate/` });
const stopBot = (bot_id: number) => apiClient.post<any>({ url: `${BotApi.Bot}${bot_id}/stop/` });
const deleteBot = (bot_id: number) => apiClient.delete<any>({ url: `${BotApi.Bot}${bot_id}/delete_bot/` });

const getOwnCount = () => apiClient.get<CountBot>({ url: `${BotApi.countOwnBot}` });
export default {
	saveBot,
	getList,
	countBot,
	activeBot,
	stopBot,
	deleteBot,
	getOwnCount,
	findById,
	updateBot,
};
