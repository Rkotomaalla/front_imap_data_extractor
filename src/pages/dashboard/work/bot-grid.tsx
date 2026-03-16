import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Text } from "@/ui/typography";
import botService from "@/api/services/botService";
import { useEffect, useState } from "react";
import { Bot, CountBot, StatusCount } from "@/types/entity";
import { toast } from "sonner";
import BotService from "@/pages/management/bot/bot-service";
import { useNavigate } from "react-router-dom";

type BotsGridProps = {
	botCount: CountBot;
	reloadCountBot: () => void;
};

// ordre de mon status
const statusOrder: number[] = [1, 0, 2, 3];

// Couleurs pour les statuts avec typage
const statusColors: Record<number, { label: string; bg: string; text: string; border: string }> = {
	1: { label: "En cours", bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500" },
	0: { label: "En cours", bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500" },
	2: { label: "Arrêté", bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500" },
};

export default function BotsGrid({ botCount, reloadCountBot }: BotsGridProps) {
	const navigate = useNavigate();

	const [bots, setBots] = useState<Bot[]>([]);

	const getListBot = async (botCounts: StatusCount[]) => {
		let remaining = 4; // Utilisez une variable locale pour suivre le nombre restant
		let allBots: Bot[] = []; // Tableau temporaire pour accumuler les résultats

		for (const bc of botCounts) {
			if (remaining <= 0) break;

			const queryParams: any = { status: bc.status };
			queryParams.page_size = Math.min(remaining, bc.total);

			try {
				const data = await botService.getList(queryParams);
				if (data && data.results) {
					allBots = [...allBots, ...data.results]; // Fusionne les tableaux
					remaining -= data.results.length;
				}
			} catch (error) {
				console.error("Erreur lors de la récupération des bots:", error);
			}
		}

		setBots(allBots); // Met à jour le state une seule fois à la fin
	};

	const updateBotStatus = (bot_id: number, newStatus: number) => {
		setBots((prevBots) => prevBots.map((bot) => (bot.bot_id === bot_id ? { ...bot, status: newStatus } : bot)));
	};

	// Dans votre composant, ajoutez :
	const loadBots = async () => {
		try {
			if (!botCount?.data) return;
			const sortedBot = [...botCount.data].sort(
				(a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
			);
			await getListBot(sortedBot);
		} catch (error: any) {
			console.error(error);
			toast.error(`Erreur lors du chargement des bots : ${error.message || "Une erreur est survenue"}`);
		}
	};

	const activeBot = async (bot_id: number) => {
		await BotService().activate_bot(bot_id);
		updateBotStatus(bot_id, 1);
		reloadCountBot();
	};

	const stopBot = async (bot_id: number) => {
		await BotService().stop_bot(bot_id);
		updateBotStatus(bot_id, 2);
		reloadCountBot();
	};
	useEffect(() => {
		loadBots();
	}, []);
	useEffect(() => {
		loadBots();
	}, [botCount]);

	return (
		<div className="flex flex-col gap-6">
			{/* Grille des bots */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{bots.map((bot) => {
					// Gestion du statut par défaut (2 = "Arrêté")

					const status: number = bot.status !== undefined ? bot.status : 2;

					// Formatage de la date de création
					const createdDate = bot.created_date
						? new Date(bot.created_date).toLocaleDateString("fr-FR", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})
						: "Date inconnue";

					// Extraction des dates du filtre (si disponible)

					return (
						<Card
							key={bot.bot_id}
							className={`flex flex-col p-5 transition-all duration-200 hover:shadow-lg
                ${statusColors[status].border} border-l-4 bg-white dark:bg-gray-800`}
						>
							{/* Header: Nom + ID */}
							<div className="flex items-start justify-between">
								<div>
									<Text className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">{bot.name}</Text>
									<Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"></Text>
								</div>
								<Badge
									variant="secondary"
									className={`px-2.5 py-1 text-xs font-medium ${statusColors[status].text} ${statusColors[status].bg}`}
								>
									{statusColors[status].label}
								</Badge>
							</div>

							{/* Stats principales: Dates du filtre */}
							<div className="mt-4">
								<div className="flex items-end gap-1">
									<Text className="text-2xl font-bold text-gray-900 dark:text-white">Bot {bot.bot_id}</Text>
									<Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
										→ {bot.filter.rules.length} règle(s)
									</Text>
								</div>
								<Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{bot.filter.name}</Text>
							</div>

							{/* Métadonnées: Créateur et date de création */}
							<div className="mt-4 flex flex-col gap-1.5">
								<div className="flex items-center gap-2">
									<Icon icon="material-symbols:person-outline" size={16} className="text-gray-400" />
									<Text variant="caption" className="text-gray-600 dark:text-gray-300">
										Créé par l'utilisateur <strong className="font-medium">{bot.assigned_user_id}</strong>
									</Text>
								</div>
								<div className="flex items-center gap-2">
									<Icon icon="material-symbols:calendar-month-outline" size={16} className="text-gray-400" />
									<Text variant="caption" className="text-gray-600 dark:text-gray-300">
										Créé le {createdDate}
									</Text>
								</div>
							</div>

							{/* Statut avec indicateur visuel */}
							<div className="mt-3 flex items-center gap-2">
								<div className={`w-2.5 h-2.5 rounded-full ${statusColors[status].bg.replace("/10", "")}`} />
								<Text variant="caption" className={`font-medium ${statusColors[status].text}`}>
									{statusColors[status].label}
								</Text>
							</div>

							{/* Boutons d'action */}
							<div className="mt-5 flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
                    hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									Voir détail
								</Button>

								{status === 1 ? (
									<>
										<Button
											variant="outline"
											size="sm"
											className="text-yellow-600 border-yellow-200 dark:border-yellow-700
                        hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
											aria-label="Mettre en pause"
										>
											<Icon icon="material-symbols:pause-rounded" size={18} />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="text-red-600 border-red-200 dark:border-red-700
                        hover:bg-red-50 dark:hover:bg-red-900/30"
											aria-label="Arrêter"
											onClick={() => {
												if (!bot.bot_id) return;
												stopBot(bot.bot_id);
											}}
										>
											<Icon icon="material-symbols:stop-rounded" size={18} />
										</Button>
									</>
								) : (
									<>
										<Button
											variant="outline"
											size="sm"
											className="text-green-600 border-green-200 dark:border-green-700
                        hover:bg-green-50 dark:hover:bg-green-900/30"
											aria-label="Démarrer"
											onClick={() => {
												if (!bot.bot_id) return;
												activeBot(bot.bot_id);
											}}
										>
											<Icon icon="material-symbols:play-arrow-rounded" size={18} />
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="text-red-600 border-red-200 dark:border-red-700
                        hover:bg-red-50 dark:hover:bg-red-900/30"
											aria-label="Supprimer"
										>
											<Icon icon="material-symbols:delete-outline" size={18} />
										</Button>
									</>
								)}
							</div>
						</Card>
					);
				})}
			</div>

			{/* Bouton "Voir tous les bots" */}
			<div className="flex justify-center">
				<Button className="w-48 gap-1.5" size="sm" variant="default" onClick={() => navigate("/management/bot/list")}>
					Voir tous les bots
					<Icon icon="material-symbols:arrow-forward-ios-rounded" size={16} />
				</Button>
			</div>
		</div>
	);
}
