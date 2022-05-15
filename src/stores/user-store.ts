import type { User } from 'firebase/auth';
import getUserRoomId from '../utils/get-user-room-id';
import { writable } from 'svelte/store';

export const authUser = writable<User | null>(null);
export const userRoomId = writable<string | null>(null);
