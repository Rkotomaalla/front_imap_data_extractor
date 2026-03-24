import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import Table, { type ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import type { Rule, Field, Operator } from "#/entity";
import { RuleModal, type RuleModalProps } from "./rule-modal";

type TableRule = {
	field?: string;
	operator?: string;
	value?: { value: string | string[] | number | undefined };
};

const DEFAULT_RULE_VALUE: Rule = {
	value: {
		value: "",
	},
};
type FormattedValue = {
	strValue: string;
	arrayValue: string | string[];
};

// Fonction utilitaire pour formater la valeur
const formatValue = (value: string | string[] | number | undefined, is_many?: boolean): FormattedValue | undefined => {
	if (value === undefined || value === null) return undefined;

	// Transforme les nombres en string
	let strValue: string = typeof value === "number" ? value.toString() : Array.isArray(value) ? value.join(" ") : value;
	let arrayValue: string | string[] = strValue;

	// Si c'est un champ multiple, on split et on formate
	if (is_many && typeof strValue === "string") {
		arrayValue = strValue.split(" ");
		strValue = strValue.replace(/ +/g, ";");
	}

	return {
		strValue,
		arrayValue,
	};
};
type Props = {
	RULES: Rule[];
	setRULES: React.Dispatch<React.SetStateAction<Rule[]>>;
};
export default function RuleTab({ RULES, setRULES }: Props) {
	const [rulesToShow, setRulesToShow] = useState<TableRule[]>([]);

	const [ruleModalProps, setRuleModalProps] = useState<RuleModalProps>({
		formValue: { ...DEFAULT_RULE_VALUE },
		title: "New",
		show: false,
		onOk: () => setRuleModalProps((prev) => ({ ...prev, show: false })),
		onCancel: () => setRuleModalProps((prev) => ({ ...prev, show: false })),
		rules: RULES,
	});
	const addRule = (rule: Rule, selectedField?: Field, selectedOperator?: Operator) => {
		if (!rule) return;

		const formatted = formatValue(rule.value?.value, selectedOperator?.many);
		if (!formatted) return; // si undefined, on quitte la fonction

		const { strValue, arrayValue } = formatted;

		const updatedRule: Rule = {
			...rule,
			value: {
				...rule.value,
				value: arrayValue,
			},
		};
		setRULES((prev) => [...prev, updatedRule]);
		const newLine: TableRule = {
			field: selectedField?.description,
			operator: selectedOperator?.description,
			value: { value: strValue },
		};
		setRulesToShow((prev) => [...prev, newLine]);
	};

	const columns: ColumnsType<TableRule> = [
		{ title: "Champ", dataIndex: "field" },
		{ title: "Operateur", dataIndex: "operator" },
		{ title: "Valeur(s)", dataIndex: "value", render: (val) => val.value },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record,index) => (
				<div className="flex w-full justify-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							// Convertir record.value?.value en string ou string[]
							const ruleValue = record.value?.value;
							const value: string | string[] = Array.isArray(ruleValue)
								? ruleValue
								: ruleValue !== undefined && ruleValue !== null
									? ruleValue.toString()
									: "";

							const rule: Rule = { value: { value } };
							onEdit(rule);
						}}
					>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(record,index)}
            >
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-red-500" />
					</Button>
				</div>
			),
		},
	];

	const onDelete = (record: TableRule, index: number) => {
		console.log("suppression de la règle:", record);

		setRulesToShow(prevRules =>
			prevRules.filter((_, i) => i !== index)
		);

		setRULES(prevRules =>
			prevRules.filter((_, i) => i !== index)
		);
	};
	
	const onCreate = () => {
		setRuleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Ajouter une règle",
			formValue: { ...DEFAULT_RULE_VALUE },
			rules: RULES,
		}));
	};

	const onEdit = (rule: Rule) => {
		setRuleModalProps((prev) => ({
			...prev,
			show: true,
			title: "Modifier la règle",
			formValue: rule,
			rules: RULES,
		}));
	};

	// useEffect(() => {
	// 	setRulesToShow(RULES);
	// }, [RULES]);
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>Liste des règles prédéfinies</div>
					<Button onClick={onCreate}>Ajouter une règle</Button>
				</div>
			</CardHeader>

			<CardContent>
				<Table
					rowKey="id"
					size="small"
					scroll={{ x: "max-content" }}
					pagination={false}
					columns={columns}
					dataSource={rulesToShow}
				/>
			</CardContent>

			<RuleModal
				{...ruleModalProps}
				// injecter addRule pour que RuleModal puisse l'utiliser
				addRule={addRule}
			/>
		</Card>
	);
}
