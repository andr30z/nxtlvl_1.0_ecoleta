import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import { styles } from "./Points.styles";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from '../../services/api';
import * as Location from 'expo-location';

interface Items {
    id: number;
    title: string;
    imageUrl: string
}

interface Points {
    id: number;
    image: string;
    name: string;
    imageUrl: string;
    longitude: number;
    latitude: number;
}

interface Params {
    uf: string,
    city: string
}

const Points = () => {
    const [items, setItems] = useState<Items[]>([]);
    const [points, setPoints] = useState<Points[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();

    const route = useRoute();
    const routeParams = route.params as Params;

    function navigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: Number) {
        navigation.navigate('Detail', { point_id: id });
    }

    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ooops.. Precisamos de sua permissão para obter sua localização');
                return;
            }
            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude])
        }
        loadPosition();
    }, []);

    useEffect(() => {
        api.get('items').then(res => {
            setItems(res.data);
        });
    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selectedItems
            }
        }).then(res => {
            setPoints(res.data);
        })
    }, [selectedItems])

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity>
                    <Icon onPress={navigateBack} name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>
                <Text style={styles.title}>Bem Vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>
                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView
                            style={styles.map}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                longitudeDelta: 0.014,
                                latitudeDelta: 0.014

                            }}>
                            {points.map(point => (
                                <Marker
                                    key={String(point.id)}
                                    coordinate={{
                                        latitude: Number(point.latitude),
                                        longitude: Number(point.longitude),
                                    }}
                                    onPress={() => { handleNavigateToDetail(point.id) }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.imageUrl }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}

                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {
                        items.map(x => (
                            <TouchableOpacity activeOpacity={0.6} key={String(x.id)} style={[styles.item, selectedItems.includes(x.id) ? styles.selectedItem : {}]} onPress={() => { handleSelectItem(x.id) }}>
                                <SvgUri width={42} height={42} uri={x.imageUrl} />
                                <Text style={styles.itemTitle}>{x.title}</Text>
                            </TouchableOpacity>
                        ))
                    }

                </ScrollView>
            </View>
        </>
    )
}

export default Points;
