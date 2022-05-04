export type Paste = {
	id?: string;
	createAt: number;
	roomId: string;
	text: string;
};

export type Room = {
	id?: string;
	userId: string;
};
