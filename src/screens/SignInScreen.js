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
import { colors } from '../theme/colors';

export default function SignInScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={('./assets/favicon.png')} // Replace with your logo asset
          style={styles.logo}
        />
      </View>

      {/* Header Section */}
      <Text style={styles.headerTitle}>Think it. Make it.</Text>
      <Text style={styles.headerSubtitle}>Log in to your NotY account</Text>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.googleButton]}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.appleButton]}>
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ssoButton]}>
          <Text style={styles.buttonText}>Single sign-on (SSO)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.emailButton]}>
          <Text style={styles.buttonText}>Continue with email</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Your name and photo are displayed to users who invite you to a
          workspace using your email. By continuing, you acknowledge that you
          understand and agree to the <Text style={styles.link}>Terms & Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>Privacy & terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}> | </Text>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>Need help?</Text>
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
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.headerText,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  ssoButton: {
    backgroundColor: colors.secondary,
  },
  emailButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  footerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
    marginBottom: 16,
  },
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerLinkText: {
    fontSize: 14,
    color: colors.link,
  },
  footerDivider: {
    fontSize: 14,
    color: colors.placeholder,
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
  },
});