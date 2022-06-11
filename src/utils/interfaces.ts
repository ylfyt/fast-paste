export interface IPaste {
	id: string;
	createAt: number;
	text: string;
	isFile?: boolean;
	filename?: string;
}

export interface IRoom {
	id?: string;
	userId: string;
	pastes: IPaste[];
}

export interface ICreateRoom {
	error: string;
	roomId: string;
}
