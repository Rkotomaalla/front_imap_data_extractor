import { Textarea } from "@/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import { DatePicker } from "antd";
import { Input } from "@/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group";
import dayjs, { Dayjs } from "dayjs";
import type { Rule } from "#/entity";

type InputProps = {
	field: ControllerRenderProps<Rule, "value.value">;
	value?: Object;
	isDisabled?: boolean;
};

// --------------------
// Inputs individuels
// --------------------
export function DateInput({ field }: InputProps) {
	// ne garder que string, ignorer si c'est un tableau
	let dateValue: Dayjs | null = null;

	if (typeof field.value === "string") {
		const tmp = dayjs(field.value);
		dateValue = tmp.isValid() ? tmp : null;
	}

	return <DatePicker value={dateValue} onChange={(date) => field.onChange(date?.toISOString())} className="w-full" />;
}
export function BooleanInput({ field }: InputProps) {
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			value={field.value as string}
			onValueChange={(value) => {
				if (value !== "") {
					field.onChange(value);
				}
			}}
		>
			<ToggleGroupItem value="false">Non</ToggleGroupItem>
			<ToggleGroupItem value="true">Oui</ToggleGroupItem>
		</ToggleGroup>
	);
}
export function NumberInputField({ field }: InputProps) {
	return <Input type="number" {...field} />;
}

export function TextareaInput({ field, value }: InputProps) {
	return (
		<div className="relative flex items-start">
			{Array.isArray(value) && value.length > 0 && (
				<div className="absolute left-2 top-2 flex flex-wrap gap-1">
					{value
						.map((v) => v.trim())
						.filter(Boolean)
						.map((val, index) => (
							<span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
								{val}
							</span>
						))}
				</div>
			)}

			<Textarea
				{...field}
				rows={1}
				className={`resize-none overflow-hidden pt-10 ${Array.isArray(value) ? "text-transparent caret-black" : ""}`}
				onInput={(e) => {
					const target = e.currentTarget;
					target.style.height = "auto";
					target.style.height = target.scrollHeight + "px";
				}}
			/>
		</div>
	);
}

// --------------------
// Composant dynamique
// --------------------
type InputTypeProps = {
	type: string;
	field: ControllerRenderProps<Rule, "value.value">;
	value?: Object;
};

export function InputType({ type, field, value }: InputTypeProps) {
	switch (type) {
		case "string":
			return <TextareaInput field={field} value={value} />;
		case "date":
			return <DateInput field={field} />;
		case "number":
			return <NumberInputField field={field} />;
		case "boolean":
			return <BooleanInput field={field} />;
		default:
			return null;
	}
}
