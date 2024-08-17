import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace('/sign-in'); // Redirect to sign-in if user is not authenticated
            } else {
                router.push("/view-prompt");
            }
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, [auth, router]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Welcome to Shayari</Text>
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
                <Text style={styles.subtitle}>Loading your experience...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 20,
    },
    loader: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
});
