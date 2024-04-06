import { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';



export default function Object3D({object3D}){
    componentUnmountedRef = useRef(false);
    
    useEffect(() => {
        return () => {
            componentUnmountedRef.current = true;
        }
    }, []);
    
    async function onContextCreate(gl) {
        const object = await object3D;
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.z = 2;
        scene.add(object)

        object.position.y -= 1;
        const render = () => {
            renderer.render(scene, camera);
            object.rotation.y += 0.005;
            gl.endFrameEXP();
            if(componentUnmountedRef.current){
                gl.flush();            
                object.position.y += 1;
                object.rotation.y = 0;
            }
            else{
                requestAnimationFrame(render);
            }
        };
        render();
    }
    
    return(
        <GLView
        style = {{width: 150, height: 150}}
        onContextCreate={onContextCreate}
        />
    )
}