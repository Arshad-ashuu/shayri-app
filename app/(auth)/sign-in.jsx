import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useState } from "react";
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "../../Firebaseconfig";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        try {
            setLoading(true);
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user) {
                router.replace("/");
            }
            console.log('Email :', user.user.email);
        } catch (error) {
            console.log("signin error ", error);
            alert("Sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Login</Text>
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
                <TouchableOpacity onPress={signIn} style={styles.button} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/sign-up")}>
                        <Text style={styles.link}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignIn;

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
    input: {
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#2C2C2C', // Dark input background
        color: '#fff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff', // Button color
        padding: 15,
        borderRadius: 5,
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
