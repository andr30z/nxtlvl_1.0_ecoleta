import React, { useState } from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./Home.styles";
import { AppLoading } from "expo";
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const Home = () => {
    const navigation = useNavigation();

    const [city, setCity] = useState("");
    const [uf, setUf] = useState("")

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf, city
        });
    }

    const [fontsloaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Ubuntu_700Bold
    });

    if (!fontsloaded) {
        return <AppLoading />
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ImageBackground
                source={require('../../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}>
                <View style={styles.main}>
                    <Image source={require('../../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem ponstos de coletas de forma eficiente</Text>
                    </View>

                </View>
                <View style={styles.footer}>
                    <TextInput maxLength={2} autoCapitalize="characters" autoCorrect={false} value={uf} onChangeText={setUf} style={styles.input} placeholder="Digite a UF" />
                    <TextInput value={city}  autoCorrect={false} onChangeText={setCity} style={styles.input} placeholder="Digite a Cidade" />
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name='arrow-right' color="#fff" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Home;
