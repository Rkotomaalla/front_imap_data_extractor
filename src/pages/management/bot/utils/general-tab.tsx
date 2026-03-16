import { Card, CardContent } from "@/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import type { Bot } from "#/entity";
import { UseFormReturn } from "react-hook-form";

//{
//   "name": "Bot de test sujet filtre",
//   "descritpion": "Bot",
//   "filter": {
//     "name": "fILTER DES SUJETS",
//     "required_all": true,
//     "action": 1,
//     "rules": [
//       	{
// 					"field_id":4,
// 				 	"operator_id" : 1,
// 					"value": {
// 						"value" : ["test" , "manampy"]
// 				}
// 			}
//     ]
//   }
// }

type Props = {
	form: UseFormReturn<Bot>;
};

export default function GeneralTab({ form }: Props) {
	return (
		<div className="grid grid-cols-1 gap-4 ">
			<div className="col-span-1">
				<Card>
					<CardContent>
						<Form {...form}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="name"
									rules={{ required: "Libelé obligatoire" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Label du bot</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="mt-4">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description (optional) </FormLabel>
											<FormControl>
												<Textarea {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="mt-4">
								<FormField
									control={form.control}
									name="filter.name"
									rules={{ required: "Nom du filtre obligatoire" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nom du filtre </FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
