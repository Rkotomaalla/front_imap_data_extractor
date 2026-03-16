import { UserData } from "@/types/entity";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";

export type UserConfirmModalProps = {
	formData: UserData;
	title: string;
	show: boolean;
	onConfirm: VoidFunction;
	onCancel: VoidFunction;
};

export default function UserConfirmModal({ formData, show, onCancel, onConfirm }: UserConfirmModalProps) {
	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirmer les informations</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<p className="text-sm text-muted-foreground">
						Veuillez confirmer les informations suivantes avant validation :
					</p>
					<div className="grid gap-2">
						<div className="flex justify-between border-b pb-2">
							<span className="font-medium">Prénom :</span>
							<span>{formData?.first_name}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="font-medium">Nom :</span>
							<span>{formData?.last_name}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="font-medium">Email :</span>
							<span>{formData?.email}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="font-medium">Rôle :</span>
							<span>{formData?.role === "admin" ? "Admin" : "User"}</span>
						</div>
						<div className="flex justify-between border-b pb-2">
							<span className="font-medium">Département :</span>
							<span>{formData?.departement}</span>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Retour
					</Button>
					<Button onClick={onConfirm}>Confirmer</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
