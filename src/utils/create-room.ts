import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { db } from './firebase';
import type { ICreateRoom, IRoom } from './interfaces';
import checkRoomExist from './check-room-exist';

const createRoom = async (userId: string | null = null): Promise<ICreateRoom> => {
	const newRoomId = nanoid(6);
	const exist = await checkRoomExist(newRoomId);
	if (exist) {
		return {
			error: 'Failed to create new Room. Try Again!',
			roomId: '',
		};
	}
	const newRoom: IRoom = {
		pastes: [],
		userId: userId ?? '',
	};
	const roomRef = doc(db, 'rooms', newRoomId);
	try {
		await setDoc(roomRef, newRoom);
		return {
			error: '',
			roomId: newRoomId,
		};
	} catch (error) {
		return {
			error: 'Failed to create new Room. Try Again!',
			roomId: '',
		};
	}
};

export default createRoom;
