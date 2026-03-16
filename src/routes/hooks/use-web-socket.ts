import { useEffect, useRef, useCallback } from "react";

import userStore from "@/store/userStore";

interface UseNotificationsOptions<T> {
	onNotification: (notif: T) => void;
	onConnected?: () => void;
	onError?: (error: Event) => void;
	notif_option: number;
}

export const useNotifications = <T>({
	onNotification,
	onConnected,
	onError,
	notif_option,
}: UseNotificationsOptions<T>) => {
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

	const connect = useCallback(() => {
		// L'URL ne contient pas de paramètres : l'authentification se fait via les cookies

		const user = userStore.getState().userData.uid_number;

		let wsUrl = "";
		if (notif_option === 0) {
			wsUrl = `ws://localhost:8001/ws/notifications/?user=${user}`;
		} else {
			wsUrl = `ws://localhost:8001/ws/consoles/?user=${user}`;
		}

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("WebSocket connecté");
			onConnected?.();
		};

		ws.onmessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data);

				if (data.type === "connection_established") {
					console.log("Connexion établie");
					return;
				}
				if (notif_option === 0) {
					onNotification(data);
				} else {
					onNotification(data);
				}
				// Notification reçue
			} catch (e) {
				console.error("Erreur de parsing du message WebSocket", e);
				onError?.(e as Event);
			}
		};

		ws.onerror = (error: Event) => {
			console.error("Erreur WebSocket", error);
			onError?.(error);
		};

		ws.onclose = (event: CloseEvent) => {
			console.warn(`WebSocket fermé (code: ${event.code})`);

			// Reconnexion automatique après 3 secondes (sauf si erreur critique)
			if (event.code !== 4001 && event.code !== 4002) {
				reconnectTimeout.current = setTimeout(connect, 3000);
			}
		};
	}, [onNotification, onConnected, onError]);

	useEffect(() => {
		connect();

		return () => {
			if (reconnectTimeout.current) {
				clearTimeout(reconnectTimeout.current);
			}
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, [connect]);
};
