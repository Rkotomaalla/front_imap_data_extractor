import { useUserTokens } from "@/store/userStore";
import { useCallback, useEffect } from "react";
import { useRouter } from "../hooks";

type Props = {
	children: React.ReactNode;
};
export default function LoginAuthGuard({ children }: Props) {
	const router = useRouter();
	const { access } = useUserTokens();

	const check = useCallback(() => {
		if (!access) {
			router.replace("/auth/login");
		}
	}, [router, access]);

	useEffect(() => {
		check();
	}, [check]);

	return <>{children}</>;
}
