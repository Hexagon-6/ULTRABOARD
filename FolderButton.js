import { StyleSheet, Text, Pressable } from 'react-native';
import {useFonts} from 'expo-font';
import Object3D from './Object3D';



export default function FolderButton({changePath, playing, path, subfolder, object3D}){
    const [fontsLoaded] = useFonts({'VCR OSD Mono Regular': require('./assets/fonts/VCR OSD Mono Regular.ttf'),});
    const newPath = subfolder === 'Back' ? path.slice(0, path.lastIndexOf('/')) : `${path}/${subfolder}`;
    const content = object3D ? <Object3D object3D = {object3D}></Object3D> : <Text style = {styles.text}>{subfolder.toUpperCase()}</Text>;    

    return(
        <Pressable disabled = {playing} onPress = {()=>{changePath(newPath)}} style = {playing || subfolder === 'Back' ? [styles.button, styles.disabled] : styles.button} hitSlop={15}>
            {content}
        </Pressable> 
    )    
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
        opacity: 0.4
    },
    disabled: {
        borderColor: '#666'
    },
    text: {
        fontFamily: 'VCR OSD Mono Regular',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    }
});
