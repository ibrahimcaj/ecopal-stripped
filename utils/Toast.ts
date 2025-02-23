import { Toast } from 'react-native-alert-notification';

import { FontsStyles } from '../Styles';

export function showToast(message: string) {
  Toast.show({
    textBodyStyle: [
      FontsStyles.sans,
      FontsStyles.h4,
      {
        borderRadius: 100,
      },
    ],
    titleStyle: {
      borderRadius: 100,
    },
    textBody: message,
  });
}
