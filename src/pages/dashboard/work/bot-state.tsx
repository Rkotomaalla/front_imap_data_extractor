import { Chart, useChart } from "@/components/chart";
import { CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Text, Title } from "@/ui/typography";
import { Card } from "antd";
import Icon from "@/components/icon/icon";
import { CountBot } from "@/types/entity";
import { useEffect, useState } from "react";

type BotsStateProps = {
	botCount: CountBot;
	total: number;
};
interface stats {
	status: number;
	label: string;
	value: number;
	color: string;
	icon: string;
}
interface dashBoard {
	sessionDevices: stats[];
}

export default function BotState({ botCount, total }: BotsStateProps) {
	const [dashboardData, setDashboardData] = useState<dashBoard>({
		sessionDevices: [
			{ status: 1, label: "En cours", value: 42.1, color: "#00ff33ce", icon: "material-symbols:play-arrow-rounded" },
			{ status: 2, label: "Arrêté", value: 33.7, color: "#ff0000a8", icon: "material-symbols:stop-rounded" },
			{ status: 0, label: "En pause", value: 19.6, color: "#dde416", icon: "material-symbols:pause-outline" },
			{ status: 3, label: "Supprimé", value: 19.6, color: "#858585ad", icon: "material-symbols:delete-outline" },
		],
	});
	const sessionDevices = dashboardData.sessionDevices;

	const deviceChartOptions = useChart({
		labels: sessionDevices.map((d) => d.label),
		colors: sessionDevices.map((d) => d.color),
		stroke: {
			show: false,
		},
		legend: {
			show: false,
		},
		tooltip: {
			fillSeriesColor: false,
		},
		plotOptions: {
			pie: {
				donut: {
					size: "80%",
				},
			},
		},
	});

	const setValue = (status: number, value: number) => {
		setDashboardData((prev) => ({
			...prev,
			sessionDevices: prev.sessionDevices.map((device) =>
				device.status === status
					? { ...device, value: value } // ← nouvelle valeur
					: device,
			),
		}));
	};
	const setValues = () => {
		botCount.data?.forEach((bc) => {
			setValue(bc.status, bc.total);
		});
	};
	useEffect(() => {
		setValues();
	}, []);

	useEffect(() => {
		setValues();
	}, [botCount]);

	return (
		<Card className="col-span-12 md:col-span-6 xl:col-span-4">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>
					<Title as="h3" className="text-lg">
						Activité des bots
					</Title>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col items-center gap-2">
					{/* Chart */}
					<div className="w-full max-w-[180px]">
						<Chart type="donut" height={320} options={deviceChartOptions} series={sessionDevices.map((d) => d.value)} />
					</div>

					{/* Legend */}
					<div className="flex justify-center gap-4 mt-2">
						{sessionDevices.map((d) => (
							<div key={d.label} className="flex flex-col items-center gap-1">
								<Icon icon={d.icon} size={20} color={d.color} />

								<Text variant="body2">{d.label}</Text>

								<Text variant="body2" className="font-bold">
									{d.value}
								</Text>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
