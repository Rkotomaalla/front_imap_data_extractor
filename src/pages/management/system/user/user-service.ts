import botService from "@/api/services/botService";
import userService from "@/api/services/userService";
import { toast } from "sonner";

export default function UserService() {
	interface ApiResponse {
		status: "success" | "error";
		message?: string;
		data?: any;
	}

	const delete_user_bot = async (bot_id: number): Promise<boolean> => {
		try {
			const res: ApiResponse = await botService.deleteBot(bot_id);

			if (res.status === "success") {
				return true;
			} else {
				// Si l'API retourne un statut "error", afficher le message et retourner false
				toast.error(res.message || "Échec de la suppression du bot.");
				return false;
			}
		} catch (error: any) {
			// Log pour le débogage
			console.error("Erreur lors de la suppression du bot :", error);

			// Message utilisateur
			const errorMessage =
				error.response?.data?.message || error.message || "Erreur serveur lors de la suppression du bot.";

			toast.error(errorMessage);
			return false;
		}
	};
}
