import { Icon } from "@/components/icon";
import { CardContent } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { rgbAlpha } from "@/utils/theme";
import { Card } from "antd";
import { useEffect, useState } from "react";

export interface StatItem {
	icon: string;
	label: string;
	value: string; // "$3,020" => string (car formaté)
	percent: number;
	color: string; // hex color
	chart: number[]; // sparkline data
}
const init_quickStats = [
	{
		icon: "solar:wallet-outline",
		label: "Mails Traités",
		value: "3.020",
		percent: 30.6,
		color: "#3b82f6", // Bleu
		chart: [12, 18, 14, 16, 12, 10, 14, 18, 16, 14, 12, 10],
	},
	{
		icon: "solar:graph-outline",
		label: "Rapport mail filtrés",
		value: "290",
		percent: 30.6,
		color: "#f59e42", // Orange
		chart: [8, 12, 10, 14, 18, 16, 14, 12, 10, 14, 18, 16],
	},
	{
		icon: "solar:checklist-outline",
		label: "Bot actifs",
		value: "839",
		percent: 0,
		color: "#10b981", // Vert
		chart: [10, 14, 12, 16, 18, 14, 12, 10, 14, 18, 16, 12],
	},
	{
		icon: "solar:download-outline",
		label: "Tâches en cours",
		value: "2.067",
		percent: -30.6,
		color: "#ef4444", // Rouge
		chart: [16, 14, 12, 10, 14, 18, 16, 12, 10, 14, 18, 16],
	},
];

type StatsProps = {
	mailCount: number;
	activeBotCount: number;
	activeTaskCount: number;
	mailReport: number;
};
export default function QuickStats({ mailCount, activeBotCount, activeTaskCount, mailReport }: StatsProps) {
	const [quickStats, setQuickStats] = useState<StatItem[]>(init_quickStats);

	const setStatValue = (value: string, statItem: StatItem) => {
		setQuickStats((prevStats) =>
			prevStats.map((item) =>
				item.label === statItem.label
					? { ...item, value: value } // ← modifie la propriété voulue
					: item,
			),
		);
	};
	useEffect(() => {
		setStatValue(mailCount + " Mails", quickStats[0]);
		setStatValue(mailReport + " %", quickStats[1]);
		setStatValue(activeBotCount + " Bots", quickStats[2]);
		setStatValue(activeTaskCount + " Tâches", quickStats[3]);
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{quickStats.map((stat) => (
				<Card
					key={stat.label}
					className="
            group
            border-none
            overflow-hidden
            transition-all
            duration-300
            ease-out
            hover:shadow-md
            hover:-translate-y-0.5
            rounded-lg
            dark:bg-gray-800/50
          "
					style={{
						background: `linear-gradient(to bottom right, ${rgbAlpha(stat.color, 0.02)}, ${rgbAlpha(stat.color, 0.06)})`,
					}}
				>
					<CardContent className="p-5">
						{/* Icon + Label (amélioré) */}
						<div className="flex items-center gap-3 mb-4">
							<div
								className="p-3 rounded-xl"
								style={{
									background: `linear-gradient(135deg, ${rgbAlpha(stat.color, 0.12)}, ${rgbAlpha(stat.color, 0.2)})`,
									boxShadow: `0 2px 4px -1px ${rgbAlpha(stat.color, 0.1)}`,
								}}
							>
								<Icon icon={stat.icon} size={20} color={stat.color} className="drop-shadow-sm" />
							</div>
							<Text
								variant="body2"
								className="
                  text-gray-500
                  dark:text-gray-300
                  text-sm
                  font-medium
                  group-hover:text-gray-700
                  dark:group-hover:text-gray-100
                  transition-colors
                  duration-200
                "
							>
								{stat.label}
							</Text>
						</div>

						{/* Value + Trend (ajouté) */}
						<div className="flex items-end gap-2">
							<Title
								as="h3"
								className="
                  text-3xl
                  font-bold
                  tracking-tight
                  mb-0.5
                  bg-clip-text
                  text-transparent
                  bg-gradient-to-r
                  from-gray-800
                  dark:from-gray-100
                  to-current
                "
								style={{ color: stat.color }}
							>
								{stat.value}
							</Title>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
