import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

import type { Department, UserData, UserUpdate } from "#/entity";
import { TreeSelect } from "antd";
import utilsService from "@/api/services/utilsService";

import { Eye, EyeOff } from "lucide-react";
import UserConfirmModal, { UserConfirmModalProps } from "./confirm-modal";
import userService, { SignInReq } from "@/api/services/userService";
import { toast } from "sonner";

// Types =============================
export type UpdateModalProps = {
	uid_number: number;
	formValue: UserUpdate;
	title: string;
	show: boolean;
	onCancel: VoidFunction;
	updateUser: VoidFunction;
};

// function out =============================
//
export function UserUpdateModal({ uid_number, formValue, title, show, onCancel, updateUser }: UpdateModalProps) {
	const [confirmForm, setConfirmForm] = useState<UserConfirmModalProps>({
		formData: {},
		title: "Confirmation Creation d'utilisateur",
		show: false,
		onConfirm: async () => {
			await handleUpdateUser();
			updateUser();
		},
		onCancel: () => {
			setConfirmForm((prev) => ({ ...prev, show: false }));
		},
	});

	const [showPassword, setShowPassword] = useState(false);
	const [departements, setDepartements] = useState<Department[]>([]);
	const [showErrorPsd, setShowErrorPsd] = useState(false);

	// Dans le composant parent
	const form = useForm<UserUpdate>({
		defaultValues: formValue,
	});

	function removeEqualAttributes<T extends object>(A: T, B: T): Partial<T> {
		const result: Partial<T> = { ...A }; // Crée une copie de A

		// Parcourt chaque clé de A
		for (const key in A) {
			// Vérifie si la clé existe dans B et si les valeurs sont égales
			if (B.hasOwnProperty(key) && A[key] === B[key]) {
				delete result[key]; // Supprime la clé si les valeurs sont égales
			}
		}

		return result;
	}

	const handleUpdateUser = form.handleSubmit(async (data: UserData) => {
		try {
			console.log(formValue);
			const update_data = removeEqualAttributes(data, formValue);
			const result = await userService.updateUser(update_data, uid_number);

			if (!result.success) throw result;

			setConfirmForm((prev) => ({ ...prev, show: false }));
			onCancel();

			toast.success(result.message, { position: "top-center" });
		} catch (err: any) {
			// Pour Axios, les données du serveur sont dans err.response.data
			const errorData = err.response?.data || err;

			if (errorData?.errors) {
				// Erreurs de validation détaillées
				Object.entries(errorData.errors).forEach((messages) => {
					(messages as string[]).forEach((msg) => {
						toast.error(`${msg}`, { position: "top-center" });
					});
				});
			} else if (errorData?.error) {
				toast.error(`${errorData.message}\n${errorData.error}`, { position: "top-center" });
			} else if (errorData?.message) {
				toast.error(errorData.message, { position: "top-center" });
			} else {
				toast.error("Erreur inconnue", { position: "top-center" });
			}

			setConfirmForm((prev) => ({ ...prev, show: false }));
		}
	});

	// Functions ==================================
	// const handleUpdateUser = form.handleSubmit(async (data: UserUpdate) => {});
	const auth_password = async (value: string) => {
		const user = await userService.findById(uid_number);
		if (!user && value) return false;
		else {
			return true;
		}
	};

	const simpleAuth = async (current_password: string) => {
		try {
			const email = formValue?.email;
			console.log("email");
			console.log(email);
			if (email) {
				const data: SignInReq = {
					email: email,
					password: current_password,
				};
				const res = await userService.simpleAuth(data);
				return res.success;
			}
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

	const onConfirm = async (data: any) => {
		const { current_password } = data;
		console.log("Eto Amin ilay confirmation");
		if (current_password) {
			console.log("Misy current_password");

			const res = await simpleAuth(current_password);

			console.log("Résultat");
			console.log(res);

			if (res === false) {
				setShowErrorPsd(true);
				return;
			}
		}

		const user_data: any = {
			...data,
			first_name: formValue?.first_name,
			last_name: formValue?.last_name,
		};
		console.log(data);
		setConfirmForm((prev) => ({
			...prev,
			show: true,
			formData: user_data,
		}));
	};
	// =====

	// hooks ==================================
	// Charger les fields
	useEffect(() => {
		const loadDeps = async () => {
			try {
				const depList = await utilsService.getAllDepartments();
				setDepartements(depList);
			} catch (err) {
				console.error(err);
			}
		};
		loadDeps();
	}, []);

	useEffect(() => {
		setConfirmForm((prev) => ({
			...prev,
			onConfirm: async () => {
				await handleUpdateUser(); // uid_number frais via closure
				updateUser();
			},
		}));
	}, [uid_number]);

	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	// =====

	return (
		<>
			<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								rules={{ required: "Email obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Email</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								rules={{ required: "Rôle obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Rôle</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<RadioGroup
													onValueChange={(value) => field.onChange(String(value))}
													defaultValue={String(field.value)}
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="admin" id="admin" />
														<Label htmlFor="admin">Admin</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="user" id="user" />
														<Label htmlFor="user">User</Label>
													</div>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="departement"
								rules={{ required: "Département obligatoire" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-right">Département</FormLabel>
										<FormControl>
											<TreeSelect
												treeData={departements}
												fieldNames={{ label: "name", value: "name" }}
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="current_password"
								rules={{
									validate: (value) => {
										if (value) {
											const res = auth_password(value);
											return res || "Les mots de passe actuel incorrect";
										}
									},
								}}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Mot de passe actuel</FormLabel>
										<div className="col-span-3 relative">
											<FormControl>
												<Input type={showPassword ? "text" : "password"} {...field} className="pr-10" />
											</FormControl>
											{/* Afficher le message d'erreur personnalisé si showError est true */}
											{showErrorPsd && <p className="text-xs text-red-500 mt-1">Mot de passe non authentifié</p>}
											<FormMessage />

											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2"
											>
												{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
											</button>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="new_password"
								rules={{
									validate: (value) => {
										const currentPassword = form.getValues("current_password");
										if (value && !currentPassword) {
											return "Le mot de passe actuel est obligatoire";
										}
									},
								}}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Nouveau Mot de passe</FormLabel>
										<div className="col-span-3 relative">
											<FormControl>
												<Input type={showPassword ? "text" : "password"} {...field} className="pr-10" />
											</FormControl>
											<FormMessage />

											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2"
											>
												{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
											</button>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirm_password"
								rules={{
									validate: (value) => {
										const password = form.getValues("new_password");
										return value === password || "Les mots de passe ne correspondent pas";
									},
								}}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Confirmer mot de passe</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
					</Form>

					<DialogFooter>
						<Button variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button onClick={form.handleSubmit(onConfirm)}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<UserConfirmModal {...confirmForm} />
		</>
	);
}
