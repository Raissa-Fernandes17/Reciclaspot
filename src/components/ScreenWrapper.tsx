import React from 'react';
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from 'react-native';

interface ScreenWrapperProps {
  children: React.ReactNode;
}

export function ScreenWrapper({ children }: ScreenWrapperProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <SafeAreaView style={styles.outer}>
      <View style={[styles.inner, isDesktop && styles.desktopContainer]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    width: '100%',
  },
  inner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F4F6F8',
  },
  desktopContainer: {
    alignSelf: 'center',
    maxWidth: 1120,
    width: '100%',
  },
});
