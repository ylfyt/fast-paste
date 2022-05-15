import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCbTkw5RwYqlUzWSZAVcpV0bDTGTSxYIm4',
	authDomain: 'easy-paste.firebaseapp.com',
	projectId: 'easy-paste',
	storageBucket: 'easy-paste.appspot.com',
	messagingSenderId: '887256609466',
	appId: '1:887256609466:web:7f6ca07a2e80af496dc883',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
