import GeneralTab from "../utils/general-tab";
import RuleTab from "../utils/rule-tab";
import { Tabs, TabsContent } from "@/ui/tabs";
import { useForm } from "react-hook-form";
import type { Bot, BotAction, Rule } from "#/entity";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardFooter } from "@/ui/card";
import botService from "@/api/services/botService";
import { toast } from "sonner";
import ActionTab from "../utils/action-tab";

function BotCreate() {
	const form = useForm<Bot>({
		defaultValues: {},
	});
	const handleCreateBot = () => {
		try {
			// verifier si Rule non vide
			if (!RULES || RULES.length === 0) throw Error("Veuillez ajouter des Regles de filtrage");
			else if (!ACTIONS || ACTIONS.length === 0) throw Error("Veuillez ajouter des actions à traiter");
			else {
				// ajouter dans form les valeur des Rules
				form.setValue("filter.rules", RULES);
				form.setValue("actions",ACTIONS);
				// fonction d enregistrement
				const botData = JSON.stringify(form.getValues());
				console.log(botData + "");
				botService.saveBot(form.getValues());
				// si succes afffichage success
				toast.success("Bot Creer avec succes", { position: "top-center" });
			}
		} catch (err: unknown) {
			if (err instanceof Error) toast.error(err.message, { position: "top-center" });
			else toast.error("Une erreur inconnue est survenue", { position: "top-center" });
		}
	};
	
	const [RULES, setRULES] = useState<Rule[]>([]);

	const [ACTIONS, setACTIONS] = useState<BotAction[]>([]);
	useEffect(()=>{
		console.log("new ACTION");
		console.log(ACTIONS);
	},[ACTIONS])
	return (
		<Tabs defaultValue="1" orientation="vertical">
			<TabsContent value="1">
				<GeneralTab form={form} />
			</TabsContent>
			<TabsContent value="1">
				<RuleTab RULES={RULES} setRULES={setRULES} />
			</TabsContent>
			<TabsContent value="1">
				<ActionTab ACTIONS = {ACTIONS} setACTIONS={setACTIONS}/>
			</TabsContent>
			<TabsContent value="1">
				<div className="grid grid-cols-1 gap-4 ">
					<div className="col-span-1">
						<Card>
							<CardFooter className="flex justify-center">
								<Button onClick={form.handleSubmit(handleCreateBot)}>
									<strong>Créer le bot</strong>
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
export default BotCreate;
