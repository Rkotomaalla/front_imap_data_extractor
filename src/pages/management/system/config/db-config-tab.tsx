import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import { Text } from "@/ui/typography";
import { Separator } from "@/ui/separator";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Database, Globe, Key, User, FileText, ShieldCheck } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import DbConfigConfirmModal from "./confirm-db-modal";
import { DbConfig } from "@/types/entity";
import configService from "@/api/services/configService";
import axios, { AxiosError } from "axios";

export type DbConfigType = {
	name: string;
	host: string;
	port: number;
	db_name: string;
	username: string;
	password: string;
	change_reason: string;
};

type ConfigItemProps = {
	icon: ReactNode;
	label: string;
	value: string | number;
	isTextarea?: boolean;
};

export default function DatabaseConfigTab() {
	// const currentConfig = {

	// };

	const [currentConfig, setCurrentConfig] = useState<DbConfig>();

	const form = useForm<DbConfigType>({
		defaultValues: currentConfig,
	});

	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const handleSubmit = (data: DbConfig) => {
		setShowConfirmModal(true);
	};

	const handleConfirm = async () => {
		const data = form.getValues();
		try {
			console.log("Configuration confirmée :", data);
			await configService.saveConfig(data);
			setShowConfirmModal(false);
			loadCurrentConfig();
			toast.success("Configuration mise à jour avec succès !");
		} catch (error: unknown) {
			let message = "Une erreur est survenue";

			if (axios.isAxiosError(error)) {
				// Vérifier si la réponse contient un champ "error" (comme dans votre cas)
				if (error.response?.data && typeof error.response.data === "object" && "error" in error.response.data) {
					message = error.response.data.error;
				}
				// Sinon, utiliser le message par défaut d'Axios
				else if (error.message) {
					message = error.message;
				}
			}
			// Pour les erreurs non-Axios (ex: réseau)
			else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message); // Affiche le message extrait
		}
	};

	const handleCancel = () => {
		setShowConfirmModal(false);
	};

	const loadCurrentConfig = async () => {
		try {
			const res = await configService.getActiveConfig();
			setCurrentConfig(res);
		} catch (error: any) {
			console.error(error);
			toast.error(error.response?.data?.message || error.message || "Erreur serveur");
		}
	};

	useEffect(() => {
		loadCurrentConfig();
	}, []);

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 max-w-5xl mx-auto p-4">
				{/* Configuration actuelle */}
				<Card className="border border-border rounded-lg shadow-sm">
					<CardHeader className="pb-4">
						<Text variant="subTitle1" className="font-medium">
							Configuration Actuelle
						</Text>
					</CardHeader>
					<Separator />
					<CardContent className="pt-5 space-y-4">
						<ConfigItem
							icon={<FileText className="h-4 w-4" />}
							label="Nom"
							value={currentConfig?.name ?? "Non défini"}
						/>
						<ConfigItem icon={<Globe className="h-4 w-4" />} label="Hôte" value={currentConfig?.host ?? "Non défini"} />
						<ConfigItem
							icon={<Database className="h-4 w-4" />}
							label="Port"
							value={currentConfig?.port ?? "Non défini"}
						/>
						<ConfigItem
							icon={<Database className="h-4 w-4" />}
							label="Base de données"
							value={currentConfig?.db_name ?? "Non défini"}
						/>
						<ConfigItem
							icon={<User className="h-4 w-4" />}
							label="Utilisateur"
							value={currentConfig?.username || "Non défini"}
						/>
						<ConfigItem
							icon={<Key className="h-4 w-4" />}
							label="Mot de passe"
							value={currentConfig?.password ? "••••••••" : "Non défini"}
						/>
						<ConfigItem
							icon={<FileText className="h-4 w-4" />}
							label="Raison"
							value={currentConfig?.change_reason ?? "Non défini"}
							isTextarea
						/>
					</CardContent>
				</Card>

				{/* Formulaire de modification */}
				<Card className="border border-border rounded-lg shadow-sm">
					<CardHeader className="pb-4">
						<Text variant="subTitle1" className="font-medium">
							Modifier la Configuration
						</Text>
					</CardHeader>
					<Separator />
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<CardContent className="pt-5 space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<FormField
										control={form.control}
										name="name"
										rules={{ required: "le nom est obligatoire" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<FileText className="h-4 w-4 text-muted-foreground" /> Nom
												</FormLabel>
												<FormControl>
													<Input placeholder="Nom de la configuration" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="host"
										rules={{ required: "l'haute est obligatoire" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<Globe className="h-4 w-4 text-muted-foreground" /> Hôte
												</FormLabel>
												<FormControl>
													<Input placeholder="localhost" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="port"
										rules={{ required: "le port est obligatoire" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<Database className="h-4 w-4 text-muted-foreground" /> Port
												</FormLabel>
												<FormControl>
													<Input type="number" placeholder="27017" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="db_name"
										rules={{ required: "le nom de la base est obligatoire" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<Database className="h-4 w-4 text-muted-foreground" /> Base de données
												</FormLabel>
												<FormControl>
													<Input placeholder="imap_data_extractor_db" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<User className="h-4 w-4 text-muted-foreground" /> Utilisateur
												</FormLabel>
												<FormControl>
													<Input placeholder="Utilisateur" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<Key className="h-4 w-4 text-muted-foreground" /> Mot de passe
												</FormLabel>
												<FormControl>
													<Input type="password" placeholder="••••••••" className="h-9" {...field} />
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="change_reason"
									rules={{ required: "la description est obligatoire est obligatoire" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<FileText className="h-4 w-4 text-muted-foreground" /> Raison du changement
											</FormLabel>
											<FormControl>
												<Textarea placeholder="Décrivez la raison..." className="min-h-[100px]" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
							<Separator />
							<CardFooter className="flex justify-end py-4">
								<Button type="submit" className="gap-2">
									<ShieldCheck className="h-4 w-4" /> Enregistrer
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</div>

			{/* Modal de confirmation */}
			<DbConfigConfirmModal
				show={showConfirmModal}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				formData={form.getValues()}
			/>
		</>
	);
}

// Composant réutilisable pour afficher les items de configuration
function ConfigItem({ icon, label, value, isTextarea = false }: ConfigItemProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent/30 shrink-0">{icon}</div>
			<div className="space-y-0.5">
				<Text variant="body2" className="text-muted-foreground text-xs">
					{label}
				</Text>
				<Text variant="body1" className={isTextarea ? "max-w-xs" : "truncate"}>
					{value}
				</Text>
			</div>
		</div>
	);
}
