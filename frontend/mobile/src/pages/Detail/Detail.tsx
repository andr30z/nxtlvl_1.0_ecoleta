import React, { useState, useEffect } from 'react';
import { View, Image, Text, SafeAreaView, Linking } from 'react-native';
import { styles } from "./Detail.styles";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';


interface Params {
    point_id: number;
}

interface Data {
    point: { image: string, imageUrl: string, name: string, email: string, whatsapp: string, city: string, uf: string };
    items: { title: string }[]
}

const Detail = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState<Data>({} as Data);

    const routeParams = route.params as Params;
    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(res => {
            setData(res.data);
        })
    }, []);

    function navigateBack() {
        navigation.goBack();
    }
    if (!data.point) {
        return null
    }

    function handleComposeMail() {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho Interesse sobre coleta de residuos :D`);
    }

    function handleWhatsapp() {
        MailComposer.composeAsync({
            subject: "Interesse na coleta de residuos",
            recipients: [data.point.email],
        });
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity>
                    <Icon onPress={navigateBack} name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>
                <Image style={styles.pointImage} source={{ uri: data.point.imageUrl }} />
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}> {data.items.map(item => item.title).join(', ')}</Text>


                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereços</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={28} color="#fff" />
                    <Text style={styles.buttonText}>whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={28} color="#fff" />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )

}

export default Detail;
