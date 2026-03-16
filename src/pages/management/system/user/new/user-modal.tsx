import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

import type { Department, UserData } from "#/entity";
import { TreeSelect } from "antd";
import utilsService from "@/api/services/utilsService";

import { Eye, EyeOff } from "lucide-react";
import UserConfirmModal, { UserConfirmModalProps } from "./confirm-modal";
import userService from "@/api/services/userService";
import { toast } from "sonner";

// Types =============================
export type UserModalProps = {
	formValue: UserData;
	title: string;
	show: boolean;
	onCancel: VoidFunction;
	newUser: VoidFunction;
};

// function out =============================
//
export function UserModal({ title, show, formValue, newUser, onCancel }: UserModalProps) {
	const [confirmForm, setConfirmForm] = useState<UserConfirmModalProps>({
		formData: {},
		title: "Confirmation Creation d'utilisateur",
		show: false,
		onConfirm: () => {
			handleCreateUser();
			newUser();
		},
		onCancel: () => {
			setConfirmForm((prev) => ({ ...prev, show: false }));
		},
	});

	const [showPassword, setShowPassword] = useState(false);
	const [departements, setDepartements] = useState<Department[]>([]);

	// Dans le composant parent
	const form = useForm<UserData>({
		defaultValues: formValue,
	});

	// Functions ==================================
	const handleCreateUser = form.handleSubmit(async (data: UserData) => {
		try {
			const result = await userService.saveUser(data);

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

	const onConfirm = (data: UserData) => {
		setConfirmForm((prev) => ({
			...prev,
			show: true,
			formData: data,
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
								name="first_name"
								rules={{ required: "Prénom obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Prénom</FormLabel>
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
								name="last_name"
								rules={{ required: "Nom obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Nom</FormLabel>
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
								name="email"
								rules={{ required: "Email obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Email</FormLabel>
										<div className="col-span-3">
											<FormControl>
												<Input type="email" {...field} />
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
								name="password"
								rules={{ required: "Mot de passe obligatoire" }}
								render={({ field }) => (
									<FormItem className="grid grid-cols-4 items-center gap-4">
										<FormLabel className="text-right">Mot de passe</FormLabel>
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
									required: "Confirmation du mot de passe obligatoire",
									validate: (value) => {
										const password = form.getValues("password");
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
