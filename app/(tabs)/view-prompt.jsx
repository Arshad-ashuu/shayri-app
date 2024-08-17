import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, RefreshControl, StyleSheet, Pressable, Alert, StatusBar, Modal, TextInput, Button } from 'react-native';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore/lite';
import { auth, db } from '../../Firebaseconfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function FetchData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [updatedTag, setUpdatedTag] = useState('');
    const [updatedShayari, setUpdatedShayari] = useState('');

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "shayari"));
            const fetchedData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateShayari = async (id, newShayariData) => {
        try {
            const shayariRef = doc(db, "shayari", id);
            await updateDoc(shayariRef, newShayariData);
            Alert.alert("Success", "Shayari updated successfully");
            fetchData();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const deleteShayari = async (id) => {
        try {
            await deleteDoc(doc(db, "shayari", id));
            Alert.alert("Success", "Shayari deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const openModal = (item) => {
        setCurrentItem(item);
        setUpdatedTag(item.tag);
        setUpdatedShayari(item.shayari);
        setIsModalVisible(true);
    };

    const handleUpdate = () => {
        if (currentItem) {
            updateShayari(currentItem.id, { tag: updatedTag, shayari: updatedShayari });
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>No data found</Text>
                <Text style={styles.loadingText}>Be the first to share your Shayari...</Text>
            </View>
        );
    }

    const currentUserDisplayName = auth.currentUser?.displayName;
    const isCurrentUserCreator = (creator) => creator === currentUserDisplayName;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer} key={item.id}>
                        <Text style={styles.itemTag}>Tag: <Text style={styles.itemValue}>{item.tag}</Text></Text>
                        <Text style={styles.itemShayari}>{item.shayari}</Text>
                        <Text style={styles.itemCreator}>- <Text style={styles.itemValue}>{item.creator}</Text></Text>
                        {isCurrentUserCreator(item.creator) && (
                            <View style={styles.actions}>
                                <Pressable style={styles.actionButton} onPress={() => openModal(item)}>
                                    <FontAwesome name="edit" size={24} color="#aaa" />
                                </Pressable>
                                <Pressable style={styles.actionButton} onPress={() => deleteShayari(item.id)}>
                                    <AntDesign name="delete" size={24} color="#aaa" />
                                </Pressable>
                            </View>
                        )}
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007bff']}
                    />
                }
                contentContainerStyle={styles.listContainer}
            />

            {/* Modal for editing Shayari */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Shayari</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tag"
                            placeholderTextColor="#aaa"
                            value={updatedTag}
                            onChangeText={setUpdatedTag}
                        />
                        <TextInput
                            style={[styles.input, styles.shayariInput]}
                            placeholder="Shayari"
                            placeholderTextColor="#aaa"
                            value={updatedShayari}
                            onChangeText={setUpdatedShayari}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Update" onPress={handleUpdate} color="#007bff" />
                            <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#ff4d4d" />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212', // Dark background
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    itemContainer: {
        backgroundColor: '#1e1e1e', // Slightly lighter dark background
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionButton: {
        marginHorizontal: 8,
    },
    itemTag: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    itemShayari: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    itemCreator: {
        fontSize: 14,
        color: '#aaa',
    },
    itemValue: {
        fontWeight: 'bold',
        color: '#fff',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#1e1e1e',
        padding: 20,
        borderRadius: 12,
        borderColor: '#444',
        borderWidth: 1,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 10,
        color: '#fff',
        backgroundColor: '#333',
        marginBottom: 15,
    },
    shayariInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
