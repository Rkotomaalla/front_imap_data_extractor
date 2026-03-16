import { Icon } from "@/components/icon";
import { themeVars } from "@/theme/theme.css";
import { Bot } from "@/types/entity";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Text } from "@/ui/typography";
import { faker } from "@faker-js/faker";
import { Timeline } from "antd";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface AboutItem {
	icon: React.ReactNode;
	label: string;
	val: React.ReactNode; // Permet d'inclure des éléments JSX comme les badges
}

interface AboutCardProps {
	name: string;
	description: string;
	created_date: string | null;
	status: number | undefined;
	botId: string;
}

const statusValue: Record<number, string> = {
	0: "pause",
	1: "en marche",
	2: "stop",
	3: "supprimé",
};

// Fonction pour générer le badge de statut
const getStatusBadge = (status: number | undefined) => {
	if (status === undefined) {
		return <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">inconnu</span>;
	}

	const statusText = statusValue[status];
	let badgeClass = "";

	switch (status) {
		case 0:
			badgeClass = "bg-yellow-100 text-yellow-800"; // Jaune pour "pause"
			break;
		case 1:
			badgeClass = "bg-green-100 text-green-800"; // Vert pour "en marche"
			break;
		case 2:
			badgeClass = "bg-red-100 text-red-800"; // Rouge pour "stop"
			break;
		case 3:
			badgeClass = "bg-gray-100 text-gray-600"; // Gris pour "supprimé"
			break;
		default:
			badgeClass = "bg-gray-100 text-gray-600";
	}

	return <span className={`px-2 py-1 text-xs rounded-full ${badgeClass}`}>{statusText}</span>;
};

type ProfilTabProps = {
	bot: Bot;
};
export default function ProfileTab({ bot }: ProfilTabProps) {
	const { name, description, status, created_date } = bot;

	const AboutItems: AboutItem[] = [
		{
			icon: <Icon icon="mdi:robot" size={18} />,
			label: "Nom du bot",
			val: name,
		},
		{
			icon: <Icon icon="mdi:text-box-outline" size={18} />,
			label: "Description",
			val: description,
		},
		{
			icon: <Icon icon="mdi:calendar-clock" size={18} />,
			label: "Date de création",
			val: created_date
				? new Date(created_date).toLocaleDateString("fr-FR", {
						weekday: "long", // "lundi"
						day: "numeric", // "10"
						month: "long", // "juin"
						year: "numeric", // "2024"
					})
				: "Non définie",
		},
		{
			icon: <Icon icon="mdi:list-status" size={18} />,
			label: "Statut",
			val: getStatusBadge(status),
		},
	];

	const ConnectionsItems = [
		{
			avatar: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
			connections: `${faker.number.int(100)} Connections`,
			connected: faker.datatype.boolean(),
		},

		{
			avatar: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
			connections: `${faker.number.int(100)} Connections`,
			connected: faker.datatype.boolean(),
		},

		{
			avatar: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
			connections: `${faker.number.int(100)} Connections`,
			connected: faker.datatype.boolean(),
		},

		{
			avatar: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
			connections: `${faker.number.int(100)} Connections`,
			connected: faker.datatype.boolean(),
		},

		{
			avatar: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
			connections: `${faker.number.int(100)} Connections`,
			connected: faker.datatype.boolean(),
		},
	];

	const TeamItems = [
		{
			avatar: <Icon icon="devicon:react" size={36} />,
			name: "React Developers",
			members: `${faker.number.int(100)} Members`,
			tag: <Badge variant="warning">Developer</Badge>,
		},
		{
			avatar: <Icon icon="devicon:figma" size={36} />,
			name: "UI Designer",
			members: `${faker.number.int()} Members`,
			tag: <Badge variant="info">Designer</Badge>,
		},
		{
			avatar: <Icon icon="logos:jest" size={36} />,
			name: "Test Team",
			members: `${faker.number.int(100)} Members`,
			tag: <Badge variant="success">Test</Badge>,
		},
		{
			avatar: <Icon icon="logos:nestjs" size={36} />,
			name: "Nest.js Developers",
			members: `${faker.number.int(100)} Members`,
			tag: <Badge variant="warning">Developer</Badge>,
		},

		{
			avatar: <Icon icon="logos:twitter" size={36} />,
			name: "Digital Marketing",
			members: `${faker.number.int(100)} Members`,
			tag: <Badge variant="info">Marketing</Badge>,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="col-span-1 relative shadow-sm">
					<CardHeader>
						<CardTitle>À propos</CardTitle>
						<CardDescription>Caractéristiques du bot</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-4">
							{AboutItems.map((item) => (
								<div className="flex items-center" key={item.label}>
									<div className="mr-2">{item.icon}</div>
									<div className="mr-2 font-medium min-w-[120px]">{item.label}:</div>
									<div>{item.val}</div>
								</div>
							))}
						</div>
					</CardContent>

					{/* Bouton "Modifier" */}
					{status !== 3 && (
						<div className="p-4 border-t border-gray-100">
							<Link to={`/management/bot/update/${bot.bot_id}`} className="w-full block">
								<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
									<Pencil size={16} />
									Modifier
								</Button>
							</Link>
						</div>
					)}
				</Card>

				<Card className="col-span-1 md:col-span-2">
					<CardHeader>
						<CardTitle>Activity Timeline</CardTitle>
					</CardHeader>
					<CardContent>
						<Timeline
							className="mt-4! w-full"
							items={[
								{
									color: themeVars.colors.palette.error.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>8 Invoices have been paid</Text>
												<div className="opacity-50">Wednesday</div>
											</div>
											<Text variant="caption" color="secondary">
												Invoices have been paid to the company.
											</Text>

											<div className="mt-2 flex items-center gap-2">
												<Icon icon="local:file-pdf" size={30} />
												<span className="font-medium opacity-60">invoice.pdf</span>
											</div>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.primary.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Create a new project for client 😎</Text>
												<div className="opacity-50">April, 18</div>
											</div>
											<Text variant="caption" color="secondary">
												Invoices have been paid to the company.
											</Text>
											<div className="mt-2 flex items-center gap-2">
												<img alt="" src={faker.image.avatarGitHub()} className="h-8 w-8 rounded-full" />
												<span className="font-medium opacity-60">{faker.person.fullName()} (client)</span>
											</div>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.info.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Order #37745 from September</Text>
												<div className="opacity-50">January, 10</div>
											</div>
											<Text variant="caption" color="secondary">
												Invoices have been paid to the company.
											</Text>
										</div>
									),
								},
								{
									color: themeVars.colors.palette.warning.default,
									children: (
										<div className="flex flex-col">
											<div className="flex items-center justify-between">
												<Text>Public Meeting</Text>
												<div className="opacity-50">September, 30</div>
											</div>
										</div>
									),
								},
							]}
						/>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1">
					<Card>
						<CardHeader>
							<CardTitle className="w-full flex items-center justify-between">
								<span>Connections</span>
								<Button variant="ghost" size="icon">
									<Icon icon="fontisto:more-v-a" />
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex w-full flex-col gap-4">
								{ConnectionsItems.map((item) => (
									<div className="flex" key={item.name}>
										<img alt="" src={item.avatar} className="h-10 w-10 flex-none rounded-full" />
										<div className="ml-4 flex flex-1 flex-col">
											<span className="font-semibold">{item.name}</span>
											<span className="mt-1 text-xs opacity-50">{item.connections}</span>
										</div>
										<div
											className="flex h-8 w-8 flex-none items-center justify-center rounded"
											style={{
												backgroundColor: item.connected ? themeVars.colors.palette.primary.default : "transparent",
												border: item.connected ? "" : `1px solid ${themeVars.colors.palette.primary.default}`,
											}}
										>
											<Icon
												icon="tdesign:user"
												color={item.connected ? "#fff" : themeVars.colors.palette.primary.default}
												size={20}
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
				<div className="flex-1">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Teams</CardTitle>
								<Button variant="ghost" size="icon">
									<Icon icon="fontisto:more-v-a" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex w-full flex-col gap-4">
								{TeamItems.map((item) => (
									<div className="flex" key={item.name}>
										{item.avatar}
										<div className="ml-4 flex flex-1 flex-col">
											<span className="font-semibold">{item.name}</span>
											<span className="mt-1 text-xs opacity-50">{item.members}</span>
										</div>
										<div className="h-6">{item.tag}</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
