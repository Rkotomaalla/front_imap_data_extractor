import { useParams } from "@/routes/hooks";
import { Card, CardContent } from "@/ui/card";
import type { UserData } from "#/entity";

// TODO: fix
// const USERS: UserInfo[] = USER_LIST as UserInfo[];
const USERS: UserData[] = [];

export default function UserDetail() {
	const { uid_number } = useParams();
	const user = USERS.find((user) => user.uid_number === Number(uid_number));
	return (
		<Card>
			<CardContent>
				<p>This is the detail page of {user?.username}</p>
			</CardContent>
		</Card>
	);
}
