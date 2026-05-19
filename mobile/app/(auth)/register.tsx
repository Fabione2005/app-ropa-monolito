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

export default function RegisterScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormComplete =
    nombre.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    telefono.trim() !== '' &&
    aceptaTerminos;

  const handleRegister = async () => {
    if (!isFormComplete) return;

    setLoading(true);
    try {
      await api.post('/api/v1/auth/registro', {
        nombre_completo: nombre.trim(),
        email: email.trim(),
        password,
        telefono: telefono.trim(),
        acepta_terminos: aceptaTerminos,
      });

      // Auto-login tras el registro exitoso
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
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        'Ocurrió un error. Intenta de nuevo.';
      Alert.alert('Error', message);
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
        <Text style={styles.title}>¡Estás a un paso de ser Fri!</Text>

        {/* Nombre y Apellido */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nombre y Apellido"
            placeholderTextColor={Colors.placeholder}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.placeholder}
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setPassword}
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

        {/* Teléfono */}
        <View style={[styles.inputWrapper, styles.inputRow]}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            placeholder="Número de teléfono"
            placeholderTextColor={Colors.placeholder}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="numeric"
          />
          <Text style={styles.verifyLabel}>Verificar</Text>
        </View>

        {/* Checkbox términos */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAceptaTerminos((v) => !v)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}>
            {aceptaTerminos && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            {'He leído y acepto los '}
            <Text style={styles.linkText}>Términos y condiciones</Text>
            {' y las '}
            <Text style={styles.linkText}>Políticas de privacidad</Text>
            {'.*'}
          </Text>
        </TouchableOpacity>

        {/* Botón crear cuenta */}
        <TouchableOpacity
          style={[styles.primaryButton, !isFormComplete && styles.primaryButtonDisabled]}
          onPress={handleRegister}
          disabled={!isFormComplete || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.primaryButtonText}>CREAR CUENTA</Text>
          )}
        </TouchableOpacity>

        {/* Separador */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O continuar con</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botones sociales */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.facebookIcon}>f</Text>
            <Text style={styles.socialLabel}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* Link a login */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>Ingresa</Text>
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
    marginBottom: 24,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.text,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 32,
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
  verifyLabel: {
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.placeholder,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: Colors.placeholder,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 13,
    gap: 8,
  },
  facebookIcon: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  googleIcon: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#EA4335',
  },
  socialLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
