import { useUserData, useUserTokens } from "@/store/userStore";

/**
 * permission/role check hook
 * @param baseOn - check type: 'role' or 'permission'
 *
 * @example
 * // permission check
 * const { check, checkAny, checkAll } = useAuthCheck('permission');
 * check('user.create')
 * checkAny(['user.create', 'user.edit'])
 * checkAll(['user.create', 'user.edit'])
 *
 * @example
 * // role check
 * const { check, checkAny, checkAll } = useAuthCheck('role');
 * check('admin')
 * checkAny(['admin', 'editor'])
 * checkAll(['admin', 'editor'])
 */
export const useAuthCheck = () => {
	const { access } = useUserTokens(); // vérifier si l'utilisateur est connecté
	const { role = "user" } = useUserData(); // récupérer le rôle, "user" par défaut

	// Vérifie un rôle spécifique
	const check = (requiredRole: "admin" | "user"): boolean => {
		if (!access) return false; // pas connecté → pas d'accès
		return role === requiredRole; // retourne true si le rôle correspond
	};

	// Vérifie si l'utilisateur a au moins un rôle dans la liste
	const checkAny = (roles: ("admin" | "user")[]) => {
		if (roles.length === 0) return true;
		return roles.some((r) => check(r));
	};

	// Vérifie si l'utilisateur a tous les rôles (ici pas très utile pour juste "admin" et "user")
	const checkAll = (roles: ("admin" | "user")[]) => {
		if (roles.length === 0) return true;
		return roles.every((r) => check(r));
	};

	return { check, checkAny, checkAll };
};
