//TODO add more sounds
const sounds = {
    "coin":{file: require('./assets/audio/coin.mp3'), name: "Marksman AltFire"},
    "parry":{file: require('./assets/audio/parry.mp3'), name: "Feedbacker Parry"},
    "earthmover roar":{file: require('./assets/audio/earthmover_roar.mp3'), name: "Roar"},
    "earthmover hurt":{file: require('./assets/audio/earthmover_hurt.mp3'), name: "Hurt"},
    default:{file: require('./assets/audio/coin.mp3'), name: "Sound failed to load"}
}

export default sounds;