import { userRoomId } from '../stores/user-store';
import createRoom from './create-room';
import getUserRoomId from './get-user-room-id';

export default async function verifyUserRoom(uid: string): Promise<void> {
	try {
		userRoomId.set('');
		let id = await getUserRoomId(uid);
		if (id === '') {
			const { roomId } = await createRoom(uid);
			id = roomId;
		}
		userRoomId.set(id === '' ? null : id);
	} catch (error) {
		userRoomId.set(null);
	}
}
