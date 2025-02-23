import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ScrollView,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { LayoutView } from '../views/LayoutView';
import { FontsStyles } from '../Styles';
import GlobalContext from '../GlobalContext';
import { uploadImage } from '../managers/StorageManager';
import { selectUser } from '../state/userSlice';
import Quest, { QuestInterface } from '../types/Quest';
import messaging from '@react-native-firebase/messaging';
import COLORS from '../utils/constants/COLORS';
import HeaderBar from '../components/HeaderBar';
import { BackIcon } from '../icons/BackIcon';
import { Confetti } from 'react-native-fast-confetti';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
import { assertionCheck, electricBillScan, recycleSuggestion } from '../managers/APIManager';
import { QUEST_ASSERTIONS, QUESTS } from '../utils/constants/QUESTS';
import { checkLevelUp } from '../managers/XPManager';
import { updateUserValue } from '../managers/UserManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuestScreenRouteParams {
  questId: string;
  onComplete?: () => void;
}

export const QuestScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation, route }) => {
  const { questId, onComplete } = route.params as QuestScreenRouteParams;
  const quest = QUESTS.find((q) => q.id === questId);
  if (!quest) {
    return (
      <LayoutView style={{ padding: 0 }}>
        <HeaderBar
          actions={true}
          title="Quest"
          backOnPress={() => navigation.goBack()}
          primaryActionIcon={<BackIcon size={32} />}
        />
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[FontsStyles.weightBold, FontsStyles.h2]}>Quest not found</Text>
        </View>
      </LayoutView>
    );
  }

  useEffect(() => {
    console.log(messaging().getToken().then(console.log));
    // AsyncStorage.clear();
  });

  const context = useContext(GlobalContext);
  const user = useSelector(selectUser);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [readingResult, setReadingResult] = useState<any | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;

  const rotation = useRef(new Animated.Value(0)).current;
  const interpolatedRotation = rotation.interpolate({
    inputRange: [0, 3],
    outputRange: ['3deg', '-2deg'],
  });

  const handleTakePicture = () => {
    navigation.navigate('/camera', {
      cta: 'Skeniraj',
      onPictureTaken: (uri: string) => {
        setPhotoUri(uri);
      },
    });
  };

  const handleQuestCompletion = async (reference: FirebaseStorageTypes.Reference) => {
    const today = new Date().toISOString().split('T')[0];
    const questCompletedToday = context.completedQuests.find((q: any) => q.id === quest.id && q.date === today);
    if (questCompletedToday) {
      console.log('Quest already completed today');
      return;
    }

    let reading;
    switch (quest.assertionType) {
      case QUEST_ASSERTIONS.ELECTRIC_BILL:
      case QUEST_ASSERTIONS.WATER_BILL:
        reading = await electricBillScan(reference.fullPath);
        setReadingResult(reading.energyBillReading);
        break;
      case QUEST_ASSERTIONS.ASSERTION:
        reading = await assertionCheck(reference.fullPath, quest.assertion!);
        setReadingResult(Object.values(reading)[0]);
        break;
      case QUEST_ASSERTIONS.RECYCLE_INQUIRY:
        reading = await recycleSuggestion(reference.fullPath);
        setReadingResult(Object.values(reading)[0]);
        break;
      default:
        break;
    }
    console.log('aaa', readingResult);
  };

  useEffect(() => {
    if (!readingResult) return;

    (async () => {
      const today = new Date().toISOString().split('T')[0];

      // save completed quest to AsyncStorage if valid
      if (readingResult.validan_racun || readingResult.tvrdnja_validna) {
        Animated.timing(rotation, {
          toValue: 3,
          duration: 250,
          useNativeDriver: true,
        }).start();

        setUploading(false);
        setCompleted(true);

        // adds xp to the user
        console.log('q', quest.award);
        await updateUserValue('xp', user.value.xp + quest.award);
        checkLevelUp(user.value);

        const updatedCompletedQuests = [...context.completedQuests, { id: quest.id, date: today }];
        await AsyncStorage.setItem('completedQuests', JSON.stringify(updatedCompletedQuests));
        context.setCompletedQuests(updatedCompletedQuests);

        // Call the onComplete callback
        if (onComplete) {
          onComplete();
        }
      }
    })();
  }, [readingResult]);

  useEffect(() => {
    if (photoUri) {
      setUploading(true);
      uploadImage(`quests/${user.value.id}/${Date.now()}.jpg`, photoUri, (progress, url) => {
        setProgress(progress);

        Animated.timing(opacity, {
          toValue: progress / 100,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }).then(async (reference) => {
        handleQuestCompletion(reference);
      });
    }
  }, [photoUri]);

  const renderBillReading = () => {
    if (readingResult === null) return null;
    if (
      quest.assertionType === QUEST_ASSERTIONS.RECYCLE_INQUIRY ||
      readingResult.validan_racun ||
      readingResult.tvrdnja_validna
    ) {
      return (
        <Animated.View
          key="reading"
          style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            marginTop: 16,
            opacity: 1,
            transform: [{ rotate: interpolatedRotation }],
          }}>
          {(() => {
            switch (quest.assertionType) {
              case QUEST_ASSERTIONS.WATER_BILL:
              case QUEST_ASSERTIONS.ELECTRIC_BILL:
                return (
                  <>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center' }]}>
                      Vaš račun na {readingResult.datum_racuna}:
                    </Text>
                    <Text style={[FontsStyles.weightBold, FontsStyles.h2, { textAlign: 'center' }]}>
                      {readingResult.iznos_racuna} KM
                    </Text>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center' }]}>
                      Wooo! Osvojili ste {quest.award}
                    </Text>
                  </>
                );
              case QUEST_ASSERTIONS.ASSERTION:
                return (
                  <>
                    <Text style={[FontsStyles.weightBold, FontsStyles.h3, { textAlign: 'center' }]}>WOOOOO!</Text>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center' }]}>
                      Osvojili ste {quest.award} XP!!!
                    </Text>
                  </>
                );
              case QUEST_ASSERTIONS.RECYCLE_INQUIRY:
                return (
                  <>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center', marginBottom: 16 }]}>
                      {readingResult.naziv_predmeta}{' '}
                      {readingResult.moze_reciklirati ? 'se može reciklirati!' : 'se ne može reciklirati...'}
                    </Text>

                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>
                      <Text style={[FontsStyles.weightMedium]}>Materijal:</Text> {readingResult.materijal}
                    </Text>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>
                      <Text style={[FontsStyles.weightMedium]}>Metoda reciklaže:</Text> {readingResult.metoda_reciklaze}
                    </Text>
                    <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>
                      <Text style={[FontsStyles.weightMedium]}>Lokacija reciklaže:</Text>{' '}
                      {readingResult.lokacija_reciklaze}
                    </Text>

                    <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center' }]}>
                      Osvojili ste {quest.award} XP!
                    </Text>
                  </>
                );
            }
          })()}
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          key="reading"
          style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: '#ffcccc',
            borderRadius: 16,
            marginTop: 16,
            opacity: 1,
            transform: [{ rotate: interpolatedRotation }],
          }}>
          <Text style={[FontsStyles.weightLight, FontsStyles.h3, { textAlign: 'center' }]}>
            Vaša slika nije validna.
          </Text>
        </Animated.View>
      );
    }
  };

  return (
    <LayoutView style={{ padding: 0 }}>
      <HeaderBar
        actions={true}
        title="Quest"
        backOnPress={() => navigation.goBack()}
        primaryActionIcon={<BackIcon size={32} />}
      />

      <View style={{ width: '100%', height: '100%', justifyContent: 'center', gap: 8, paddingHorizontal: 32 }}>
        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: COLORS.secondary,
            borderRadius: 16,
          }}>
          <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>{quest.title}</Text>
          <Text style={[FontsStyles.weightBold, FontsStyles.h2]}>{quest.description}</Text>
          <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>Nagrada: {quest.award} XP</Text>

          {!uploading && !completed && (
            <TouchableOpacity
              onPress={handleTakePicture}
              style={{
                padding: 16,
                backgroundColor: COLORS.primary,
                borderRadius: 16,
                marginTop: 16,
              }}>
              <Text style={[FontsStyles.weightMedium, FontsStyles.h3, { textAlign: 'center' }]}>Skeniraj</Text>
            </TouchableOpacity>
          )}
        </View>

        {completed && readingResult?.validan_racun && (
          <Confetti
            width={useWindowDimensions().width}
            isInfinite={false}
          />
        )}

        {photoUri && (
          <View
            style={{
              borderRadius: 16,
              backgroundColor: COLORS.secondary,
            }}>
            <ActivityIndicator
              size={32}
              style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
            />
            <Animated.Image
              source={{ uri: photoUri }}
              style={{ width: '100%', height: 200, borderRadius: 16, opacity }}
            />
          </View>
        )}

        {renderBillReading()}
      </View>
    </LayoutView>
  );
};
