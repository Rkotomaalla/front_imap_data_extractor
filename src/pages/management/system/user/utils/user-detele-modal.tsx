import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { useState } from "react";
import { Checkbox } from "@/ui/checkbox";
import { ScrollArea } from "@/ui/scroll-area";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Label } from "@/ui/label";

export type UserDeleteModalProps = {
	user_id: number;
	motif: string;
	show: boolean;
	onConfirm: VoidFunction;
	onCancel: VoidFunction;
};

export default function UserDeleteModal({ show, onConfirm, onCancel }: UserDeleteModalProps) {
	const [check, setCheck] = useState(false);

	return (
		<>
			<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
				<DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col">
					<DialogHeader className="p-6 pb-0">
						<DialogTitle className="flex items-center gap-2 text-red-700">
							<ShieldAlert className="h-5 w-5" />
							<span>Confirmation de suppression irréversible</span>
						</DialogTitle>
					</DialogHeader>

					{/* Zone de contenu avec scroll */}
					<ScrollArea className="h-[calc(90vh-120px)] w-full px-6">
						<div className="space-y-6 py-4">
							{/* Section d'avertissement principal */}
							<div className="p-4 bg-red-50 rounded-lg border border-red-200">
								<div className="flex items-start gap-3">
									<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
									<div className="text-sm text-red-800 space-y-3">
										<p className="font-medium">
											Vous vous apprêtez à effectuer une action <strong>critique et irréversible</strong> :
										</p>
										<p>La suppression définitive de cet utilisateur et de toutes ses données associées.</p>

										<div className="mt-3">
											<p className="font-medium">Conséquences immédiates pour le système :</p>
											<ul className="mt-1 list-disc pl-5 space-y-1 text-red-700">
												<li>
													<strong>Suppression des accès</strong> : L'utilisateur perdra immédiatement tous ses droits
													d'accès aux applications et services internes.
												</li>
												<li>
													<strong>Perte des données associées</strong> : Tous les bots, configurations, historiques et
													logs liés à cet utilisateur seront <strong>définitivement effacés</strong>
													des bases de données.
												</li>
												<li>
													<strong>Impact sur les workflows</strong> : Les processus automatisés ou manuels dépendant de
													cet utilisateur pourraient être interrompus sans préavis.
												</li>
												<li>
													<strong>Audit et conformité</strong> : Cette action sera enregistrée dans les journaux d'audit
													et pourra faire l'objet d'un contrôle interne ou externe.
												</li>
											</ul>
										</div>

										<div className="mt-3">
											<p className="font-medium">Conséquences organisationnelles :</p>
											<ul className="mt-1 list-disc pl-5 space-y-1 text-red-700">
												<li>
													<strong>Responsabilité administrative</strong> : En tant qu'administrateur, vous engagez votre
													responsabilité dans cette décision, conformément à la politique de sécurité de l'entreprise
													(cf. Article 5.3 du Règlement Interne).
												</li>
												<li>
													<strong>Coordination requise</strong> : Cette suppression peut impacter d'autres équipes (ex:
													Support, RH, Sécurité). Une communication préalable est fortement recommandée.
												</li>
												<li>
													<strong>Risque opérationnel</strong> : Si l'utilisateur gère des ressources critiques (ex:
													bots de production), leur suppression pourrait entraîner des perturbations des services.
												</li>
											</ul>
										</div>

										<p className="text-xs italic text-red-600 mt-3 pt-3 border-t border-red-100">
											<strong>Note</strong> : Conformément à la politique RGPD de l'entreprise, cette action doit être
											justifiée par un motif valable (ex: départ de l'utilisateur, violation de sécurité). Pour les cas
											sensibles, consulter le Responsable de la Sécurité des Systèmes d'Information (RSSI).
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
								id="confirm-delete"
								checked={check}
								onCheckedChange={(checked) => setCheck(!!checked)}
								className="mt-0.5"
							/>
							<Label htmlFor="confirm-delete" className="text-sm font-medium text-gray-800">
								Je certifie avoir pris connaissance des conséquences système et organisationnelles décrites ci-dessus.
								Je confirme vouloir procéder à la suppression définitive de cet utilisateur, sous ma pleine
								responsabilité administrative.
							</Label>
						</div>
					</div>

					{/* Pied de page fixe */}
					<div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
						<Button variant="outline" onClick={onCancel}>
							Annuler
						</Button>
						<Button variant="destructive" onClick={onConfirm} disabled={!check}>
							Confirmer la suppression définitive
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
