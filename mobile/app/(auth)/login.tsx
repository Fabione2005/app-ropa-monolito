import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import Colors from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recuerdame, setRecuerdame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string>('');

  const isFormComplete = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormComplete) return;

    setLoading(true);
    setErrorMensaje('');
    try {
      const { data } = await api.post('/api/v1/auth/login', {
        email: email.trim(),
        password,
      });

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: data.id,
        nombre_completo: data.nombre_completo,
        email: data.email,
        points_balance: data.points_balance,
      }));

      router.replace('/(tabs)/home');
    } catch (error: any) {
      const mensaje =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Ocurrió un error. Intenta de nuevo.';
      setErrorMensaje(mensaje);
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Ingresar</Text>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.placeholder}
            value={email}
            onChangeText={(v) => { setEmail(v); setErrorMensaje(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Contraseña */}
        <View style={[styles.inputWrapper, styles.inputRow]}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="Contraseña"
            placeholderTextColor={Colors.placeholder}
            value={password}
            onChangeText={(v) => { setPassword(v); setErrorMensaje(''); }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.inputAction}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Recuérdame + Olvidaste contraseña */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRecuerdame((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, recuerdame && styles.checkboxChecked]}>
              {recuerdame && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberLabel}>Recuérdame</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* Botón entrar */}
        <TouchableOpacity
          style={[styles.primaryButton, !isFormComplete && styles.primaryButtonDisabled]}
          onPress={handleLogin}
          disabled={!isFormComplete || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        {/* Error inline (visible también en web) */}
        {errorMensaje !== '' && (
          <Text style={styles.errorText}>{errorMensaje}</Text>
        )}

        {/* Link a registro */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 36,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: Colors.background,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  inputFlex: {
    flex: 1,
  },
  inputAction: {
    paddingHorizontal: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: 'bold',
  },
  rememberLabel: {
    fontSize: 13,
    color: Colors.text,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.placeholder,
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.border,
  },
  primaryButtonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
