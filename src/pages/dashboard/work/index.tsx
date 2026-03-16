import QuickStats from "./quickstats";
import Notifications from "./notifications";
import MailNotifs from "./mail-notif";
import BotsGrid from "./bot-grid";
import BotState from "./bot-state";
import TopBot from "./top-bot";
import TaskChart from "./task-chart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Bot, BotRanking, CountBot } from "@/types/entity";
import botService from "@/api/services/botService";
import statService from "@/api/services/statService";

// Déplace cette interface dans `@/types/entity` si possible
interface Count {
	count: number;
}

export default function Workbench() {
	// États pour les statistiques rapides

	const [mailCount, setMailCount] = useState<number>(0);
	const [activeBotCount, setActiveBotCount] = useState<number>(0);
	const [activeTaskCount, setActiveTaskCount] = useState<number>(0);
	const [mailReport, setMailReport] = useState<number>(0);

	// États pour les bots

	const [activeBots, setActiveBots] = useState<Bot[]>([]);

	const [countBot, setCountBot] = useState<CountBot>();
	const [total, setTotal] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Classement des bots
	const [rankingData, setRankingData] = useState<BotRanking[]>([]);

	// Stat des tasks
	const [tasks, setTasks] = useState<number>(0);

	const load_bot_ranking = async () => {
		try {
			const data: BotRanking[] = await statService.getBotRanking();
			setRankingData(data);
		} catch (error: any) {
			console.error(error);
			toast.error(`Erreur lors du chargement des bots : ${error.message || "Une erreur est survenue"}`);
		}
	};

	// cahrger les tache
	const load_task_data = async () => {
		try {
			const task_count = await statService.getAllTask();
			setTasks(task_count);
		} catch (error: any) {
			console.error(error);
			toast.error(`Erreur lors du chargement des bots : ${error.message || "Une erreur est survenue"}`);
		}
	};
	// Charge le nombre de bots
	const load_bot_count = async () => {
		try {
			const data = await botService.getOwnCount();
			setCountBot(data);
			const t = data?.data?.reduce((sum, item) => sum + item.total, 0) ?? 0;

			const act_bot = data?.data?.find((item) => item.status === 1);
			const ab: number = act_bot?.total ?? 415;
			setActiveBotCount(ab);

			setTotal(t);
		} catch (error: any) {
			console.error(error);
			toast.error(`Erreur lors du chargement des bots : ${error.message || "Une erreur est survenue"}`);
		}
	};

	// Charge les statistiques rapides
	const load_quisk_stat_value = async () => {
		try {
			const mc: Count = await statService.getMailCount();
			// const act_bot = (countBot?.data?.find((item) => item.status === 1));
			// const ab: number = act_bot?.total ?? 0;
			const at: Count = await statService.getActiveTask();
			const raw_email_count: Count = await statService.getRawEmail();

			// Évite la division par zéro
			const mr = raw_email_count.count > 0 ? ((mc.count / raw_email_count.count) * 100).toFixed(1) : 0;

			setMailCount(mc.count);
			setActiveTaskCount(at.count);
			setMailReport(Number(mr));
		} catch (error: any) {
			console.error(error);
			toast.error(`Erreur lors du chargement des statistiques : ${error.message || "Une erreur est survenue"}`);
		}
	};

	const getActiveBots = async () => {
		try {
			console.log("====================================\nTENA ETO EEE====================================\n");
			const queryParams: any = { status: 1 };
			queryParams.page_size = 100;
			const data = await botService.getList(queryParams);
			if (data) {
				setActiveBots(data.results);
				console.log(data.results);
				console.log("====================================\nTENA ETO EEE====================================\n");
			}
		} catch (error: any) {
			console.error("Erreur lors de la récupération des bots:", error);
			toast.error(`Erreur lors de la récupération des bots: ${error.message}`);
		}
	};
	// Recharge les données
	const reloadCount = () => {
		setIsLoading(true);
		Promise.all([load_bot_count(), load_quisk_stat_value(), getActiveBots()]).finally(() => setIsLoading(false));
	};
	// Déclenché quand countBot change
	useEffect(() => {
		reloadCount();
		load_bot_ranking();
		load_task_data();
	}, []);
	useEffect(() => {
		load_bot_ranking();
		load_task_data();
	}, [countBot]);
	return (
		<div className="space-y-6 max-w-[1400px] mx-auto w-full p-4">
			{/* Section 1: QuickStats */}
			<div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/30 p-3 transition-colors duration-200">
				{isLoading ? (
					<div className="flex justify-center items-center h-24">
						<p>Chargement des statistiques...</p>
					</div>
				) : (
					<QuickStats
						mailCount={mailCount}
						activeBotCount={activeBotCount}
						activeTaskCount={activeTaskCount}
						mailReport={mailReport}
					/>
				)}
			</div>

			{/* Section 2: Notifications + MailNotifs */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md h-[500px]">
					<Notifications bots={activeBots} />
				</div>
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md h-[500px]">
					<MailNotifs />
				</div>
			</div>

			{/* Section 3: BotsGrid */}
			<div className="rounded-xl bg-gray-50/50 dark:bg-gray-800/30 p-3 border-l-4 border-blue-200/30 dark:border-blue-600/30 transition-colors duration-200">
				{isLoading ? (
					<div className="flex justify-center items-center h-24">
						<p>Chargement des bots...</p>
					</div>
				) : countBot ? (
					<BotsGrid botCount={countBot} reloadCountBot={reloadCount} />
				) : null}
			</div>

			{/* Section 4: BotState / TopBot / TaskChart */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md border-t-2 border-green-200/30 dark:border-green-600/30">
					{isLoading ? (
						<div className="flex justify-center items-center h-24">
							<p>Chargement...</p>
						</div>
					) : countBot ? (
						<BotState botCount={countBot} total={total} />
					) : null}
				</div>
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md border-t-2 border-purple-200/30 dark:border-purple-600/30">
					<TopBot rankingData={rankingData} />
				</div>
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md border-t-2 border-orange-200/30 dark:border-orange-600/30">
					<TaskChart tasks={tasks} pending_tasks={activeTaskCount} />
				</div>
			</div>
		</div>
	);
}
