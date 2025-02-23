import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { selectUser, setUser } from '../state/userSlice';
import { store } from '../store';
import { debugLog } from '../utils/DebugLogger';

import User, { UserInterface } from '../types/User';
import { showToast } from '../utils/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

export async function fetchUser(id: string) {
  debugLog('USER MANAGER', `Fetching user with id: ${id}`);

  const userDoc = await firestore().collection('users').doc(id).get();

  debugLog('USER MANAGER', `User fetched, exists: ${userDoc.exists}`);

  if (!userDoc.exists) return null;

  return new User(id, { object: userDoc.data() as UserInterface });
}

export async function searchUsers(keyword: string) {
  debugLog('USER MANAGER', `Searching users with keyword: ${keyword}`);

  const users = await firestore()
    .collection('users')
    .where('username', '>=', keyword.toLowerCase())
    .where('username', '<=', keyword.toLowerCase() + '\uf8ff')
    .get();

  debugLog('USER MANAGER', `Users found: ${users.docs.length}`);

  return users.docs.map((d) => new User(d.id, { object: d.data() as UserInterface }));
}

export async function followUser(id: string) {
  debugLog('USER MANAGER', `Following user with id: ${id}`);

  const user = store.getState().user;

  const mutableUser = Object.assign({}, user.value) as UserInterface; // create a mutable copy of user

  let isFollowing = mutableUser.following.find((a) => a === id); // find existing activity for the book

  if (isFollowing) mutableUser.following = [...mutableUser.following.filter((a) => a !== id)];
  else {
    mutableUser.following = [...mutableUser.following, id]; // add new activity
  }

  await firestore().collection('users').doc(mutableUser.id).update({
    following: mutableUser.following, // update listened activities in firestore
  });

  if (isFollowing) debugLog('USER MANAGER', `Unfollowed user with id ${id}: ${mutableUser.following}`);
  else debugLog('USER MANAGER', `Followed user with id ${id}: ${mutableUser.following}`);

  store.dispatch(setUser(mutableUser)); // update user in redux store
}

export async function deleteUser() {
  const name = auth().currentUser?.displayName;

  // tries deleting,
  // if failed then most likely requires a reauth
  try {
    await auth().currentUser?.delete();
    await firestore().collection('users').doc(auth().currentUser?.uid).delete();

    await AsyncStorage.setItem('deleteOnAuthentication', 'false');
    showToast(`Doviđenja${name ? ` ${name.split(' ')[0]}` : ''}! Vaš EcoPal račun je uspješno obrisan.`);
  } catch {
    await AsyncStorage.setItem('deleteOnAuthentication', 'true');
    await auth().signOut();
    showToast('Molimo da se opet ulogujete kako biste obrisali svoj račun.');
  }
}

export async function updateUserValue(key: string, value: any) {
  debugLog('USER MANAGER', `Updating user ${key}...`);

  if (isNaN(value)) {
    debugLog('USER MANAGER', `Value is not valid: ${value}`);
    return;
  }

  const user = store.getState().user;

  const mutableUser = Object.assign({}, user.value) as UserInterface; // create a mutable copy of user

  await firestore()
    .collection('users')
    .doc(auth().currentUser!.uid)
    .update({
      [key]: value,
    });

  // @ts-ignore
  mutableUser[key] = value;
  store.dispatch(setUser(mutableUser));

  debugLog('USER MANAGER', `User ${key} updated: ${value}`);
}
