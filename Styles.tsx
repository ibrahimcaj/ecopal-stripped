import { StyleSheet } from 'react-native';

export const FontsStyles = StyleSheet.create({
  sans: { fontFamily: 'Lexend_400Regular' },
  weightThin: { fontFamily: 'Lexend_100Thin' },
  weightExtraLight: { fontFamily: 'Lexend_200ExtraLight' },
  weightLight: { fontFamily: 'Lexend_300Light' },
  weightRegular: { fontFamily: 'Lexend_400Regular' },
  weightMedium: { fontFamily: 'Lexend_500Medium' },
  weightSemiBold: { fontFamily: 'Lexend_600SemiBold' },
  weightBold: { fontFamily: 'Lexend_700Bold' },
  weightExtraBold: { fontFamily: 'Lexend_800ExtraBold' },
  weightBlack: { fontFamily: 'Lexend_900Black' },
  h1: { fontSize: 36 },
  h2: { fontSize: 22 },
  h3: { fontSize: 16 },
  h4: { fontSize: 12 },
  h5: { fontSize: 10 },
});

export const SearchFiltersStyles = StyleSheet.create({
  filterButton: { backgroundColor: 'transparent', borderRadius: 100 },
  filterButtonText: { color: 'black' },
  activeFilterButton: { backgroundColor: 'black', borderRadius: 100 },
  activeFilterButtonText: { color: 'white' },
});
