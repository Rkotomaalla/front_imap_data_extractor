import UserDeleteModal, { UserDeleteModalProps } from "./user-detele-modal";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox";
import { AlertCircle, Info, ShieldAlert } from "lucide-react";
import { ScrollArea } from "@/ui/scroll-area";
import { toast } from "sonner";
import userService from "@/api/services/userService";
import botService from "@/api/services/botService";

export type UserDeleteMotifModalProps = {
	user_id: number;
	show: boolean;
	onCancel: VoidFunction;
	onConfirm: VoidFunction;
	onDelete: VoidFunction;
};

export default function UserDeleteMotifModal({
	user_id,
	show,
	onCancel,
	onConfirm,
	onDelete,
}: UserDeleteMotifModalProps) {
	// États
	const [motif, setMotif] = useState<string>("");
	const [customMotif, setCustomMotif] = useState<string>("");
	const [acceptDeleteBot, setAcceptDeleteBot] = useState<boolean>(false);

	// État pour la modale de confirmation finale
	const [userDeleteProps, setUserDeleteProps] = useState<UserDeleteModalProps>({
		user_id: user_id,
		motif: "",
		show: false,
		onConfirm: () => {
			setUserDeleteProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => setUserDeleteProps((prev) => ({ ...prev, show: false })),
	});

	// Motifs prédéfinis avec descriptions étendues
	const deletionReasons = [
		{
			id: "depart",
			label: "Départ de l'utilisateur de l'entreprise",
			description: "L'utilisateur a quitté l'organisation et ses comptes doivent être désactivés.",
		},
		{
			id: "violation",
			label: "Violation des politiques de sécurité",
			description: "L'utilisateur a enfreint les règles de sécurité ou d'utilisation des systèmes.",
		},
		{
			id: "inactivite",
			label: "Compte inactif (plus de 6 mois)",
			description: "Le compte n'a montré aucune activité pendant la période définie par la politique IT.",
		},
		{
			id: "autre",
			label: "Autre motif (à préciser)",
			description: "Sélectionnez cette option pour un motif non listé ci-dessus.",
		},
	];

	// Validation du formulaire
	const isFormValid = () => {
		if (!acceptDeleteBot) return false;
		if (motif === "autre" && !customMotif.trim()) return false;
		if (!motif) return false;
		return true;
	};

	// Passage à l'étape suivante
	const proceedToConfirmation = () => {
		if (isFormValid()) {
			onConfirm(), setUserDeleteProps((prev) => ({ ...prev, show: true }));
		}
	};

	useEffect(() => {
		setUserDeleteProps((prev) => ({
			...prev,
			motif: getFinalMotif(),
			user_id: user_id,
			onConfirm: async () => {
				await proceedDelete();
				onDelete();
				setUserDeleteProps((prev) => ({ ...prev, show: false }));
			},
		}));
	}, [customMotif, motif, user_id]);

	// Récupère la description du motif sélectionné
	const getSelectedReasonDescription = () => {
		return deletionReasons.find((reason) => reason.id === motif)?.description || "";
	};

	// Fonction pour obtenir le motif final sous forme de string
	const getFinalMotif = (): string => {
		if (motif === "autre") {
			return customMotif;
		}
		return deletionReasons.find((reason) => reason.id === motif)?.label || "";
	};

	const proceedDelete = async () => {
		try {
			const motif = getFinalMotif();
			const queryParams = { motif };

			// Appel initial pour supprimer l'utilisateur
			const res = await userService.deleteUser(user_id, queryParams);
			toast.success(res?.message);
			return true;
		} catch (error: any) {
			if (error.response) {
				const { status, data } = error.response;

				if (status === 409) {
					// Afficher un message à l'utilisateur
					toast.info("Des bots actifs ont été détectés. Tentative de suppression des bots...");

					try {
						const activeBots = data.data?.active_bots || [];

						// Supprimer tous les bots actifs en parallèle
						const deletePromises = activeBots.map((botId: number) => botService.deleteBot(botId));

						// Attendre que toutes les suppressions de bots soient terminées
						await Promise.all(deletePromises);

						// Réessayer la suppression de l'utilisateur après avoir supprimé les bots
						toast.info("Tous les bots ont été supprimés. Nouvelle tentative de suppression de l'utilisateur...");
						return proceedDelete(); // Appel récursif
					} catch (botError: any) {
						toast.error(
							`Erreur lors de la suppression des bots: ${botError.response?.data?.message || botError.message}`,
						);
						return false;
					}
				} else {
					// Autres erreurs HTTP
					toast.error(error.response.data.message || "Une erreur est survenue");
					return false;
				}
			} else {
				// Erreurs réseau ou autres
				toast.error(error.message || "Erreur réseau");
				return false;
			}
		}
	};

	return (
		<>
			<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
				<DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle className="flex items-center gap-2 text-gray-700">
							<span>Information de suppression d'utilisateur</span>
						</DialogTitle>
					</DialogHeader>

					{/* Zone de contenu avec scroll */}
					<ScrollArea className="h-[calc(90vh-120px)] w-full px-6">
						<div className="space-y-6 py-4">
							{/* Section d'information générale */}
							<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-start gap-3">
									<Info className="h-5 w-5 text-blue-600 mt-0.5" />
									<div className="text-sm text-blue-800">
										<p className="font-medium">Information importante :</p>
										<p className="mt-1">
											Cette procédure est réservée aux administrateurs système. La suppression d'un utilisateur
											entraînera la perte définitive de toutes ses données et configurations associées. Cette action
											sera enregistrée dans les journaux d'audit.
										</p>
									</div>
								</div>
							</div>

							{/* Sélection du motif */}
							<div className="space-y-4">
								<div className="space-y-1">
									<Label className="font-medium text-gray-800">Motif de suppression *</Label>
									<p className="text-xs text-gray-500">
										Sélectionnez le motif principal de cette suppression (obligatoire)
									</p>
								</div>

								<RadioGroup value={motif} onValueChange={setMotif} className="space-y-3">
									{deletionReasons.map((reason) => (
										<div
											key={reason.id}
											className={`p-4 rounded-lg border-2 ${motif === reason.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
										>
											<div className="flex items-start space-x-3">
												<RadioGroupItem value={reason.id} id={reason.id} className="mt-1" />
												<div className="flex-1">
													<Label htmlFor={reason.id} className="font-medium text-gray-800">
														{reason.label}
													</Label>
													{reason.description && <p className="text-sm text-gray-600 mt-1">{reason.description}</p>}
												</div>
											</div>
										</div>
									))}
								</RadioGroup>

								{/* Champ pour motif personnalisé */}
								{motif === "autre" && (
									<div className="space-y-2 pt-2">
										<Label htmlFor="custom-motif" className="font-medium text-gray-800">
											Détails du motif *
										</Label>
										<Textarea
											id="custom-motif"
											value={customMotif}
											onChange={(e) => setCustomMotif(e.target.value)}
											placeholder="Décrivez précisément le motif de cette suppression (ce champ sera enregistré dans les logs d'audit)..."
											className="min-h-[120px]"
											required
										/>
									</div>
								)}
							</div>

							{/* Section d'avertissement et confirmation */}
							<div className="p-4 bg-red-50 rounded-lg border border-red-200">
								<div className="flex items-start gap-3">
									<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
									<div className="text-sm text-red-800 space-y-2">
										<p className="font-medium">Conséquences de cette action :</p>
										<ul className="mt-1 list-disc pl-5 space-y-1">
											<li>Suppression immédiate et définitive de tous les bots et configurations associés</li>
											<li>Perte irréversible de toutes les données utilisateur dans le système</li>
											<li>Impact potentiel sur les workflows dépendants de cet utilisateur</li>
											<li>Enregistrement permanent de cette action dans les journaux d'audit</li>
										</ul>

										<div className="flex items-start space-x-2 mt-3 pt-3 border-t border-red-100">
											<Checkbox
												id="accept-delete-bot"
												checked={acceptDeleteBot}
												onCheckedChange={(checked) => setAcceptDeleteBot(!!checked)}
												className="mt-0.5"
											/>
											<Label htmlFor="accept-delete-bot" className="text-sm font-medium text-red-800">
												Je confirme avoir pris connaissance des conséquences ci-dessus et j'assume l'entière
												responsabilité de cette suppression, conformément à la
												<span className="font-semibold"> politique de sécurité de l'entreprise (Article 7.2)</span>.
											</Label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollArea>

					{/* Pied de page fixe */}
					<div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
						<Button variant="outline" onClick={onCancel}>
							Annuler
						</Button>
						<Button variant="destructive" onClick={proceedToConfirmation} disabled={!isFormValid()}>
							Valider et continuer →
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Modale de confirmation finale */}
			<UserDeleteModal {...userDeleteProps} />
		</>
	);
}
