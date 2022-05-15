import { getDocs, query, where, collection } from 'firebase/firestore';

import { db } from './firebase';

export default async function getUserRoomId(userId: string): Promise<string> {
	try {
		const q = query(collection(db, 'rooms'), where('userId', '==', userId));
		const roomSnap = await getDocs(q);
		return roomSnap.empty ? '' : roomSnap.docs[0].id;
	} catch (error) {
		console.log(error.message);
		return '';
	}
}
