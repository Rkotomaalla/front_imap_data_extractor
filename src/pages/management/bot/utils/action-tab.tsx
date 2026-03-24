import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { ActionModal, ActionModalProps } from "./action-modal";
import { BotAction, FormAction } from "@/types/entity";
import { toast } from "sonner";
import { produce } from "immer";
import { TableAction } from "antd/es/table/interface";

type ActionTable = {
  parent_index?:number;
  action_id?: number;
  action_label?: string;
  value?: string;
  child_action?: ActionTable[];
};

const DEFAULT_ACTION_VALUE: FormAction = {
  action_id: undefined,
  action_label: "",
  value: "",
  child_action: [],
};

type Props = {
  ACTIONS : BotAction[];
  setACTIONS: React.Dispatch<React.SetStateAction<BotAction[]>>;
}

export default function ActionTab({ACTIONS, setACTIONS} : Props) {
  const currentIndexRef = useRef<number | undefined>(undefined);
  const [actionList, setActionList] = useState<ActionTable[]>([]);

  const handleAddAction = (formValue: FormAction) => {
    try {
      const NewAction : BotAction = {
        action_id : formValue.action_id,
        value : formValue.value
      } 
      const index = currentIndexRef.current;
      if (index !== undefined) {
        formValue.parent_index = index;
        setACTIONS((prev) => {
          const newList = [...prev];
          const parentAction = {...newList[index]};
          parentAction.sub_action = [...(parentAction.sub_action || []), NewAction];
          newList[index] = parentAction;
          return newList;
        });
        setActionList((prev) => {
          const newList = [...prev];
          const parentAction = { ...newList[index] };
          parentAction.child_action = [...(parentAction.child_action || []), formValue];
          newList[index] = parentAction;
          return newList;
        });
      } else {
        setACTIONS((prev) => [...prev, NewAction]);
        setActionList((prev) => [...prev, formValue]);
      }
      currentIndexRef.current = undefined;
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'action");
    }
  };

  const [actionModalProps, setActionModalProps] = useState<ActionModalProps>({
    formValue: DEFAULT_ACTION_VALUE,
    title: "Nouvelle action",
    show: false,
    onOk: (formValue: FormAction) => {
      handleAddAction(formValue);
      setActionModalProps((prev) => ({ ...prev, show: false }));
    },
    onCancel: () => {
      setActionModalProps((prev) => ({ ...prev, show: false }));
      currentIndexRef.current = undefined;
    },
  });

  const handleDelete = (record: ActionTable, index: number) => {
    setACTIONS((prev) => {
      if (record.parent_index !== undefined || record.parent_index) {
        return prev.map((item, i) => {
          if (i === record.parent_index){
            return {
              ...item, 
              child : item.sub_action?.filter(
                (_, childIndex) => childIndex !== index
              ) || [],
            }
          }
          return item;
        });
      }     // 🔹 Cas : suppression d’un parent
      return prev.filter((_, i) => i !== index);
    });
    setActionList((prev) => {
      // 🔹 Cas : suppression d’un enfant
      if (record.parent_index !== undefined || record.parent_index) {
        return prev.map((item, i) => {
          if (i === record.parent_index) {
            return {
              ...item,
              child_action: item.child_action?.filter(
                (_, childIndex) => childIndex !== index
              ) || [],
            };
          }
          return item;
        });
      }
      // 🔹 Cas : suppression d’un parent
      return prev.filter((_, i) => i !== index);
    });
  };

  const onCreate = () => {
    currentIndexRef.current = undefined;
    setActionModalProps((prev) => ({
      ...prev,
      show: true,
      formValue: DEFAULT_ACTION_VALUE,
      title: "Nouvelle action",
    }));
  };

  // Colonnes pour les actions principales
  const mainColumns: ColumnsType<ActionTable> = [
    { title: "Action", dataIndex: "action_label", key: "action_label" },
    { title: "Valeur", dataIndex: "value", key: "value" },
    {
      title: "Actions",
      key: "operation",
      align: "center",
      width: 100,
      render: (_, record, index) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              currentIndexRef.current = index;
              setActionModalProps((prev) => ({
                ...prev,
                show: true,
                formValue: DEFAULT_ACTION_VALUE,
                title: "Ajouter une sous-action",
              }));
            }}
          >
            <Icon icon="mingcute:add-fill" size={18} className="text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              currentIndexRef.current = index;
              setActionModalProps((prev) => ({
                ...prev,
                show: true,
                formValue: record,
                title: "Modifier l'action",
              }));
            }}
          >
            <Icon icon="solar:pen-bold-duotone" size={18} className="text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(record,index)}
          >
            <Icon icon="mingcute:delete-2-fill" size={18} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  // Colonnes pour les sous-actions (sans l'icône "Ajouter" et sans en-tête)
  const childColumns: ColumnsType<ActionTable> = [
    { dataIndex: "action_label", key: "action_label", render: (text) => <span className="pl-6">{text}</span> },
    { dataIndex: "value", key: "value" },
    {
      key: "operation",
      align: "center",
      width: 80,
      render: (_, record, index) => (
        <div className="flex justify-center gap-2">
          {/* a decommenter au cas ou c est pas le bon */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              currentIndexRef.current = index;
              setActionModalProps((prev) => ({
                ...prev,
                show: true,
                formValue: record,
                title: "Modifier la sous-action",
              }));
            }}
          >
            <Icon icon="solar:pen-bold-duotone" size={18} className="text-blue-500" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(record,index)}
          >
            <Icon icon="mingcute:delete-2-fill" size={18} className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    console.log("actionList mis à jour :", actionList);
  }, [actionList]);

  return (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>Liste des actions prédéfinies</div>
        <Button onClick={onCreate} >
          Ajouter une nouvelle action
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Table
        rowKey="action_id"
        size="small"
        bordered={false}
        scroll={{ x: "max-content" }}
        pagination={false}
        columns={mainColumns}
        dataSource={actionList}
        expandable={{
          rowExpandable: (record) => !!record.child_action?.length,
          expandedRowRender: (record) => (
            <Table
              rowKey="action_id"
              size="small"
              bordered={false}
              showHeader={false}
              className="bg-blue-50"  // 👈 Fond bleu très clair pour les sous-actions
              scroll={{ x: "max-content" }}
              pagination={false}
              columns={childColumns}
              dataSource={record.child_action}
            />
          ),
          expandIcon: ({ expanded, onExpand, record }) =>
            record.child_action?.length ? (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100"
                onClick={(e) => onExpand(record, e)}
              >
                <Icon icon={expanded ? "mingcute:up-fill" : "mingcute:down-fill"} size={16} className="text-gray-600" />
              </Button>
            ) : (
              <span style={{ width: 24 }} />
            ),
        }}
      />
    </CardContent>
    <ActionModal {...actionModalProps} />
  </Card>
);
}
