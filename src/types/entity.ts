import type { NavItemDataProps } from "@/components/nav/types";
import type { BasicStatus, PermissionType } from "./enum";

// User data interface
export interface UserToken {
	accessToken?: string;
	refreshToken?: string;
}
export interface UserTokens {
	access?: string;
	refresh?: string;
}

export interface UserData {
	uid_number?: number;
	full_name?: string;
	username?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	ldap_dn?: string;
	role?: string;
	is_active?: boolean;
	avatar?: string;
	password?: string;
	confirm_password?: string;
	departement?: string;
}

export interface UserUpdate {
	first_name?: string;
	last_name?: string;
	email?: string;
	departement?: string;
	role?: string;
	current_password?: string;
	new_password?: string;
	confirm_password?: string;
}

export interface UserList {
	success: boolean;
	count: number;
	data: UserData[];
}

export interface UserInfo {
	id: string;
	email: string;
	username: string;
	password?: string;
	avatar?: string;
	roles?: Role[];
	status?: BasicStatus;
	permissions?: Permission[];
	menu?: MenuTree[];
}
// +++

// interface pour la gestiond des regles
export interface Action{
	action_id:  number,
	action_label : string,
	need_attachment : boolean,
	child_actions? : number[]
}
export interface ActionList{
	success : boolean, 
	count : number ,
	results : Action []
}
export interface FormAction{
	parent_index ?:number,
	action_id?: number , 
	action_label? : string,
	value ?: string,
	child_action?:FormAction[]
}

export interface ChildAction{
	action_id : number, 
	action_label : string, 
	need_attachment : boolean,
	child_action ?: ChildDetail[] 
}

export interface ChildDetail{
	action_id : number, 
	action_label : string
}

export interface Directory{
	id ?: string,
	dir_id:number, 
	dir_label:string, 
	parents_dir? : number[],
	children?: Directory[]
}

export interface DirectoryList{
	success? : boolean,
	count ?: number, 
	results ?: Directory[]	
}

export interface Field {
	field_id: number;
	field_name: string;
	is_indexed: boolean;
	type: string;
	description: string;
}

export interface Operator {
	operator_id: number;
	description: string;
	many: boolean;
}

export interface Rule {
	field_id?: number;
	operator_id?: number;
	value?: {
		value: string | string[];
	};
}
export interface OperatorsByFieldId {
	count: number;
	"missing operator ids": number[];
	results: Operator[];
}
export interface FieldsList {
	count: number;
	page: number | null;
	page_size: number | null;
	results: Field[];
}

export interface Filter {
	name: string;
	required_all?: boolean;
	action?: number;
	rules: Rule[];
}
// +++
export interface BotAction{
	action_id?:number;
	value?: any
	sub_action? : BotAction[]
}

// entities des bots
export interface Bot {
	assigned_user_id?: number;
	bot_id?: number;
	name: string;
	description?: string;
	status?: number;
	created_date?: string;
	filter: Filter;
	actions?: BotAction []
}
export interface BotList {
	count: number;
	page: number;
	page_size: number;
	results: Bot[];
}
export interface StatusCount {
	status: number;
	total: number;
	libele: string;
}

export interface CountBot {
	data?: StatusCount[];
}
// +++

// entitites des Stats
export interface BotRanking {
	bot_id: number;
	name: string;
	count: number;
}

export interface MailCount {
	year: number;
	month: number;
	count: number;
}

export interface MailCountRes {
	results: MailCount[];
}

// entitte des notifications
export interface MailNotification {
	user_id: number;
	bot_id: string;
	mail_id: string;
	mail_subject: string;
	from: string;
	name: string;
	message: string;
	is_read: boolean;
	created_at: string;
}

export interface ConsoleNotification {
	type: number;
	message: string;
	user_id: number;
	bot_id: number;
	notified_at: string;
}

// entitites UTILS
export interface Department {
	name: string;
}

export interface DbConfig {
	id?: string;
	config_id?: number;
	name: string;
	port: number;
	host: string;
	db_name: string;
	username?: string;
	password?: string;
	version?: number;
	id_active?: boolean;
	created_at?: Date;
	created_by?: any;
	change_reason?: string;
}
// +++
export interface Permission_Old {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: BasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: URL;
	newFeature?: boolean;
	children?: Permission_Old[];
}

export interface Role_Old {
	id: string;
	name: string;
	code: string;
	status: BasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission_Old[];
}

export interface CommonOptions {
	status?: BasicStatus;
	desc?: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface User extends CommonOptions {
	id: string; // uuid
	username: string;
	password: string;
	email: string;
	phone?: string;
	avatar?: string;
}

export interface Role extends CommonOptions {
	id: string; // uuid
	name: string;
	code: string;
}

export interface Permission extends CommonOptions {
	id: string; // uuid
	name: string;
	code: string; // resource:action  example: "user-management:read"
}

export interface Menu extends CommonOptions, MenuMetaInfo {
	id: string; // uuid
	parentId: string;
	name: string;
	code: string;
	order?: number;
	type: PermissionType;
}

export type MenuMetaInfo = Partial<
	Pick<NavItemDataProps, "path" | "icon" | "caption" | "info" | "disabled" | "auth" | "hidden">
> & {
	externalLink?: URL;
	component?: string;
};

export type MenuTree = Menu & {
	children?: MenuTree[];
};
