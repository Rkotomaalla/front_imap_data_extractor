import { Chart, useChart } from "@/components/chart";
import { Text, Title } from "@/ui/typography";
import { Card } from "antd";
import Icon from "@/components/icon/icon";
import { Button } from "@/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
type TasksProps = {
	tasks: number;
	pending_tasks: number;
};
export default function TaskChart({ tasks, pending_tasks }: TasksProps) {
	return (
		<Card className="col-span-12 md:col-span-6 xl:col-span-4 p-5 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
			{/* En-tête minimaliste */}
			<div className="flex items-center justify-between mb-5">
				<Title as="h3" className="text-base font-semibold text-gray-800 dark:text-gray-200">
					Tâches
				</Title>
			</div>

			{/* Stats en grille responsive */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				{/* Total Tasks */}
				<div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
					<Text variant="body2" className="text-gray-500 dark:text-gray-400 text-sm mb-1">
						Total
					</Text>
					<Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
						{tasks}
					</Title>
				</div>

				{/* Pending Tasks */}
				<div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
					<Text variant="body2" className="text-gray-500 dark:text-gray-400 text-sm mb-1">
						En attente
					</Text>
					<Title as="h3" className="text-2xl font-bold text-gray-900 dark:text-white">
						{pending_tasks}
					</Title>
				</div>
			</div>

			<div className="mb-5">
				<Link to="/management/bot/new">
					<Button className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 text-sm font-medium transition-colors">
						<Icon icon="mdi:plus" size={16} className="mr-2" />
						Créer un bot
					</Button>
				</Link>
			</div>

			{/* Graphique minimaliste */}
			<div className="w-full h-16">
				<Chart
					type="line"
					height={60}
					options={useChart({
						chart: {
							sparkline: { enabled: true },
							animations: { enabled: false },
						},
						colors: ["#6b7280"], // Gris neutre
						stroke: {
							curve: "straight",
							width: 1.5,
						},
						grid: { show: false },
						yaxis: { show: false },
						tooltip: { enabled: false },
						xaxis: { labels: { show: false } },
					})}
					series={[
						{
							data: [10, 12, 8, 15, 10, 18, 12],
						},
					]}
				/>
			</div>
		</Card>
	);
}
