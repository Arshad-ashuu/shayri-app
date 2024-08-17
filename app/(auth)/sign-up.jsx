import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useState } from "react";
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from "../../Firebaseconfig";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const signUp = async () => {
        try {
            setLoading(true);

            // Create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Set the displayName
            await updateProfile(user, { displayName: userName });

            console.log('User signed up with displayName:', user.displayName);
            router.push("/");
        } catch (error) {
            console.error('Error during sign-up:', error);
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />

            <View style={styles.innerContainer}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    placeholder="Username"
                    value={userName}
                    onChangeText={setUserName}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={signUp} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/sign-in")}>
                        <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0C0C0C', // Dark background
        justifyContent: 'center',
        padding: 16,
    },
    innerContainer: {
        backgroundColor: '#1C1C1C', // Slightly lighter dark background for inputs and buttons
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#2C2C2C', // Dark input background
        color: '#fff',
        padding: 12,
        marginVertical: 12,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#007bff', // Button color
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#fff',
    },
    link: {
        color: '#007bff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
});
