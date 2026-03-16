import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Title } from "@/ui/typography";
import { cn } from "@/utils";

// Données d'exemple
const expediteursData = [
	{ email: "alice@example.com", client: "Alice Smith", emailsTraites: 42, pourcentage: 15 },
	{ email: "bob@example.com", client: "Bob Johnson", emailsTraites: 35, pourcentage: 12 },
	{ email: "charlie@example.com", client: "Charlie Brown", emailsTraites: 50, pourcentage: 18 },
	{ email: "diana@example.com", client: "Diana Prince", emailsTraites: 28, pourcentage: 10 },
	{ email: "eve@example.com", client: "Eve Adams", emailsTraites: 30, pourcentage: 11 },
	{ email: "frank@example.com", client: "Frank Miller", emailsTraites: 45, pourcentage: 16 },
];

// Couleurs pour les initiales
const colors = [
	"bg-blue-100 text-blue-600",
	"bg-green-100 text-green-600",
	"bg-purple-100 text-purple-600",
	"bg-orange-100 text-orange-600",
	"bg-red-100 text-red-600",
	"bg-indigo-100 text-indigo-600",
];

export default function Expediteurs() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAll, setShowAll] = useState(false);

	const filteredExpediteurs = expediteursData.filter((item) =>
		item.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const displayedExpediteurs = showAll ? filteredExpediteurs : filteredExpediteurs.slice(0, 3);

	return (
		<Card className="col-span-12 bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle>
					<Title as="h3" className="text-lg font-semibold text-gray-800 dark:text-gray-200">
						Expéditeurs
					</Title>
				</CardTitle>
				<CardAction>
					<Button
						size="sm"
						variant="outline"
						className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
					>
						<Icon icon="mdi:download" className="mr-1" size={16} />
						Exporter
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<div className="mb-4">
					<Input
						type="text"
						placeholder="Rechercher par email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full max-w-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
					/>
				</div>

				<div className="space-y-3">
					{displayedExpediteurs.map((item, index) => {
						const initial = item.client.charAt(0).toUpperCase();
						const colorIndex = index % colors.length;
						return (
							<div
								key={item.email}
								className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
							>
								<div className="flex items-center space-x-3">
									<div
										className={cn(
											"w-8 h-8 rounded-full flex items-center justify-center font-medium",
											colors[colorIndex],
										)}
									>
										{initial}
									</div>
									<div>
										<p className="font-medium text-gray-800 dark:text-gray-200">{item.client}</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">{item.email}</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.emailsTraites} emails</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">{item.pourcentage}%</p>
									<Button
										size="sm"
										variant="ghost"
										className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
									>
										Voir détail
									</Button>
								</div>
							</div>
						);
					})}
				</div>

				{filteredExpediteurs.length > 3 && (
					<div className="mt-4 flex justify-center">
						<Button
							size="sm"
							variant="outline"
							onClick={() => setShowAll(!showAll)}
							className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
						>
							{showAll ? "Voir moins" : "Voir tout"}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
