import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function SignInScreen() {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      bounces={false}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/favicon.png')}
          style={styles.logo}
        />
      </View>

      {/* Header */}
      <Text style={styles.headerTitle}>Think it. Make it.</Text>
      <Text style={styles.headerSubtitle}>Log in to your NotY account</Text>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/NotY_Login.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
        <MaterialCommunityIcons name="google" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <MaterialCommunityIcons name="email-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Continue with email</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your name and photo are displayed to users who invite you to a workspace using your email. By continuing, you acknowledge that you understand and agree to the{' '}
          <Text style={styles.link}>Terms & Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        <View style={styles.footerLinks}>
          <TouchableOpacity>
          <Text style={styles.link}>Privacy & terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity>
          <Text style={styles.link}>Need help?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2025 NotY Labs, Inc.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
},
logoContainer: {
    marginBottom: 16,
},
logo: {
    width: 32,
    height: 32,
},
headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.headerText,
    marginBottom: 4,
},
headerSubtitle: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 24,
},
illustrationContainer: {
    marginBottom: 24,
    alignItems: 'center',
},
illustration: {
    width: 360,
    height: 360,
},
buttonsContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 24,
},
button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    gap: 8,
    textAlign: 'center',
    justifyContent: 'center',
},
buttonIcon: {
    width: 24,
    height: 24,
},
buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
},
footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingHorizontal: 24,
},
footerText: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
    marginBottom: 12,
    marginBottom: 12,
    lineHeight: 16,
},
link: {
    color: colors.link,
},
footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
},
footerDivider: {
    color: colors.placeholder,
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 11,
},
copyright: {
    fontSize: 11,
    color: colors.placeholder,
},
});