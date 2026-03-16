import botService from "@/api/services/botService";
import gmailService from "@/api/services/gmailService";
import { toast } from "sonner";

export default function BotService() {
	const activate_bot = async (bot_id: number) => {
		try {
			const res = await botService.activeBot(bot_id); // ✅ await obligatoire
			toast.success(res?.message);
		} catch (error: any) {
			if (error.response?.status === 409) {
				// Gmail auth flow
				try {
					const res = await gmailService.gmailAuth();
					if (res?.auth_url) {
						window.open(res.auth_url, "_blank");
					}
				} catch (authError: any) {
					toast.error(authError.message || "Erreur auth Gmail");
				}
			} else {
				toast.error(error.response?.data?.message || error.message || "Erreur serveur");
			}
		}
	};

	const stop_bot = async (bot_id: number) => {
		try {
			const res = await botService.stopBot(bot_id); // ✅ await obligatoire
			toast.success(res?.message);
		} catch (error: any) {
			toast.error(error.response?.data?.message || error.message || "Erreur serveur");
		}
	};
	return { activate_bot, stop_bot };
}
