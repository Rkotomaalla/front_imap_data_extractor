import { CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Text } from "@/ui/typography";
import { Card } from "antd";
import { faker } from "@faker-js/faker";
// Ajoute cette ligne pour l'icône (si tu utilises lucide-react ou une autre bibliothèque)
import { Download } from "lucide-react"; // Exemple avec lucide-react
import { Bot, ConsoleNotification } from "@/types/entity";
import { useEffect, useState } from "react";
import useNotification from "antd/es/notification/useNotification";
import { useNotifications } from "@/routes/hooks/use-web-socket";

type BotList = {
	bots: Bot[];
};

type Notif = {
	date: string;
	type: string;
	message: string;
};

type botNotifs = {
	bot_id: number;
	bot_name: string;
	notifications: Notif[];
};

const types: Record<number, string> = {
	0: "INFO",
	1: "SUCCESS",
	2: "ERROR",
	3: "WARNING",
};

// Générer des données factices pour les bots et leurs logs
const generateFakeBots = (count: number) => {
	return Array.from({ length: count }, (_, i) => ({
		id: `bot_${i + 1}`,
		name: faker.company.name(),
		logs: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => ({
			type: faker.helpers.arrayElement(["INFO", "WARNING", "ERROR", "SUCCESS"]),
			date: faker.date.recent().toISOString().split("T")[0],
			message: faker.lorem.sentence(),
		})),
	}));
};

const fakeBots = generateFakeBots(3);

// Fonction pour gérer l'export (à adapter selon tes besoins)
const handleExport = (botId: string) => {
	console.log(`Export des logs pour le bot ${botId}`);
	// Logique d'export ici (ex: téléchargement de fichier)
};

export default function Notifications({ bots }: BotList) {
	// ==============================ETO ZAO AHO RAHARIVA FA TENA ENJANNA BE
	// RECUPERATION DES DETAILS DU MAILs
	const [botNotifs, setBotNotifs] = useState<botNotifs[]>([]);

	const handleNotification = (notif: ConsoleNotification) => {
		const n = botNotifs.find((bn) => bn.bot_id === notif.bot_id);
		if (!n) return;
		const new_n: Notif = {
			date: notif.notified_at,
			type: types[notif.type],
			message: notif.message,
		};
		n.notifications.push(new_n);
	};

	const handleConnected = () => {
		console.log("Connecté au WebSocket !");
	};

	const handleError = (error: Event) => {
		console.error("Erreur WebSocket :", error);
	};

	useNotifications<ConsoleNotification>({
		onNotification: handleNotification,
		onConnected: handleConnected,
		onError: handleError,
		notif_option: 1,
	});

	const setNotifs = (bots: Bot[]) => {
		const validBotNotifs = botNotifs.filter((bn) => bots.some((bot) => bot.bot_id === bn.bot_id));
		const validBots = bots.filter((bot) => validBotNotifs.some((bn) => bn.bot_id !== bot.bot_id));
		validBots.forEach((vb) => {
			let bot_id = vb.bot_id;
			let bot_name = vb.name;
			let notification: Notif[] = [];

			if (bot_id && bot_name && notification) {
				const new_bn: botNotifs = {
					bot_id: bot_id,
					bot_name: bot_name,
					notifications: notification,
				};
				validBotNotifs.push(new_bn);
			}
		});
		setBotNotifs(validBotNotifs);
	};

	useEffect(() => {
		setNotifs(bots);
	}, [bots]);

	return (
		<Card
			className="h-full border-none shadow-sm bg-white dark:bg-gray-950"
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
				<CardTitle className="font-medium text-lg text-gray-900 dark:text-gray-50">Consoles des Bots</CardTitle>
			</CardHeader>

			<CardContent className=" flex-1 overflow-y-auto p-2 space-y-3" style={{ maxHeight: "calc(500px - 100px)" }}>
				{botNotifs.map((bot) => {
					return (
						<div
							key={bot.bot_id}
							className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
						>
							{/* En-tête du bot avec bouton Exporter */}
							<div className="flex items-center justify-between mb-2">
								<Text className="font-medium text-sm text-gray-900 dark:text-gray-50">
									{bot.bot_name} <span className="text-xs text-gray-500 dark:text-gray-400">({bot.bot_id})</span>
								</Text>
								{/* NOUVEAU : Bouton Exporter */}
								<button
									onClick={() => {}}
									className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
								>
									<Download className="h-3.5 w-3.5" />
									<span>Exporter</span>
								</button>
							</div>

							{/* Console noire pour les logs (inchangé) */}
							<div
								className="bg-black rounded-md p-2 text-white font-mono text-xs"
								style={{
									height: "100px",
									overflowY: "auto",
								}}
							>
								{bot.notifications.map((log, index) => (
									<div
										key={index}
										className={`py-0.5 ${
											log.type === "ERROR"
												? "text-red-400"
												: log.type === "WARNING"
													? "text-yellow-400"
													: log.type === "SUCCESS"
														? "text-green-400"
														: "text-gray-300"
										}`}
									>
										<span className="mr-2">{log.type}</span>
										<span className="mr-2 text-gray-500">{log.date}</span>
										<span>| {log.message}</span>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
