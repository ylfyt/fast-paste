import * as functions from 'firebase-functions';
import { IRoom } from '../../src/utils/interfaces';

functions.firestore.document('rooms/{roomId}').onUpdate(async (doc, ctx) => {
	const before = doc.before.data() as IRoom;
	const after = doc.after.data() as IRoom;

	if (before.pastes.length !== after.pastes.length && after.pastes.length > 0) {
		after.pastes[after.pastes.length - 1].text += ' 😅';
		await doc.after.ref.update({
			pastes: after.pastes,
		});
	}
});
