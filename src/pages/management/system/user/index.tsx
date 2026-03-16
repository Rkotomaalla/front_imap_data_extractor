import { Icon } from "@/components/icon";
import { usePathname, useRouter } from "@/routes/hooks";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Input, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UserData, UserUpdate } from "#/entity";
import { useEffect, useState } from "react";
import { UserModal, type UserModalProps } from "./new/user-modal";
import { toast } from "sonner";
import userService from "@/api/services/userService";
import utilsService from "@/api/services/utilsService";
import { type UpdateModalProps, UserUpdateModal } from "./new/user-update-modal";
import UserDeleteModal, { UserDeleteModalProps } from "./utils/user-detele-modal";
import UserDeleteMotifModal, { UserDeleteMotifModalProps } from "./utils/user-delete-motif-modal";

type Option = { label: string; value: string };

const DEFAULT_USER_VALUE: UserData = {
	first_name: "",
	last_name: "",
	email: "example@gmail.com",
	password: "sldqf qsd qsdkjf",
	confirm_password: "sdkjldfsqfjsqdf",
	role: "user",
	departement: "",
};

export default function UserPage() {
	const [roles, setRoles] = useState<Option[]>([]);
	const [departements, setDepartements] = useState<Option[]>([]);
	const [USERS, setUsers] = useState<UserData[]>([]);
	const [count, setCount] = useState<number>();
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [filters, setFilters] = useState({
		name: "",
		email: "",
		role: undefined,
		departement: undefined,
	});
	// Modal de Creation d un utilisateur
	const [userModalProps, setUserModalProps] = useState<UserModalProps>({
		formValue: { ...DEFAULT_USER_VALUE },
		title: "Nouvel Utilisateur",
		show: false,
		newUser: () => resetUserData(),
		onCancel: () => setUserModalProps((prev) => ({ ...prev, show: false })),
	});

	//modal de modification utilisateur
	const [userUpdateProps, setUserUpdateProps] = useState<UpdateModalProps>({
		uid_number: 0,
		formValue: {},
		title: "Modifier utilisateur",
		show: false,
		onCancel: () => {
			setUserUpdateProps((prev) => ({ ...prev, show: false }));
		},
		updateUser: () => resetUserData(),
	});

	// modal de suppression utilisateur

	const [userDeleteMotifModalProps, setUserDeleteMotifModalProps] = useState<UserDeleteMotifModalProps>({
		user_id: -1,
		show: false,
		onConfirm: () => {
			setUserDeleteMotifModalProps((prev) => ({ ...prev, show: false }));
		},
		onCancel: () => {
			setUserDeleteMotifModalProps((prev) => ({ ...prev, show: false }));
		},
		onDelete: () => resetUserData(),
	});

	const deleteUser = async (user_id: number) => {
		try {
			setUserDeleteMotifModalProps((prev) => ({ ...prev, show: true, user_id: user_id }));
			// const res = await userService.deleteUser(user_id);
			// toast.success(res?.message)
			// return true;
		} catch (error: any) {
			if (error.response?.status === 409) {
				// return false;
			} else {
				toast.error(error.response?.data?.message || error.message || "Erreur serveur");
			}
		}
	};

	const { push } = useRouter();
	const pathname = usePathname();

	const loadUserList = async () => {
		try {
			const queryParams: any = { page };
			if (pageSize) queryParams.page_size = pageSize;
			if (filters.name) queryParams.name = filters.name;
			if (filters.email) queryParams.email = filters.email;
			if (filters.role) queryParams.role = filters.role;
			if (filters.departement) queryParams.departement = filters.departement;

			const userList = await userService.getList(queryParams);
			setCount(userList.count);
			setUsers(userList.data);
		} catch (err: any) {
			const errorData = err.response?.data || err;
			if (errorData?.errors) {
				Object.entries(errorData.errors).forEach(([_, messages]) => {
					(messages as string[]).forEach((msg) => {
						toast.error(msg, { position: "top-center" });
					});
				});
			} else if (errorData?.error) {
				toast.error(`${errorData.message}\n${errorData.error}`, { position: "top-center" });
			} else if (errorData?.message) {
				toast.error(errorData.message, { position: "top-center" });
			} else if (errorData?.detail) {
				toast.error(errorData.detail, { position: "top-center" });
			} else {
				toast.error("Erreur inconnue", { position: "top-center" });
			}
		}
	};

	const resetUserData = () => {
		console.log("UPDATE user APPLELEE");
		loadUserList();
	};

	const handleUpdate = (uid_number: number) => {
		const user = USERS.find((user) => user.uid_number === uid_number);
		const default_user_value: UserUpdate = {
			first_name: user?.first_name,
			last_name: user?.last_name,
			departement: user?.departement,
			role: user?.role,
			email: user?.email,
		};

		setUserUpdateProps((prev) => ({
			...prev,
			formValue: default_user_value,
			uid_number: uid_number,
			show: true,
		}));
	};

	const onCreate = () => {
		setUserModalProps((prev) => ({
			...prev,
			show: true,
			title: "Créer un Utilisateur",
			formValue: { ...DEFAULT_USER_VALUE },
		}));
	};

	useEffect(() => {
		loadUserList();
	}, [page, filters, pageSize]);

	useEffect(() => {
		setPage(1);
	}, [filters]);

	useEffect(() => {
		const loadForm = async () => {
			try {
				const allDep = await utilsService.getAllDepartments();
				setDepartements(
					allDep.map(
						(dept: any): Option => ({
							label: dept.name,
							value: dept.name,
						}),
					),
				);

				const allRoles = ["user", "admin"];
				setRoles(
					allRoles.map(
						(role: string): Option => ({
							label: role.charAt(0).toUpperCase() + role.slice(1),
							value: role,
						}),
					),
				);
			} catch (error: any) {
				console.error(error);
			}
		};
		loadForm();
		loadUserList();
	}, []);

	const columns: ColumnsType<UserData> = [
		{
			title: "Nom",
			dataIndex: "full_name",
			width: 300,
			render: (_, record) => (
				<div className="flex items-center gap-3">
					<img
						alt="Avatar"
						src={record.avatar}
						className="h-10 w-10 rounded-full object-cover border border-gray-200"
					/>
					<div className="flex flex-col">
						<span className="font-medium text-gray-900">{record.full_name}</span>
						<span className="text-xs text-gray-500">{record.email}</span>
					</div>
				</div>
			),
		},
		{
			title: "Département",
			dataIndex: "departement",
			align: "center",
			width: 150,
			render: (_, record) => <Badge className="bg-blue-100 text-blue-800 border-blue-200">{record.departement}</Badge>,
		},
		{
			title: "Rôle",
			dataIndex: "role",
			align: "center",
			width: 120,
			render: (_, record) => (
				<Badge
					variant="info"
					className={`${
						record.role === "admin"
							? "bg-purple-100 text-purple-800 border-purple-200"
							: "bg-green-100 text-green-800 border-green-200"
					}`}
				>
					{record.role}
				</Badge>
			),
		},
		{
			title: "Actions",
			key: "operation",
			align: "center",
			width: 120,
			render: (_, record) => (
				<div className="flex justify-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100"
						onClick={() => push(`${pathname}/${record.uid_number}`)}
					>
						<Icon icon="mdi:card-account-details" size={18} />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100"
						onClick={() => {
							if (record.uid_number !== undefined) {
								handleUpdate(record.uid_number);
							}
						}}
					>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100 text-red-500 hover:text-red-700"
						onClick={() => {
							if (record.uid_number !== undefined) {
								deleteUser(record.uid_number);
							}
						}}
					>
						<Icon icon="mingcute:delete-2-fill" size={18} />
					</Button>
				</div>
			),
		},
	];

	return (
		<Card className="shadow-sm rounded-lg border border-gray-100">
			<CardHeader className="p-6 border-b border-gray-100">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<h2 className="text-xl font-semibold text-gray-800">Liste des Utilisateurs</h2>
					<Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
						Créer un Utilisateur
					</Button>
				</div>
				<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<Input
						placeholder="Rechercher par nom"
						value={filters.name}
						onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
						className="w-full"
					/>
					<Input
						placeholder="Rechercher par email"
						value={filters.email}
						onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
						className="w-full"
					/>
					<Select
						placeholder="Département"
						allowClear
						options={departements}
						value={filters.departement}
						onChange={(value) => setFilters((prev) => ({ ...prev, departement: value }))}
						className="w-full"
					/>
					<Select
						placeholder="Rôle"
						allowClear
						options={roles}
						value={filters.role}
						onChange={(value) => setFilters((prev) => ({ ...prev, role: value }))}
						className="w-full"
					/>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<Table
					rowKey="id"
					size="middle"
					scroll={{ x: "max-content" }}
					pagination={{
						current: page,
						pageSize: pageSize,
						total: count,
						showSizeChanger: true, // ✅ Affiche le sélecteur
						onChange: (newPage, newPageSize) => {
							setPage(newPage);
							if (newPageSize !== pageSize) {
								setPageSize(newPageSize);
								setPage(1); // Reset à la page 1
							}
						},
					}}
					columns={columns}
					dataSource={USERS}
					className="user-table"
				/>
			</CardContent>
			<UserModal {...userModalProps} />
			<UserUpdateModal {...userUpdateProps} />
			<UserDeleteMotifModal {...userDeleteMotifModalProps} />
		</Card>
	);
}
