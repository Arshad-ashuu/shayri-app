import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; // Import icons

const TabLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#fff', // Active tab color
            tabBarInactiveTintColor: '#808080', // Inactive tab color
            tabBarStyle: {
                backgroundColor: '#000', // Background color of the tab bar
            },

        }}>
            <Tabs.Screen
                name="view-prompt"
                options={{
                    title: 'Shayari',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="heart-multiple-outline" size={size} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#000', // Set header background color to black
                    },
                    headerTintColor: '#fff', // Set header text color to white

                }}
            />
            <Tabs.Screen
                name="create-prompt"
                options={{
                    title: 'Create',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="plus-square" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
