import { initializeApp } from 'firebase/app';
import { getFirestore, collection, where, query } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { tap } from 'rxjs/operators';

const firebaseConfig = {
	apiKey: 'AIzaSyCHzUASBf-gcLLug4pkrfQfTlazHM2jWEE',
	authDomain: 'coba-firebase-9a008.firebaseapp.com',
	projectId: 'coba-firebase-9a008',
	storageBucket: 'coba-firebase-9a008.appspot.com',
	messagingSenderId: '1035839586311',
	appId: '1:1035839586311:web:5cab4452178659cce32aa2',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
