import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={['#ffd6ff', '#CB8FE5', '#8128F5']}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
