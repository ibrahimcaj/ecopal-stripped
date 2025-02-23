import { useSelector } from 'react-redux';
import { updateUserValue } from './UserManager';
import { selectUser } from '../state/userSlice';
import User from '../types/User';

export async function checkLevelUp(user: User) {
  const baseThreshold = 100;
  const levelMultiplier = 1.2;

  let currentThreshold = baseThreshold * Math.pow(levelMultiplier, user.level - 1);

  if (user.xp >= currentThreshold) {
    const newLevel = Math.floor(user.xp / currentThreshold);
    await updateUserValue('level', newLevel);
  }
}
