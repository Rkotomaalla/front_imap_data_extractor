import { useParams } from "react-router";

import bannerImage from "@/assets/images/background/banner-1.png";
import { Icon } from "@/components/icon";
import { useUserData } from "@/store/userStore";
import { themeVars } from "@/theme/theme.css";
import { Avatar, AvatarImage } from "@/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Text, Title } from "@/ui/typography";
import { useEffect, useState, type CSSProperties } from "react";
import ProfileTab from "./profile-tab";
import botService from "@/api/services/botService";
import { LineLoading } from "@/components/loading";
import { Bot } from "@/types/entity";

function BotDetail() {
	const { id } = useParams();
	const [bot, setBot] = useState<Bot>();
	const [loading, setLoading] = useState(true);

	const { avatar, username, uid_number } = useUserData();

	useEffect(() => {
		botService
			.findById(id!)
			.then((data) => setBot(data))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) return <LineLoading />;
	if (!bot) return <div>Bot introuvable</div>;

	const bgStyle: CSSProperties = {
		position: "absolute",
		inset: 0,
		background: `url(${bannerImage})`,
		backgroundSize: "cover",
		backgroundPosition: "50%",
		backgroundRepeat: "no-repeat",
	};

	const tabs = [
		{
			icon: <Icon icon="solar:user-id-bold" size={24} className="mr-2" />,
			title: "Profile",
			content: <ProfileTab bot={bot} />,
		},
	];

	return (
		<Tabs defaultValue={tabs[0].title} className="w-full">
			<div className="relative flex flex-col justify-center items-center gap-4 p-4">
				<div style={bgStyle} className="h-full w-full z-1" />
				<div className="flex flex-col items-center justify-center gap-2 z-2">
					<Avatar className="h-24 w-24">
						<AvatarImage src={avatar} className="rounded-full" />
					</Avatar>
					<div className="flex flex-col justify-center items-center gap-2">
						<div className="flex items-center gap-2">
							<Title as="h5" className="text-xl">
								{bot.name}
							</Title>
							<Icon icon="heroicons:check-badge-solid" size={20} color={themeVars.colors.palette.primary.default} />
						</div>
						<Text variant="body2">bot {bot.bot_id}</Text>
					</div>
				</div>
				<TabsList className="z-5">
					{tabs.map((tab) => (
						<TabsTrigger key={tab.title} value={tab.title}>
							{tab.icon}
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
			</div>

			{tabs.map((tab) => (
				<TabsContent key={tab.title} value={tab.title}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}

export default BotDetail;
