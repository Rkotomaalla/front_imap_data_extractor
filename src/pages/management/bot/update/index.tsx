import GeneralTab from "../utils/general-tab";
import RuleTab from "../utils/rule-tab";
import { Tabs, TabsContent } from "@/ui/tabs";
import { useForm } from "react-hook-form";
import type { Bot, Rule } from "#/entity";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardFooter } from "@/ui/card";
import botService from "@/api/services/botService";
import { toast } from "sonner";
import { useParams } from "react-router";
import { LineLoading } from "@/components/loading";

function BotUpdate() {
	const { id } = useParams();
	const [bot, setBot] = useState<Bot>();
	const [loading, setLoading] = useState(true);
	const [RULES, setRULES] = useState<Rule[]>([]);

	useEffect(() => {
		botService
			.findById(Number(id!))
			.then((data) => {
				setBot(data);
				setRULES(data.filter.rules);
				form.reset(data); // ✅ met à jour le form avec les données du bot
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [id]);

	const form = useForm<Bot>({
		defaultValues: bot,
	});

	const handleUpdateBot = () => {
		try {
			// verifier si Rule non vide
			if (!RULES || RULES.length === 0) throw Error("Veuillez ajouter des Regles de filtrage");
			else {
				// ajouter dans form les valeur des Rules
				form.setValue("filter.rules", RULES);
				// fonction d enregistrement
				const botData = JSON.stringify(form.getValues());
				console.log(botData + "");
				botService.updateBot(Number(id), form.getValues());
				// si succes afffichage success
				toast.success("Bot modifié avec succes", { position: "top-center" });
			}
		} catch (err: unknown) {
			if (err instanceof Error) toast.error(err.message, { position: "top-center" });
			else toast.error("Une erreur inconnue est survenue", { position: "top-center" });
		}
	};
	if (loading) return <LineLoading />;
	if (!bot) return <div>Bot introuvable</div>;

	return (
		<Tabs defaultValue="1" orientation="vertical">
			<TabsContent value="1">
				<GeneralTab form={form} />
			</TabsContent>
			<TabsContent value="1">
				<RuleTab RULES={RULES} setRULES={setRULES} />
			</TabsContent>
			<TabsContent value="1">
				<div className="grid grid-cols-1 gap-4 ">
					<div className="col-span-1">
						<Card>
							<CardFooter className="flex justify-center">
								<Button onClick={form.handleSubmit(handleUpdateBot)}>
									<strong>Modifier le bot</strong>
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
export default BotUpdate;
