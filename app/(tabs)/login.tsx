// screens/LoginScreen.tsx
import { useInfo, useLogin } from "@/hooks/useApi";
import { UserDTO } from "@/types/data";
import { setLocalUserInfo } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FormErrors {
  username?: string;
  password?: string;
}

export default function LoginScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserDTO>({
    username: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: loginMutate, isPending, isError } = useLogin();
  const { refetch: refetchUserInfo } = useInfo();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Please enter username";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Please enter password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (): void => {
    if (!validateForm()) {
      return;
    }

    loginMutate(formData, {
      onSuccess: async (response) => {
        try {
          const userInfo = await refetchUserInfo();
          if (userInfo.data) {
            await setLocalUserInfo(userInfo.data);
          }
          router.replace("/(tabs)/scanner");
        } catch (error) { }
      },
      // onError: (error: AxiosError<ApiErrorResponse>) => {
      //   let errorMessage = 'Login failed. Please try again.';

      //   if (error.response?.data?.error?.message) {
      //     // Handle multilingual error messages if available
      //     const errorData = error.response.data.error.message;
      //     errorMessage = typeof errorData === 'object' ?
      //       (errorData.en || errorData.uz || Object.values(errorData)[0]) :
      //       errorData;
      //   }

      //   Alert.alert('Login Error', errorMessage);
      // },
    });
  };

  const handleInputChange = (field: keyof UserDTO, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.loginWrapper}>
          <View style={styles.loginHeader}>
            <Image
              source={require('../../assets/images/logo.svg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t("adminLogin")}</Text>
          </View>

          {/* Login Form */}
          <View style={styles.loginForm}>
            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("username")}</Text>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                placeholder={t("enterUsername")}
                placeholderTextColor="#9CA3AF"
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("password")}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  placeholder={t("enterPassword")}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Error Message */}
            {isError && (
              <Text style={styles.generalErrorText}>
                Login or password is incorrect, please check and try again
              </Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isPending && styles.submitButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{t("login")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loginWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loginHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 10,
  },
  logo: {
    width: 80,
    height: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 32,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
  },
  loginForm: {
    width: "100%",
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  generalErrorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  submitButton: {
    height: 48,
    backgroundColor: "#030712",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
