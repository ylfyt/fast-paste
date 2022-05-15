import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const checkRoomExist = async (newRoomId: string): Promise<boolean> => {
	try {
		const roomDocRef = doc(db, 'rooms', newRoomId);
		const roomSnap = await getDoc(roomDocRef);
		return roomSnap.exists();
	} catch (error) {
		return true;
	}
};

export default checkRoomExist;
