import { obtenerNuevasCoordenadas } from '../mediapipe/mpReconocimiento.mjs';
import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
const canvas = document.getElementById('output_canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

camera.position.z = 0.2;

var controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 0.2;
controls.maxDistance = 0.35;
controls.enableDamping = true;
controls.dampingFactor = 0.5;

controls.maxPolarAngle = Math.PI;

controls.screenSpacePanning = true;

//animacion
var animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();

const spheres = []; // Almacena las esferas

// Función para crear esferas en una ubicación específica
function createSphere(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.005, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
    spheres.push(sphere);
}

// Función para eliminar todas las esferas de la escena
function clearSpheres() {
    for (const sphere of spheres) {
        scene.remove(sphere);
    }
    spheres.length = 0;
}
export function guardarImagen() {
    var imgDataPNG, imgDataJPEG, imgNode;

    try {
        var pngMime = "image/png";
        var jpegMime = "image/jpeg";

        imgDataPNG = renderer.domElement.toDataURL(pngMime);
        imgDataJPEG = renderer.domElement.toDataURL(jpegMime);

        return [imgDataPNG, imgDataJPEG];

    } catch (e) {
        console.error(e);
        return;
    }

}

// Actualiza el tamaño del renderizador cuando cambie el tamaño del canvas


// Función para actualizar las esferas en tiempo real con nuevas coordenadas
function updateSpheres(newCoordinates) {
    // Borra las esferas y líneas existentes
    clearSpheres();

    // Crea esferas en las nuevas ubicaciones
    if (newCoordinates != null) {
        for (let i = 0; i < newCoordinates.length; i++) {
            //console.log(newCoordinates[i].x, newCoordinates[i].y, newCoordinates[i].z);
            createSphere(newCoordinates[i].x, -newCoordinates[i].y, -newCoordinates[i].z);
        }

        // Conecta cada dedo desde la muñeca hasta la punta de los dedos
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

        for (let i = 1; i < newCoordinates.length; i += 4) {
            const lineGeometry = new THREE.BufferGeometry();
            const linePositions = [];
            linePositions.push(
                newCoordinates[2].x, -newCoordinates[2].y, -newCoordinates[2].z
            );
            for (let j = 5; j < 18; j=j + 4) {
                linePositions.push(
                    newCoordinates[j].x, -newCoordinates[j].y, -newCoordinates[j].z
                );
            }

            // Conecta desde la muñeca hasta la punta del dedo actual
            linePositions.push(
                newCoordinates[0].x, -newCoordinates[0].y, -newCoordinates[0].z
            );

            for (let j = i; j < i + 4; j++) {
                linePositions.push(
                    newCoordinates[j].x, -newCoordinates[j].y, -newCoordinates[j].z
                );
            }
            

            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);

            // Almacena la referencia a la línea para poder eliminarla más adelante
            spheres.push(line);
        }
    }
}

// Supongamos que tienes un bucle o evento que actualiza constantemente las coordenadas.
// Debes llamar a updateSpheres con las nuevas coordenadas cuando estén disponibles.
setTimeout(() => {
    let landmarkAnterior = obtenerNuevasCoordenadas(); // Inicializa con el valor actual
    function updateLoop() {
        const newCoordinates = obtenerNuevasCoordenadas();

        if (landmarkAnterior !== newCoordinates) {
            updateSpheres(newCoordinates);
        }

        landmarkAnterior = newCoordinates; // Actualiza la variable con las nuevas coordenadas
        // Llama a esta función nuevamente para actualizar continuamente
        setTimeout(() => {
            console.log(landmarkAnterior)
            requestAnimationFrame(updateLoop);
            renderer.render(scene, camera, spheres);
        }, 33); // 30 FPS 1000/30 = 33
    }
    // Comienza el bucle de actualización
    updateLoop();
}, 0);

