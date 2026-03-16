import { Icon } from "@/components/icon";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Text } from "@/ui/typography";
import { Button } from "@/ui/button";
import dayjs from "dayjs";
import { useState } from "react";
import { MailNotification } from "@/types/entity";
import { useNotifications } from "@/routes/hooks/use-web-socket";

// Couleurs prédéfinies pour les cercles des initiales
const colors = ["#3b82f6", "#f59e42", "#10b981", "#ef4444", "#8b5cf6"];

export default function MailNotifs() {
	const [notifications, setNotifications] = useState<MailNotification[]>([]);

	const handleNotification = (notif: MailNotification) => {
		console.log("Nouveau message reçu :", notif);
		setNotifications((prev) => [notif, ...prev]);
	};

	const handleConnected = () => {
		console.log("Connecté au WebSocket !");
	};

	const handleError = (error: Event) => {
		console.error("Erreur WebSocket :", error);
	};

	useNotifications<MailNotification>({
		onNotification: handleNotification,
		onConnected: handleConnected,
		onError: handleError,
		notif_option: 0,
	});

	const formatDate = (dateString: string) => {
		return dayjs(dateString).format("DD MMM YYYY, HH:mm");
	};

	return (
		<Card className="h-full col-span-12 md:col-span-12 xl:col-span-6 border-none shadow-sm bg-white dark:bg-gray-950">
			<CardHeader className="flex flex-row items-center justify-between pb-3">
				<CardTitle className="font-medium text-lg text-gray-900 dark:text-gray-50">Nouveaux Emails</CardTitle>
				{notifications.length > 0 && (
					<Badge className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
						{notifications.length} {notifications.length === 1 ? "nouveau" : "nouveaux"}
					</Badge>
				)}
			</CardHeader>

			<CardContent className="flex overflow-y-auto flex-col gap-2">
				{notifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-6">
						<Icon icon="solar:inbox-line-duotone" size={40} className="text-gray-300 dark:text-gray-600 mb-1" />
						<Text className="text-sm text-gray-500 dark:text-gray-400">Aucun nouvel email</Text>
					</div>
				) : (
					notifications.map((item, index) => {
						const initial = item.from.charAt(0).toUpperCase();
						const colorIndex = index % colors.length;
						const isRead = item.is_read || false;

						return (
							<div
								key={item.mail_id}
								className={`flex items-start gap-2 p-2.5 rounded-lg transition-all duration-150 ${
									!isRead
										? "bg-blue-50/60 dark:bg-gray-800/40 border border-blue-100 dark:border-gray-700"
										: "hover:bg-gray-50 dark:hover:bg-gray-800/30"
								}`}
							>
								{/* Avatar */}
								<Avatar className="h-8 w-8">
									<AvatarFallback
										className="text-white font-medium text-xs"
										style={{ backgroundColor: colors[colorIndex] }}
									>
										{initial}
									</AvatarFallback>
								</Avatar>

								{/* Contenu */}
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-1.5">
											<Text className="font-medium text-sm text-gray-900 dark:text-gray-50 truncate max-w-[120px]">
												{item.from}
											</Text>
											{!isRead && (
												<Badge className="h-3.5 px-1.5 text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
													Nouveau
												</Badge>
											)}
										</div>
										<Text variant="caption" className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
											{formatDate(item.created_at)}
										</Text>
									</div>

									<div className="flex items-center gap-1.5 mt-0.5">
										<Icon
											icon="solar:chat-round-line-linear"
											size={14}
											className="text-gray-400 dark:text-gray-500 flex-shrink-0"
										/>
										<Text variant="caption" className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 truncate">
											{item.mail_subject}
										</Text>
									</div>
								</div>

								{/* Bouton */}
								<Button
									variant="ghost"
									size="sm"
									className="h-7 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/50"
								>
									Voir
								</Button>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
