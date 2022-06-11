export interface IPaste {
	id: string;
	createAt: number;
	text: string; // DOWNLOAD URL FILE
	isFile?: boolean;
	filename?: string;
	originalFilename?: string;
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
