import React, { Component, type ErrorInfo, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from "react-native";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  retryKey: number;
};

/**
 * Keeps an unexpected render failure from presenting as a blank screen.
 * Native service failures are handled at their feature boundary; this boundary
 * is reserved for unrecoverable render errors and offers a safe local retry.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false, retryKey: 0 };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true, retryKey: 0 };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "[AppErrorBoundary] Render failure:",
      error,
      info.componentStack,
    );
  }

  retry = (_event?: GestureResponderEvent) => {
    this.setState((current) => ({
      hasError: false,
      retryKey: current.retryKey + 1,
    }));
  };

  render() {
    if (!this.state.hasError) {
      return (
        <React.Fragment key={this.state.retryKey}>
          {this.props.children}
        </React.Fragment>
      );
    }

    return (
      <View style={styles.root}>
        <View style={styles.card} accessibilityRole="alert">
          <Text style={styles.eyebrow}>KAMRAN · RECOVERY</Text>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.body}>
            KAMRAN could not render this screen. Your saved translations remain
            on this device. Try again, or reopen the app if the problem
            continues.
          </Text>
          <Pressable
            onPress={this.retry}
            accessibilityRole="button"
            accessibilityLabel="Try loading KAMRAN again"
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4F0",
    padding: 24,
  },
  eyebrow: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 10,
  },
  body: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  button: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
