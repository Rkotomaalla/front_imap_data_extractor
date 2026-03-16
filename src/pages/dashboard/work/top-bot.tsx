import { CardAction, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Title } from "@/ui/typography";
import { Card } from "antd";
import Icon from "@/components/icon/icon";
import { Button } from "@/ui/button";
import { BotRanking } from "@/types/entity";

type RankProps = {
	rankingData: BotRanking[];
};

export default function TopBot({ rankingData }: RankProps) {
	return (
		<Card
			className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
			bordered={false}
		>
			{/* En-tête avec effet de flou et ombre légère */}
			<CardHeader className="flex flex-row items-center justify-between pb-3 bg-gray-50 dark:bg-gray-700/50 px-4 pt-4">
				<CardTitle>
					<Title as="h3" className="text-lg font-semibold text-gray-800 dark:text-gray-200">
						Classement des bots
					</Title>
				</CardTitle>
				<CardAction>
					<Button
						size="sm"
						variant="outline"
						className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors"
					>
						<Icon icon="mdi:download" className="mr-1 text-gray-600 dark:text-gray-300" />
						Exporter
					</Button>
				</CardAction>
			</CardHeader>

			{/* Contenu avec défilement optimisé et ombres */}
			<CardContent className="px-0 pb-2">
				<div className="overflow-x-auto">
					<table className="w-full text-sm divide-y divide-gray-100 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-700/30 sticky top-0 z-10">
							<tr>
								<th scope="col" className="py-3 pl-4 pr-2 text-left font-medium text-gray-500 dark:text-gray-300">
									ID
								</th>
								<th scope="col" className="py-3 px-2 text-left font-medium text-gray-500 dark:text-gray-300">
									Nom du bot
								</th>
								<th scope="col" className="py-3 pl-2 pr-4 text-right font-medium text-gray-500 dark:text-gray-300">
									Mails
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-700">
							{rankingData.length > 0 ? (
								rankingData.map((row, index) => (
									<tr
										key={row.bot_id}
										className={`
                      transition-all duration-150 ease-in-out
                      ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-700/30"}
                      hover:bg-gray-50 dark:hover:bg-gray-700/50
                    `}
									>
										<td className="py-3 pl-4 pr-2 font-medium text-gray-900 dark:text-gray-100">{row.bot_id}</td>
										<td className="py-3 px-2 text-gray-700 dark:text-gray-300">
											<div className="flex items-center gap-2">
												<span className="truncate max-w-[180px]">{row.name || "N/A"}</span>
											</div>
										</td>
										<td className="py-3 pl-2 pr-4 text-right font-medium text-gray-900 dark:text-gray-100">
											<div className="flex items-center justify-end gap-1">
												<span>{row.count || 0}</span>
												{/* Exemple d'indicateur de tendance (optionnel) */}
												{row.count > 0 && <Icon icon="mdi:trending-up" className="text-green-500 text-xs" />}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={3} className="py-8 text-center">
										<div className="flex flex-col items-center justify-center gap-2">
											<Icon icon="mdi:robot-off" className="text-gray-300 dark:text-gray-500 text-2xl" />
											<p className="text-sm text-gray-400 dark:text-gray-500">Aucun bot actif trouvé.</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
