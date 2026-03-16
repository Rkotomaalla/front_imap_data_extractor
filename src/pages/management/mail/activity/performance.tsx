import { Icon } from "@/components/icon";
import { CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Card } from "antd";

const attachments = {
	total: 128,
	byType: [
		{ type: "PDF", count: 45, size: "120 Mo" },
		{ type: "Images", count: 32, size: "85 Mo" },
		{ type: "Documents", count: 28, size: "45 Mo" },
		{ type: "Autres", count: 23, size: "30 Mo" },
	],
};

export default function Performance() {
	return (
		<Card className="col-span-1 border-none">
			<CardHeader>
				<CardTitle>Pièces jointes</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex justify-between">
						<p className="text-sm text-gray-500">Total</p>
						<p className="font-medium">{attachments.total} fichiers</p>
					</div>
					{attachments.byType.map((item) => (
						<div key={item.type} className="flex justify-between">
							<div className="flex items-center gap-2">
								<Icon icon={`mdi:file-${item.type.toLowerCase()}`} size={16} />
								<p className="text-sm">{item.type}</p>
							</div>
							<div className="text-right">
								<p className="font-medium">{item.count}</p>
								<p className="text-xs text-gray-500">{item.size}</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
