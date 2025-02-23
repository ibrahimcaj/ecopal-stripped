// StepCounterTask.js
import { AppRegistry } from 'react-native';
import { startStepCounterUpdate, stopStepCounterUpdate, parseStepData } from '@dongminyu/react-native-step-counter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StepCounterTask = async () => {
  let lastStepCount = 0;

  const saveSteps = async (steps) => {
    try {
      await AsyncStorage.setItem('backgroundSteps', steps.toString());
    } catch (e) {
      console.error('Failed to save steps.', e);
    }
  };

  startStepCounterUpdate(new Date(), (data) => {
    const stepData = parseStepData(data);
    const steps = stepData.steps - lastStepCount;
    lastStepCount = stepData.steps;
    saveSteps(steps);
  });

  // Ensure to stop the step counter when the task ends
  return () => {
    stopStepCounterUpdate();
  };
};

AppRegistry.registerHeadlessTask('StepCounter', () => StepCounterTask);
