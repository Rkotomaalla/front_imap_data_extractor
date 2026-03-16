import type { NavItemDataProps } from "@/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { useUserRoles } from "@/store/userStore";
import { useMemo } from "react";
import { backendNavData } from "./nav-data-backend";
import { frontendNavData } from "./nav-data-frontend";

const navData = GLOBAL_CONFIG.routerMode === "backend" ? backendNavData : frontendNavData;

/**
 * 递归处理导航数据，过滤掉没有权限的项目
 * @param items 导航项目数组
 * @param permissions 权限列表
 * @returns 过滤后的导航项目数组
 */
const filterItems = (items: NavItemDataProps[], role: string) => {
	return items.filter((item) => {
		const hasPermission = item.auth ? item.auth == role : true;

		if (item.children?.length) {
			const filteredChildren = filterItems(item.children, role);
			// 如果子项目都被过滤掉了，则过滤掉当前项目
			if (filteredChildren.length === 0) {
				return false;
			}
			// 更新子项目
			item.children = filteredChildren;
		}

		return hasPermission;
	});
};

/**
 *
 * @param permissions
 * @returns
 */
const filterNavData = (permissions: string) => {
	return navData
		.map((group) => {
			const filteredItems = filterItems(group.items, permissions);

			if (filteredItems.length === 0) {
				return null;
			}

			return {
				...group,
				items: filteredItems,
			};
		})
		.filter((group): group is NonNullable<typeof group> => group !== null);
};

/**
 * Hook to get filtered navigation data based on user permissions
 * @returns Filtered navigation data
 */
export const useFilteredNavData = () => {
	const role = useUserRoles();
	const filteredNavData = useMemo(() => filterNavData(role), [role]);
	return filteredNavData;
};
