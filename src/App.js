import React, { useEffect } from 'react';
import * as THREE from 'three';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge";

function App() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    let camera;
    const scene = new THREE.Scene();

    useEffect(() => {
        const [width, height] = [window.innerWidth, window.innerHeight];

        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio * 2);
        document.getElementById('root').appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.setZ(1200);
        camera.position.setY(250);

        const lightIntensity = 1;
        const sunLightIntensity = .5;

        const sunLight = new THREE.DirectionalLight(0xffffff, sunLightIntensity);
        const leftDirectionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
        const rightDirectionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);

        sunLight.position.set(-1, 1, 0);
        leftDirectionalLight.position.set(-1, 0, 1);
        rightDirectionalLight.position.set(1, 0, 1);

        scene.add(sunLight);
        scene.add(leftDirectionalLight);
        scene.add(rightDirectionalLight);

        const mtlLoader = new MTLLoader();
        mtlLoader.load('./obj/abc.mtl', mtlResult => {
            const objLoader = new OBJLoader2();
            const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlResult);

            objLoader.addMaterials(materials);
            let mesh;
            const limit = .15;
            objLoader.load('./obj/abc.obj', obj => {
                obj.rotation.x += 0.2;
                obj.rotation.y += limit;
                scene.add(obj);
                mesh = obj;
            });

            let isRotatedLeft;
            let isRotatedRight;
            const step = .007;

            function rendering() {
                requestAnimationFrame(rendering);
                renderer.render(scene, camera);

                if (!isRotatedRight && mesh) {
                    if (mesh.rotation.y > -limit) {
                        mesh.rotation.y -= step;
                    }
                }
                if (!isRotatedLeft && mesh) {
                    if (mesh.rotation.y < limit) {
                        mesh.rotation.y += step;
                    }
                }

            }

            rendering();

            let x = 0;
            window.addEventListener('mousemove', event => {
                if (event.clientX < x && !isRotatedRight) {
                    isRotatedRight = true;
                    isRotatedLeft = false;
                }
                if (event.clientX > x && !isRotatedLeft) {
                    isRotatedLeft = true;
                    isRotatedRight = false;
                }
                x = event.clientX;
            });

        })

    }, []);


    return (
        <></>
    );
}

export default App;