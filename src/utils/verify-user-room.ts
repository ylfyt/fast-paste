import { userRoomId } from '../stores/user-store';
import getUserRoomId from './get-user-room-id';

export default async function verifyUserRoom(uid: string): Promise<void> {
	try {
		userRoomId.set('');
		const roomId = await getUserRoomId(uid);
		// TODO: Create New Room if user room doesn't exist
		userRoomId.set(roomId === '' ? null : roomId);
	} catch (error) {
		userRoomId.set(null);
	}
}
