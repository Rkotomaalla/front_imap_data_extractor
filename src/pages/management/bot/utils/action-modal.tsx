import actionService from "@/api/services/actionService";
import { Action, FormAction } from "@/types/entity";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input"; // Assurez-vous d'importer Input
import { AutoComplete, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputType } from "./rule-modal-type";
import { InputActionValue } from "./action-modal-type";
import { toast } from "sonner";

const attachementTypeList = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
  "jpg", "jpeg", "png", "gif", "svg", "mp3", "wav", "mp4", "avi",
  "mov", "zip", "rar", "7z", "json", "xml", "html", "css", "js",
  "ts", "md", "epub", "odt", "ods", "odp"
];

export type ActionModalProps = {
  formValue: FormAction;
  title: string;
  show: boolean;
  onOk: (data: FormAction , child_action?: FormAction) => void;
  onCancel: VoidFunction;
  action ?: FormAction
};

export function ActionModal({ title, show, formValue, onOk, onCancel,action }: ActionModalProps) {
  const form = useForm<FormAction>({ defaultValues: formValue });
  const [allActions, setAllActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string | string[] | undefined>("");
  
	const checkValidForm = (data : FormAction): boolean => {
    try{
			const action_id = data.action_id;
      const value = data.value;
      if(!action_id) throw new Error("Veuillez choisir l'action")
      if (action_id !== 2   && !value){
        throw new Error("Valeur obligatoire")
      }
      return true;
    }catch(err : unknown){
      if (err instanceof Error) toast.error(err.message, { position: "top-center" });
			else toast.error("Une erreur inconnue est survenue", { position: "top-center" });
			throw err;
    }
  };
  // Chargement initial des actions
  useEffect(() => {
    const loadActions = async () => {
      try {
        const actionList = await actionService.getList();
        console.log(actionList);
        setAllActions(actionList.results);
      } catch (err) {
        console.error(err);
        setError("Échec du chargement des actions.");
      } finally {
        setIsLoading(false);
      }
    };
    loadActions();
  }, []);

  // Réinitialisation du formulaire si formValue change
  useEffect(() => {
    form.reset(formValue);
  }, [formValue, form]);

  // Soumission du formulaire
  const onSubmit = (data: FormAction) => {
    if (checkValidForm(data)){
      onOk(data,action);
    }
  };
  return (
    <Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <TreeSelect
                      fieldNames={{ label: "action_label", value: "action_id" }} // Corrigez ici
                      allowClear
                      treeData={allActions}
                      value={field.value}
                      onChange={(value, label, extra) => {
                        field.onChange(value);
                        // Récupérer le label de l'action sélectionnée
                        const selectedAction = allActions.find(a => a.action_id === value);
                        form.setValue("action_label", selectedAction?.action_label ?? "");
                      }}
                      getPopupContainer={() => document.body}
                      loading={isLoading}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <InputActionValue form={form}/>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onCancel} type="button">
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Chargement..." : "Ajouter l'action"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
