import { useMutation } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import avatar from "@/assets/images/avatars/avatar-de-lutilisateur.png";

import userService, { type SignInReq } from "@/api/services/userService";

import { toast } from "sonner";
import type { UserData, UserTokens } from "#/entity";

type UserStore = {
	userData: Partial<UserData>;
	userTokens: UserTokens;

	actions: {
		setUserData: (userData: UserData) => void;
		setUserTokens: (token: UserTokens) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userData: { avatar: avatar },
			userTokens: {},
			actions: {
				setUserData: (userData) => {
					set({ userData });
				},
				setUserTokens: (userTokens) => {
					set({ userTokens });
				},
				clearUserInfoAndToken() {
					set({ userData: { avatar: avatar }, userTokens: {} });
				},
			},
		}),
		{
			name: "userStore",
			storage: createJSONStorage(() => localStorage),
			// ✅ CORRECTION ICI
			partialize: (state) => ({
				userData: state.userData,
				userTokens: state.userTokens,
			}),
		},
	),
);

export const useUserData = () => useUserStore((state) => state.userData);
export const useUserTokens = () => useUserStore((state) => state.userTokens);
export const useUserRoles = () => useUserStore((state) => state.userData.role || "user");
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
	const { setUserTokens, setUserData } = useUserActions();

	const signInMutation = useMutation({
		mutationFn: userService.signin,
	});

	const signIn = async (data: SignInReq) => {
		try {
			const res = await signInMutation.mutateAsync(data);
			const { user, access, refresh } = res;

			if (!access || !refresh) throw new Error("Tokens manquants");

			setUserTokens({ access, refresh });
			setUserData(user);
		} catch (err: any) {
			toast.error(err, {
				position: "top-center",
			});
			throw err;
		}
	};

	return signIn;
};

export default useUserStore;
