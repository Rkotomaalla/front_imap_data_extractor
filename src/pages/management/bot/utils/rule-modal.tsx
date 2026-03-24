import { useForm } from "react-hook-form";
import { TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import type { Rule, Field, OperatorsByFieldId, Operator } from "#/entity";
import filterService from "@/api/services/filterService";
import { toast } from "sonner";
import { InputType } from "./rule-modal-type";

export type RuleModalProps = {
	formValue: Rule;
	title: string;
	show: boolean;
	onOk: VoidFunction;
	onCancel: VoidFunction;
	addRule?: (rule: Rule, selectedField?: Field, selectedOperator?: Operator) => void; // injection
	rules: Rule[];
};

export function RuleModal({ title, show, formValue, onOk, onCancel, addRule, rules }: RuleModalProps) {
	const form = useForm<Rule>({ defaultValues: formValue });

	const [allFields, setAllFields] = useState<Field[]>([]); // tous les champs du serveur
	// les details des ID selectionnes
	const [selectedField, setSelectedField] = useState<Field>();
	const [selectedOperator, setSelectedOperator] = useState<Operator>();

	// les attributs utilisée dans le formulaire
	const [fields, setFields] = useState<Field[]>([]);
	const [operators, setOperators] = useState<Operator[]>([]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [value, setValue] = useState<string | string[] | undefined>("");

	const selectedFieldId = form.watch("field_id");
	const selectedOperatorId = form.watch("operator_id");
	const inputedValue = form.watch("value.value");

	const checkValidForm = (): boolean => {
		try {
			const field_id = form.getValues("field_id");
			const operator_id = form.getValues("operator_id");
			const value = form.getValues("value.value");

			if (!field_id) throw new Error("Veuillez choisir le champ");
			if (field_id !== selectedField?.field_id) throw new Error("Valeur du champ invalide par un conflit");
			if (operator_id !== selectedOperator?.operator_id)
				throw new Error("valeur de l'operateur invalide par un conflit");
			if (selectedField?.is_indexed === true && operator_id) throw new Error("Aucun operateur requis pour ce champ");
			if (selectedField?.is_indexed === false && operator_id === undefined) throw new Error("Operateur non defini");

			if (!value || (Array.isArray(value) && value.length === 0)) throw new Error("La valeur ne doit pas être vide");
			return true;
		} catch (err: unknown) {
			if (err instanceof Error) toast.error(err.message, { position: "top-center" });
			else toast.error("Une erreur inconnue est survenue", { position: "top-center" });
			throw err;
		}
	};

	// Charger les fields
  // initialisation des donnes au premier recharge de lȧpage
	useEffect(() => {
		const loadFields = async () => {
			try {
				const fieldsList = await filterService.getAllFields();
				setAllFields(fieldsList.results);
			} catch (err) {
				console.error(err);
			}
		};
		loadFields();
	}, []);

	useEffect(() => {
		const field_ids = new Set(rules.map((r) => r.field_id));
		const availableFields = allFields.filter((f) => !field_ids.has(f.field_id));
		setFields(availableFields);
	}, [rules, allFields]);

	// Charger les operators selon le champ sélectionné
	useEffect(() => {
		if (!selectedFieldId) return;

		//changement du champ selectionné
		const field = fields.find((f) => f.field_id === selectedFieldId);
		setSelectedField(field);

		setOperators([]);
		if (!field || field.is_indexed) {
			setIsDisabled(true);
			return;
		}

		const loadOperators = async () => {
			try {
				setIsDisabled(false);
				const operatorsList: OperatorsByFieldId = await filterService.getFieldOperators(selectedFieldId);
				const operator_ids = new Set(
					rules.filter((rule) => rule.field_id === selectedFieldId).map((item) => item.operator_id),
				);
				const ops = operatorsList?.results?.filter((item) => !operator_ids.has(item.operator_id)) ?? [];

				setOperators(ops);
			} catch (err) {
				console.error(err);
			}
		};

		loadOperators();
	}, [selectedFieldId]);

	useEffect(() => {
		// remise par default de certaines valeurs
		form.setValue("operator_id", undefined);
		form.setValue("value.value", "");
		setSelectedOperator(undefined);
	}, [rules, selectedFieldId]);

	// Surveiller l'opérateur sélectionné
	useEffect(() => {
		if (!selectedOperatorId) return;
		form.setValue("value.value", "");
		const op = operators.find((op) => op.operator_id === selectedOperatorId);
		setSelectedOperator(op);
	}, [selectedOperatorId]);

	// Surveiller la valeur saisie
	useEffect(() => {
		if (!inputedValue) return;
		if (selectedOperator?.many) {
			setValue(typeof inputedValue === "string" ? inputedValue.split(" ").filter(Boolean) : inputedValue);
		} else {
			setValue(inputedValue.toString());
		}
	}, [inputedValue, selectedOperator]);

	// Reset formulaire si formValue change
	useEffect(() => {
		form.reset(formValue);
	}, [formValue, form]);

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="field_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Champ</FormLabel>
									<FormControl>
										<TreeSelect
											fieldNames={{ label: "description", value: "field_id" }}
											allowClear
											treeData={fields}
											value={field.value}
											onChange={field.onChange}
											getPopupContainer={() => document.body}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="operator_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Opérateur</FormLabel>
									<FormControl className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
										<TreeSelect
											fieldNames={{ label: "description", value: "operator_id" }}
											treeData={operators}
											value={field.value}
											onChange={field.onChange}
											disabled={isDisabled}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="value.value"
							render={({ field }) => (
								<FormItem className="grid grid-cols-4 items-center gap-4">
									<FormLabel className="text-right">Valeur</FormLabel>
									<div className="col-span-3">
										<FormControl>
											<InputType type={selectedField?.type ?? "string"} field={field} value={value} />
										</FormControl>
									</div>
								</FormItem>
							)}
						/>
					</div>
				</Form>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Annuler
					</Button>
					<Button
						onClick={() => {
							form.handleSubmit((data) => {
								if (checkValidForm()) {
									addRule?.(data, selectedField, selectedOperator);
									onOk?.();
								}
							})();
						}}
					>
						Ajouter la règle
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
