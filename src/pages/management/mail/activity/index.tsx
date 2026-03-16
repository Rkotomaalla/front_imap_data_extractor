import MailNotifs from "@/pages/dashboard/work/mail-notif";
import Expeditor from "./expeditors";
import MailChart from "./mail-chart";
import Performance from "./performance";

const categoryData = {
	series: [35, 25, 20, 15, 5], // Pourcentages
	labels: ["Support", "Commercial", "Technique", "RH", "Autres"],
	colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"], // Couleurs pour chaque catégorie
};
export default function Workbench() {
	return (
		<div className="space-y-6 max-w-[1400px] mx-auto w-full p-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md">
					<Expeditor />
				</div>
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md">
					<MailNotifs />
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md">
					<MailChart />
				</div>
				<div className="rounded-xl bg-white/70 dark:bg-gray-800/40 p-3 shadow-sm transition-all duration-200 hover:shadow-md">
					<Performance />
				</div>
			</div>
		</div>
	);
}
