import StartIcon from "@/assets/icons/my-icons/power.png";
import StopIcon from "@/assets/icons/my-icons/arreter.png";
import PlayIcon from "@/assets/icons/my-icons/play.png";
import PauseIcon from "@/assets/icons/my-icons/pause.png";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import Table, { type ColumnsType } from "antd/es/table";
import type { Bot, BotList } from "#/entity";
import { useEffect, useState } from "react";
import botService from "@/api/services/botService";
import { Input, Select, DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { useRouter } from "@/routes/hooks";
import BotService from "../bot-service";
import { Link } from "react-router-dom";

export default function BotPage() {
	// Dans votre composant
	const router = useRouter();

	const [botList, setBotList] = useState<BotList>();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [filters, setFilters] = useState({
		search: "",
		status: undefined as number | undefined,
		dateSort: undefined as 0 | 1 | undefined,
		date: undefined as string | undefined,
	});

	// Charger les bots avec filtres
	useEffect(() => {
		const loadBotList = async () => {
			try {
				const queryParams: any = { page };
				if (pageSize) queryParams.page_size = pageSize;
				if (filters.search) queryParams.name = filters.search;
				if (filters.status) queryParams.status = filters.status;
				if (filters.dateSort !== undefined) queryParams.dateSort = filters.dateSort;
				if (filters.date) queryParams.date = filters.date;

				const bl = await botService.getList(queryParams);

				console.log(bl);
				setBotList(bl);
			} catch (error) {
				console.error(error);
			}
		};
		loadBotList();
	}, [page, filters, pageSize]);

	// Charger les bots avec filtres
	const loadBotList = async (page: number) => {
		try {
			setPage(1);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		loadBotList(1);
	}, [filters]);

	const reload = () => {
		loadBotList(page);
	};

	// Colonnes table
	const columns: ColumnsType<Bot> = [
		{
			title: "ID Bot",
			dataIndex: "bot_id",
			key: "bot_id",
			render: (botId: string) => <Link to={`/management/bot/detail/${botId}`}>{botId}</Link>,
		},
		{
			title: "Nom",
			dataIndex: "name",
		},

		{
			title: "Date de création",
			dataIndex: "created_date",
			render: (value: string) =>
				value
					? new Intl.DateTimeFormat("fr-FR", {
							weekday: "long",
							day: "numeric",
							month: "long",
							year: "numeric",
							timeZone: "Indian/Antananarivo",
						}).format(new Date(value))
					: "-",
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			render: (status) => (
				<Badge
					variant={
						status === 0
							? "warning" // Pause → jaune
							: status === 1
								? "success" // Actif → vert
								: status === 2
									? "error" // Arrêté → rouge
									: "default" // Supprimé → gris clair
					}
				>
					{status === 0 ? "Pause" : status === 1 ? "Actif" : status === 2 ? "Arrêté" : "Supprimé"}
				</Badge>
			),
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => {
				const status = record.status;

				// Supprimé → rien afficher
				if (status === 3) return null;

				return (
					<div className="flex w-full justify-center text-gray gap-2">
						{/* STOP → affiché pour Pause ou Actif */}
						{(status === 0 || status === 1) && (
							<Button
								variant="ghost"
								size="icon"
								onClick={async () => {
									const bot_id = record.bot_id;
									if (!bot_id) return;

									await BotService().stop_bot(bot_id);
									reload();
								}}
							>
								<img src={StopIcon} alt="stop" width={25} />
							</Button>
						)}

						{/* Si Actif → afficher Pause */}
						{status === 1 && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									console.log("Pause bot", record.bot_id);
								}}
							>
								<img src={PauseIcon} alt="pause" width={25} />
							</Button>
						)}

						{/* Si Pause → afficher Play */}
						{status === 0 && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									console.log("Play bot", record.bot_id);
								}}
							>
								<img src={PlayIcon} alt="play" />
							</Button>
						)}

						{/* Si Arrêté → afficher Start */}
						{status === 2 && (
							<Button
								variant="ghost"
								size="icon"
								onClick={async () => {
									const bot_id = record.bot_id;
									if (!bot_id) return; // si undefined ou null → ne fait rien

									await BotService().activate_bot(bot_id);
									reload();
								}}
							>
								<img src={StartIcon} alt="start" />
							</Button>
						)}
					</div>
				);
			},
		},
	];

	// Options status
	const statusOptions = [
		{ label: "Pause", value: 0 },
		{ label: "Actif", value: 1 },
		{ label: "Arrêté", value: 2 },
		{ label: "Supprimé", value: 3 },
	];

	// Options tri date
	const dateSortOptions = [
		{ label: "Croissant", value: 0 },
		{ label: "Décroissant", value: 1 },
	];

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
					<div>Liste des bots</div>
					<Button onClick={() => router.push("/management/bot/new")}>Créer un bot</Button>
				</div>
				{/* Filtres */}
				<Space className="mt-2 flex-wrap" size="middle">
					<Input
						placeholder="Recherche par nom"
						value={filters.search}
						onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
						style={{ width: 200 }}
					/>
					<Select
						placeholder="Status"
						style={{ width: 150 }}
						allowClear
						options={statusOptions}
						value={filters.status}
						onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
					/>
					<Select
						placeholder="Tri date"
						style={{ width: 150 }}
						allowClear
						options={dateSortOptions}
						value={filters.dateSort}
						onChange={(value) => setFilters((prev) => ({ ...prev, dateSort: value as 0 | 1 }))}
					/>
					<DatePicker
						placeholder="Filtrer par date"
						value={filters.date ? dayjs(filters.date) : null}
						onChange={(date) =>
							setFilters((prev) => ({
								...prev,
								date: date ? date.format("YYYY-MM-DD") : undefined,
							}))
						}
					/>
				</Space>
			</CardHeader>
			<CardContent>
				<Table
					rowKey="bot_id"
					size="middle"
					scroll={{ x: "max-content" }}
					columns={columns}
					dataSource={botList?.results}
					pagination={{
						current: page,
						pageSize: pageSize,
						total: botList?.count,
						showSizeChanger: true, // ✅ Affiche le sélecteur
						onChange: (newPage, newPageSize) => {
							setPage(newPage);
							if (newPageSize !== pageSize) {
								setPageSize(newPageSize);
								setPage(1); // Reset à la page 1
							}
						},
					}}
				/>
			</CardContent>
		</Card>
	);
}
