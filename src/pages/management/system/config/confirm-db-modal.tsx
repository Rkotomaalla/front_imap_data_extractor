import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { useState } from "react";
import { Checkbox } from "@/ui/checkbox";
import { ScrollArea } from "@/ui/scroll-area";
import { AlertCircle, Database, ShieldAlert } from "lucide-react";
import { Label } from "@/ui/label";
import { DbConfigType } from "./db-config-tab";

export type DbConfigConfirmModalProps = {
	show: boolean;
	onConfirm: VoidFunction;
	onCancel: VoidFunction;
	formData: DbConfigType;
};

export default function DbConfigConfirmModal({ show, onConfirm, onCancel, formData }: DbConfigConfirmModalProps) {
	const [check, setCheck] = useState(false);

	return (
		<>
			<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
				<DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle className="flex items-center gap-2 text-amber-700">
							<ShieldAlert className="h-5 w-5" />
							<span>Confirmation de modification</span>
						</DialogTitle>
					</DialogHeader>

					{/* Zone de contenu avec scroll */}
					<ScrollArea className="h-[calc(90vh-120px)] w-full px-6">
						<div className="space-y-6 py-4">
							{/* Section d'avertissement principal */}
							<div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
								<div className="flex items-start gap-3">
									<AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
									<div className="text-sm text-amber-800 space-y-3">
										<p className="font-medium">
											Vous vous apprêtez à modifier la configuration de la base de données. Cette action est{" "}
											<strong>critique</strong> et peut avoir des conséquences majeures sur le système.
										</p>

										{/* Affichage des informations saisies */}
										<div className="mt-3 p-3 bg-white rounded-lg border border-amber-100">
											<p className="font-medium text-gray-800 mb-2">Nouvelle configuration :</p>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Nom :</strong> {formData.name}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Hôte :</strong> {formData.host}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Port :</strong> {formData.port}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Base de données :</strong> {formData.db_name}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Utilisateur :</strong> {formData.username || "Non défini"}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Database className="h-3 w-3 text-muted-foreground" />
													<span>
														<strong>Mot de passe :</strong> {formData.password ? "••••••••" : "Non défini"}
													</span>
												</div>
												<div className="col-span-1 md:col-span-2 flex items-start gap-2">
													<Database className="h-3 w-3 text-muted-foreground mt-0.5" />
													<div>
														<strong>Raison du changement :</strong>
														<p className="mt-0.5 text-gray-700">{formData.change_reason}</p>
													</div>
												</div>
											</div>
										</div>

										<div className="mt-3">
											<p className="font-medium">Conséquences immédiates pour le système :</p>
											<ul className="mt-1 list-disc pl-5 space-y-1 text-amber-700">
												<li>
													<strong>Interruption de service</strong> : Une configuration incorrecte peut rendre la base de
													données inaccessible.
												</li>
												<li>
													<strong>Perte de connectivité</strong> : Les applications dépendantes de cette base de données
													pourraient cesser de fonctionner.
												</li>
												<li>
													<strong>Impact sur les données</strong> : Une mauvaise configuration peut entraîner des
													erreurs de lecture/écriture ou une corruption des données.
												</li>
												<li>
													<strong>Audit et conformité</strong> : Cette action sera enregistrée dans les journaux
													d'audit.
												</li>
											</ul>
										</div>

										<div className="mt-3">
											<p className="font-medium">Conséquences organisationnelles :</p>
											<ul className="mt-1 list-disc pl-5 space-y-1 text-amber-700">
												<li>
													<strong>Responsabilité administrative</strong> : En tant qu'administrateur, vous engagez votre
													responsabilité dans cette décision.
												</li>
												<li>
													<strong>Coordination requise</strong> : Assurez-vous que cette modification est validée par
													les équipes concernées (ex: DevOps, Sécurité).
												</li>
												<li>
													<strong>Risque opérationnel</strong> : Vérifiez que cette modification ne perturbera pas les
													services en production.
												</li>
											</ul>
										</div>

										<p className="text-xs italic text-amber-600 mt-3 pt-3 border-t border-amber-100">
											<strong>Note</strong> : Cette modification doit être justifiée par un motif valable. Pour les
											environnements de production, une validation préalable du RSSI est obligatoire.
										</p>
									</div>
								</div>
							</div>
						</div>
					</ScrollArea>

					{/* Case à cocher pour confirmation */}
					<div className="p-6 pt-0 bg-gray-50 border-t border-gray-100">
						<div className="flex items-start space-x-2">
							<Checkbox
								id="confirm-db-change"
								checked={check}
								onCheckedChange={(checked) => setCheck(!!checked)}
								className="mt-0.5"
							/>
							<Label htmlFor="confirm-db-change" className="text-sm font-medium text-gray-800">
								Je certifie avoir vérifié la nouvelle configuration et pris connaissance des conséquences système et
								organisationnelles décrites ci-dessus. Je confirme vouloir procéder à cette modification, sous ma pleine
								responsabilité administrative.
							</Label>
						</div>
					</div>

					{/* Pied de page fixe */}
					<div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
						<Button variant="outline" onClick={onCancel}>
							Annuler
						</Button>
						<Button
							variant="destructive"
							className="bg-amber-600 hover:bg-amber-700"
							onClick={onConfirm}
							disabled={!check}
						>
							Confirmer la modification
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
