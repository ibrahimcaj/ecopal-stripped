import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { debugLog } from '../utils/DebugLogger';

export async function uploadImage(
  path: string,
  uri: string,
  onProgress: (progress: number, reference: FirebaseStorageTypes.Reference) => void
): Promise<FirebaseStorageTypes.Reference> {
  const reference = storage().ref(path);
  debugLog('STORAGE MANAGER', `Uploading image to ${path}...`);

  const task = reference.putFile(uri);
  task.on('state_changed', (taskSnapshot) => {
    const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
    onProgress(progress, reference);
  });

  await task;
  return reference;
}
