import {useState, useEffect, useMemo, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import ExpoTHREE from 'expo-three';
import { TextureLoader } from 'expo-three';

import SFXButton from './SFXButton';
import FolderButton from './FolderButton';
import Object3D from './Object3D'
import objects3D from './objects3D';
const files = require('./structure.json');
const elevator = require('./assets/images/elevator.gif');
const logo = require('./assets/images/logo.png');



export default function App() {
	const [playing, setPlaying] = useState(false);
	const [path, setPath] = useState("root");
	const [loadingText, setLoadingText] = useState('Loading');
	const [loading, setLoading] = useState(true);
	const assetsReadyRef = useRef(false);
	const loadedModels = useMemo(loadModels, []);
	const backButton = <FolderButton changePath = {changePath} playing = {playing} path = {path} subfolder = {'Back'} key = {0}></FolderButton>;
	const headerBG = Asset.fromModule(elevator);
	const headerImage = Asset.fromModule(logo);

	useEffect(() => {
		loadedModels
		.then(() => {
			assetsReadyRef.current = true;	
		})
	}, [])

	useEffect(() => {
		function loop(){
			setTimeout(() =>{
			setLoadingText('Loading . ');
			setTimeout(() =>{
			setLoadingText('Loading . .');
			setTimeout(() =>{
			setLoadingText('Loading . . .');
			setTimeout(() => {
			setLoadingText('Loading');
			if(assetsReadyRef.current){
				toggleLoading();
			}
			else{
				loop();
			}
			})
			}, 150)
			}, 150)	
			}, 150)
		}
		loop()
	}, [path]);

	function togglePlaying(){
		setPlaying((playing) => !playing);
	}
	
	function toggleLoading(){
		setLoading((loading) => !loading)
	}
	
	function changePath(directory){
		toggleLoading();
		setPath(directory);
	}
	
	function getLocation(){
		let location = JSON.parse(JSON.stringify(files));
		path.split('/').forEach(folder => {
			location = location[folder];
		})
		
		return location;
	}
	
	async function selectObject3D(name){
		const allObjects = await loadedModels;
		return allObjects[name];
	} 
	
	function buttonsToRender(){
		location = getLocation();
		return Array.isArray(location) ?  
		[
			...location.map((file, key) => <SFXButton toggleplaying = {togglePlaying} playing = {playing} sfx = {file} key = {key + 1}></SFXButton>)
		]
		:
		[
			...Object.keys(location).map((subfolder, key) => <FolderButton changePath = {changePath} playing = {playing} path = {path} subfolder = {subfolder} object3D = {objects3D[subfolder] ? selectObject3D(subfolder) : null} key = {key + 1}></FolderButton>)
		]
	}
	
	async function loadModels(){
		objects = new Object();
		console.log('Loading models');
		for(object3D in objects3D){
			const textureLoader = new TextureLoader();
			const textureAsset = Asset.fromModule(objects3D[object3D].texture);
			if(!textureAsset.localUri){
				console.log('Asset not found - Downloading...');
				await textureAsset.downloadAsync();
			}
			const { width, height } = textureAsset;
    		const localUri = `${FileSystem.cacheDirectory}copied_texture.png`;
			const fileInfo = await FileSystem.getInfoAsync(localUri);
			if (!fileInfo.exists) {
			  await FileSystem.copyAsync({ from: textureAsset.localUri, to: localUri });
			}
			const copiedAsset = Asset.fromURI(`${localUri}`);
			copiedAsset.height = height;
			copiedAsset.width = width;
			copiedAsset.localUri = localUri;
			const texture = textureLoader.load(copiedAsset.localUri);
			// const texture = textureLoader.load(textureAsset.uri); //this is for testing in expoGO
			const material = new THREE.MeshBasicMaterial({ map: texture });

			const objLoader = new OBJLoader();
			const objAsset = Asset.fromModule(objects3D[object3D].object);
			if(!objAsset.localUri){
				console.log('Asset not found - Downloading...');
				await objAsset.downloadAsync();
			}
			const objURI = objAsset.localUri;
			//const objURI = objAsset.uri; //this is for testing in expoGO
			const object = await objLoader.loadAsync(objURI);
			object.children.forEach((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = material;
				}
			});
			objects[object3D] = object;
		}

		return objects;
	}
	return (
	<View style = {styles.container}>
		<StatusBar></StatusBar>
		<LinearGradient	colors={['#202010', '#191909', '#0a0a00']} locations={[0, 0.2, 0.8]} start={{ x: 0, y: 0.15 }} end={{ x: 0.6, y: 1 }} style={styles.bgGradient}/>
		<LinearGradient colors={['#191909', '#30302066', '#30302066', 'transparent']} locations={[0, 0.4, 0.65, 1]} start={{ x: 0, y: 0.15 }} end={{ x: 0.2, y: 0.3 }} style={styles.bgGradient}/>
		<View style = {styles.header}>
			<ImageBackground style = {styles.bgImage} source = {{uri: headerBG.uri}}>
				<Image style = {styles.logo} source = {{uri: headerImage.uri}}></Image>
			</ImageBackground>
		</View>
		<View style = {loading ? styles.loadingScreen : styles.hidden}>
				<Text style = {styles.text}>{loadingText}</Text>
		</View>
		<View style = {loading ? styles.hidden : styles.scrollContainerContainer}>
			<ScrollView style = {loading ? styles.hidden : styles.scrollContainer} contentContainerStyle = {styles.scrollContentContainer}>
				{path === 'root' ? <></> : backButton}
				{buttonsToRender()}
			</ScrollView>
		</View>
	</View>
	);
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#000',
		paddingHorizontal: 0
	},
	header: {
		flex: 1,
		width: '100%',
		resizeMode: 'contain',
		borderColor: '#171717',
		borderBottomWidth: 5,
		borderStyle: 'solid',
		backgroundColor: '#000'
	},
	bgImage: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		opacity: 0.6
	},
	bgGradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		height: '100%',
	},
	logo: {
		flex: 1,
		width: '80%',
		resizeMode: 'contain'
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContainerContainer: {
		flex: 6,
		width: '100%'
	},
	scrollContentContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 20,
		paddingVertical: 30
	},
	text: {
		fontSize: 16,
		fontFamily: 'VCR OSD Mono Regular',
		color: '#fff'
	},
	loadingScreen: {
		flex: 6,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0000'
	},
	hidden: {
		display: 'none'
	}
});
