import { doc, setDoc } from 'firebase/firestore';

import { db } from './firebase';
import type { ICreateRoom, IRoom } from './interfaces';
import checkRoomExist from './check-room-exist';
import { customNanoid } from './custom-nanoid';

const createRoom = async (userId: string | null = null): Promise<ICreateRoom> => {
	const newRoomId = customNanoid();
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
