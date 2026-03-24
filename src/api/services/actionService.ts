import { Action, ActionList, ChildAction } from "@/types/entity";
import apiClient from "../apiClient";

export enum ActionApi{
  action = "/actions/",
}

const getList = () => apiClient.get<ActionList>({
  url: ActionApi.action
})

const getChildAction = (action_id: number) => apiClient.get<ChildAction>({
  url: `${ActionApi.action}${action_id}/child`
})

export default {
  getList,
  getChildAction
}