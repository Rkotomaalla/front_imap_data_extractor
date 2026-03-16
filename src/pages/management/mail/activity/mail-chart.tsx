import { Chart, useChart } from "@/components/chart";
import { Card, CardContent } from "@/ui/card";
import { Text } from "@/ui/typography";
import { Icon } from "@/components/icon";

// Données réalistes pour les emails reçus cette semaine et la semaine dernière
const weeklyEmails = {
	currentWeek: {
		series: [
			{
				name: "Emails reçus",
				data: [120, 95, 140, 160, 180, 80, 60], // Données pour chaque jour de la semaine
			},
		],
		categories: ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."],
		total: 835, // Total des emails reçus cette semaine
		average: 119, // Moyenne quotidienne (arrondie)
		percentChange: +12.5, // Variation par rapport à la semaine dernière (%)
	},
	lastWeek: {
		total: 742, // Total des emails reçus la semaine dernière
	},
};

export default function MailChart() {
	const chartOptions = useChart({
		xaxis: {
			categories: weeklyEmails.currentWeek.categories,
			labels: {
				style: {
					colors: "#9CA3AF", // Gris clair pour les labels
					fontSize: "12px",
				},
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: "#9CA3AF",
					fontSize: "12px",
				},
				formatter: (val) => `${val}`,
			},
			min: 0,
			max: 200, // Ajuste selon tes données réelles
		},
		chart: {
			toolbar: {
				show: false,
			},
			dropShadow: {
				enabled: true,
				top: 3,
				left: 2,
				blur: 3,
				opacity: 0.1,
			},
		},
		grid: {
			show: true,
			borderColor: "#E5E7EB",
			strokeDashArray: 3,
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				columnWidth: "60%",
				colors: {
					ranges: [
						{
							from: 0,
							to: 200,
							color: "#3B82F6", // Bleu moderne
						},
					],
				},
			},
		},
		stroke: {
			width: 2,
			colors: ["#3B82F6"],
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		tooltip: {
			enabled: true,
			theme: "dark",
			custom: ({ series, seriesIndex, dataPointIndex, w }) => {
				const day = weeklyEmails.currentWeek.categories[dataPointIndex];
				const emails = series[seriesIndex][dataPointIndex];
				return `
          <div class="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${day}</div>
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">${emails} emails</div>
          </div>
        `;
			},
		},
	});

	return (
		<Card className="lg:col-span-2 bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800">
			<CardContent className="p-6">
				{/* En-tête avec titre et indicateurs clés */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div>
						<Text variant="body2" className="font-semibold text-gray-800 dark:text-gray-200">
							Emails reçus cette semaine
						</Text>
						<Text variant="caption" className="text-gray-500 dark:text-gray-400">
							{weeklyEmails.currentWeek.total} emails • Moyenne : {weeklyEmails.currentWeek.average}/jour
						</Text>
					</div>
					<div className="flex items-center gap-2">
						<span
							className={`flex items-center gap-1 text-sm font-medium ${weeklyEmails.currentWeek.percentChange > 0 ? "text-green-500" : "text-red-500"}`}
						>
							{weeklyEmails.currentWeek.percentChange > 0 ? (
								<Icon icon="mdi:arrow-up" size={16} />
							) : (
								<Icon icon="mdi:arrow-down" size={16} />
							)}
							{Math.abs(weeklyEmails.currentWeek.percentChange)}% vs semaine dernière
						</span>
						<span className="text-sm text-gray-500 dark:text-gray-400">(vs {weeklyEmails.lastWeek.total} emails)</span>
					</div>
				</div>

				{/* Graphique */}
				<div className="flex justify-center">
					<Chart type="bar" height={260} options={chartOptions} series={weeklyEmails.currentWeek.series} />
				</div>

				{/* Légende ou note optionnelle */}
				<div className="mt-4 flex justify-center">
					<Text variant="caption" className="text-gray-500 dark:text-gray-400">
						Données mises à jour aujourd’hui
					</Text>
				</div>
			</CardContent>
		</Card>
	);
}
