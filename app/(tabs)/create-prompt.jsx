import React, { useState } from 'react';
import { ScrollView, TextInput, View, Text, Alert, StyleSheet, ActivityIndicator, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { db } from '../../Firebaseconfig';
import { AntDesign } from '@expo/vector-icons';

export default function CreatePrompt() {
    const [tag, setTag] = useState("");
    const [shayari, setShayari] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const auth = getAuth();
    const user = auth.currentUser;
    const creator = user ? user.displayName || user.uid : 'Anonymous';

    const handleCreatePrompt = async () => {
        setLoading(true);

        if (!tag.trim() || !shayari.trim()) {
            setError('Both fields are required');
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "shayari"), {
                tag: tag,
                shayari: shayari,
                createdAt: new Date(),
                creator: creator,
            });

            setTag("");
            setShayari('');
            setError('');
            Alert.alert("Success", "Shayari created successfully!");
            router.push('/view-prompt');
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Failed to create Shayari");
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            router.push('/sign-in');
        } catch (error) {
            console.error("Sign out error", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <View style={styles.header}>
                <AntDesign name="user" size={24} color="#fff" />
                <Text style={styles.user}>{creator}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Create Shayari</Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 'sad', 'love', 'life'..."
                    placeholderTextColor="#aaa"
                    value={tag}
                    onChangeText={setTag}
                />
                <TextInput
                    style={[styles.input, styles.shayariInput]}
                    placeholder="Enter your shayari here..."
                    placeholderTextColor="#aaa"
                    value={shayari}
                    onChangeText={setShayari}
                    multiline
                />
                <Pressable style={styles.button} onPress={handleCreatePrompt} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create</Text>}
                </Pressable>
                <Pressable style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8
    },
    user: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 22,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 12,
        backgroundColor: '#1f1f1f', // Dark input background
        color: '#fff',
    },
    shayariInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signOutButton: {
        alignItems: 'center',
        borderColor: '#333',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 8,
    },
    signOutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
