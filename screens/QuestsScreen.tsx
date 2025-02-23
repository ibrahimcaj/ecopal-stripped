import React, { useContext, useEffect, useRef, useState } from 'react';
import * as Progress from 'react-native-progress';
import {
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Touchable,
} from 'react-native';
import { LayoutView } from '../views/LayoutView';
import HeaderBar from '../components/HeaderBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { FontsStyles } from '../Styles';
import { TrophyIcon } from '../icons/TrophyIcon';
import COLORS from '../utils/constants/COLORS';
import { selectUser } from '../state/userSlice';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'react-native-svg';
import { BackIcon } from '../icons/BackIcon';
import { fetchAirQuality } from '../managers/APIManager';
import GlobalContext from '../GlobalContext';
import { SparklesIcon } from '../icons/SparklesIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { CommentIcon } from '../icons/CommentIcon';
import { togglePostLike } from '../managers/PostManager';
import { ProfilePicture } from '../components/ProfilePicture';
import timeFormat from '../utils/timeFormat';
import { relativeTimeFormat } from '../utils/relativeTimeFormat';
import { PostComment } from '../types/PostComment';
import PostComponent from '../components/PostComponent';
import Quest, { QuestInterface } from '../types/Quest';
import { QUESTS } from '../utils/constants/QUESTS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDailyQuest, getMonthlyBillQuest } from '../utils/constants/QUESTS';
import { updateUserValue } from '../managers/UserManager';

const FeedCard = ({
  title,
  subtitle,
  style,
  color = COLORS.secondary,
  onPress = () => {},
  showArrow = true,
  completed = false,
}: {
  title: string;
  subtitle: string;
  style?: any;
  color?: string;
  onPress?: () => void;
  showArrow?: boolean;
  completed?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: completed ? COLORS.secondary : color,
          borderRadius: 16,
        },
        style,
      ]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}>
        <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>{title}</Text>
        <Text style={[FontsStyles.weightBold, FontsStyles.h2]}>{subtitle}</Text>
        {completed && <Text style={[FontsStyles.weightLight, FontsStyles.h3]}>Completed</Text>}
      </View>
      {showArrow && (
        <BackIcon
          size={32}
          style={{ transform: [{ rotate: '180deg' }] }}
        />
      )}
    </TouchableOpacity>
  );
};

export const QuestsScreen: React.FC<NativeStackScreenProps<any, any>> = ({ navigation }) => {
  const user = useSelector(selectUser);
  const [pollution, setPollution] = useState<number | null>(null);
  const [dailyQuest, setDailyQuest] = useState<QuestInterface | null>(null);
  const [monthlyBillQuest, setMonthlyBillQuest] = useState<QuestInterface | null>(null);
  const [lastDailyQuestTimestamp, setLastDailyQuestTimestamp] = useState<number | null>(null);
  const [xpAwarded, setXpAwarded] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const context = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      const pollution = await fetchAirQuality(user.value.city);
      setPollution(pollution);
    })();

    // AsyncStorage.clear();
    // console.log('CLEARED');
  }, []);

  useEffect(() => {
    (async () => {
      const storedCompletedQuests = await AsyncStorage.getItem('completedQuests');
      const completedQuests = storedCompletedQuests ? JSON.parse(storedCompletedQuests) : [];
      context.setCompletedQuests(completedQuests);

      setLastDailyQuestTimestamp(parseInt((await AsyncStorage.getItem('lastDailyQuestTimestamp')) || '0'));
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      const dailyQuest = getDailyQuest(completedQuests);
      setDailyQuest(dailyQuest);
      await AsyncStorage.setItem('lastDailyQuestTimestamp', now.toString());

      const monthlyBillQuest = getMonthlyBillQuest(completedQuests);
      setMonthlyBillQuest(monthlyBillQuest);

      const lastXpAwardTimestamp = await AsyncStorage.getItem('lastXpAwardTimestamp');
      if (!lastXpAwardTimestamp || now - parseInt(lastXpAwardTimestamp) >= twentyFourHours) {
        await updateUserValue('xp', user.value.xp + 10);
        await AsyncStorage.setItem('lastXpAwardTimestamp', now.toString());
        setXpAwarded(true);
      }
    })();
  }, []);

  const handleQuestCompletion = async (questId: string) => {
    const updatedCompletedQuests = [...context.completedQuests, questId];
    await AsyncStorage.setItem('completedQuests', JSON.stringify(updatedCompletedQuests));
    context.setCompletedQuests(updatedCompletedQuests);
    const user = useSelector(selectUser);
    const xp = user.value.xp || 0;
    await updateUserValue('xp', xp + 10);
  };

  const handleQuestPress = async (questId: string) => {
    const questCompleted = context.completedQuests.includes(questId);
    if (!questCompleted) {
      navigation.navigate('/quest', { questId, onComplete: () => handleQuestCompletion(questId) });
    }
  };

  return (
    <LayoutView style={{ padding: 0, margin: 0 }}>
      <HeaderBar title="Quests" />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', paddingTop: 96, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 96 }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginVertical: 8,
          }}>
          <FeedCard
            title={'Ekološki nivo'}
            subtitle={`${user.value.level}`}
            showArrow={false}
          />
          <FeedCard
            title={'Bodovi'}
            subtitle={`${user.value.xp} XP`}
            showArrow={false}
            style={{
              flex: 'none',
              width: 130,
              backgroundColor: COLORS.white,
              borderColor: COLORS.secondary,
              borderWidth: 2,
            }}
          />
        </View>

        <View style={{ flexDirection: 'column', gap: 8 }}>
          {xpAwarded && (
            <FeedCard
              title={'Dnevna nagrada'}
              subtitle={'Osvojili ste 10 XP za prijavu danas!'}
              color={COLORS.gold}
              completed={true}
              showArrow={false}
            />
          )}

          {dailyQuest && (
            <FeedCard
              title={'Današnji quest je...'}
              subtitle={dailyQuest.title}
              color={COLORS.gold}
              onPress={() => handleQuestPress(dailyQuest.id)}
              completed={context.completedQuests.includes(dailyQuest.id)}
            />
          )}

          {monthlyBillQuest && (
            <FeedCard
              title={'Mjesečni račun quest je...'}
              subtitle={monthlyBillQuest.title}
              color={COLORS.gold}
              onPress={() => handleQuestPress(monthlyBillQuest.id)}
              completed={context.completedQuests.includes(monthlyBillQuest.id)}
            />
          )}
        </View>

        <Text style={[FontsStyles.weightLight, FontsStyles.h3, { marginTop: 16, textAlign: 'center' }]}>
          To je sve za danas! Dođite sutra za nove questove.
        </Text>

        <View style={{ height: 96 }}></View>
      </ScrollView>
    </LayoutView>
  );
};
