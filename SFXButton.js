import {useState, useEffect} from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import {Audio} from 'expo-av';
import {useFonts} from 'expo-font';
import sounds from './sounds'



export default function SFXButton({toggleplaying, playing, sfx}){
    const [fontsLoaded] = useFonts({'VCR OSD Mono Regular': require('./assets/fonts/VCR OSD Mono Regular.ttf'),});
    const [sound, setSound] = useState();

    async function playSound() {
        toggleplaying();
        file = sounds[sfx].file || sounds.default.file;
        const {sound} = await Audio.Sound.createAsync(file);
        sound.setOnPlaybackStatusUpdate((status) => {
            if(status.didJustFinish){
                toggleplaying();
            }
        })
        setSound(sound);
    
        await sound.playAsync();
    }
    
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);
  

    return(
        <Pressable disabled = {playing} onPress = {playSound} style = {playing ? [styles.button, styles.disabled] : styles.button} hitSlop={15}>
            <Text style = {playing ? [styles.text, styles.disabled] : styles.text}>{sounds[sfx].name}</Text>
        </Pressable>
    );
}



const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        height: 150,
        width: '40%',
        margin: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 5,
        opacity: 0.4,
    },
    disabled: {
        borderColor: '#666',
    },
    text: {
        fontFamily: 'VCR OSD Mono Regular',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    }
});
