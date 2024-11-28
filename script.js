import * as THREE from "three";
//import * as TWEEN from ''https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js'
import { Tween, update, Easing } from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000); //full size of the window
camera.position.set(0,10,0);
camera.lookAt(new THREE.Vector3(0,0,0));
camera.position.set(0,40,-105); // point de menu start

const canvas= document.getElementById("myCanvas");
//const controls = new OrbitControls(camera, canvas);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


  // Charger une texture d'environnement pour les reflets
  //https://github.com/mrdoob/three.js/tree/master/examples/textures/cube
const envTexture = new THREE.CubeTextureLoader()
.setPath('./img/light ajusted/')  // Dossier où se trouvent tes images cubemap
.load([
  'px.jpg', 'nx.jpg',    // Images pour les côtés du cube (environnement)
  'py.jpg', 'ny.jpg',    // Chaque image représente une face de l'environnement
  'pz.jpg', 'nz.jpg'
]);
scene.background = envTexture;


// Lumière ambiante pour un remplissage doux
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Création de la lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Couleur blanche, intensité 1
scene.add(directionalLight);

// Positionnement de la lumière directionnelle derrière la caméra
const updateLightPosition = () => {
    // Place la lumière légèrement derrière la caméra
    directionalLight.position.copy(camera.position).add(new THREE.Vector3(0, 0, -5));
    
    // Oriente la lumière dans la même direction que la caméra
    directionalLight.target.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(10));
    scene.add(directionalLight.target); // Ajout du target dans la scène pour le positionnement correct
};
updateLightPosition();


window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

//==============================================variables====================
const homeButton= document.getElementById("home");
homeButton.onclick = function(){
  currentAnimationIndex = -1;
  isAnimating = true;
  const { to, duration } = {to: {x: 0,y: 40,z: -105}, duration:2000};
  animateCamera(to, duration).then(() => {
      isAnimating = false;
      console.log("pos ",camera.position,currentAnimationIndex);
      currentAnimationIndex = 0;
      startButton.disabled=false;
      startButton.style.visibility="visible";
      });
    
};

const startButton= document.getElementById("startButton");
startButton.onclick = function()
{
  
  startButton.disabled=true;
  startButton.style.visibility="hidden";

  isAnimating = true;
  const { to, duration } = animationQueue[currentAnimationIndex];
  animateCamera(to, duration).then(() => {
    isAnimating = false;
    console.log("pos ",camera.position,currentAnimationIndex);
  
    currentAnimationIndex++;
  });  
}

const main_page = document.getElementById("main_page");
const cv_option = document.getElementById("cv_option");
const portfolio_option = document.getElementById("portfolio_option");
const cv_page = document.getElementById("cv_page");
const portfolio_page_mozaik = document.getElementById("porfolio_page_mozaik");
const portfolio_page_gamongus = document.getElementById("porfolio_page_gamongus");
const porfolio_page_BS = document.getElementById("porfolio_page_BS");

window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");

  // Ajoute la classe pour déclencher la transition
  loadingScreen.style.visibility="hidden";
});



cv_option.addEventListener('click', function(event) {
  //animationQueue [1]={ to: { x: -45, y: -10, z: 0 }, duration: 1000 };
  isCV=true;
  Path();
  console.log("cv clic");
    isAnimating = true;
    const { to, duration } = animationQueue[currentAnimationIndex];
    animateCamera(to, duration).then(() => {
      isAnimating = false;
      console.log("pos ",camera.position,currentAnimationIndex);
       if(currentAnimationIndex!=animationQueue.length-2){
        // Scroll vers le bas (suivant)
        previousAnimationIndex=currentAnimationIndex;
        console.log(currentAnimationIndex,"+1");
        currentAnimationIndex++;
       }
    });
})

portfolio_option.addEventListener('click', function(event) {
  //animationQueue [1]={ to: { x: 45, y: -10, z: 0 }, duration: 1000 };
  isCV=false;
  Path();
  console.log("portfolio clic");
  isAnimating = true;
  const { to, duration } = animationQueue[currentAnimationIndex];
  animateCamera(to, duration).then(() => {
    isAnimating = false;
    if(currentAnimationIndex!=animationQueue.length-2){
      // Scroll vers le bas (suivant)
      previousAnimationIndex=currentAnimationIndex;
      console.log(currentAnimationIndex,"+1");
      currentAnimationIndex++;
     }
  });
  
 
})
function Page(stat,page){
  if(stat=="show" && page=="main"){
    main_page.style.visibility="visible";
    cv_page.style.visibility="hidden";
    portfolio_page_mozaik.style.visibility="hidden";
    portfolio_page_gamongus.style.visibility="hidden";
    porfolio_page_BS.style.visibility="hidden";
  }
  else if(stat=="show" && page=="cv"){
    main_page.style.visibility="hidden";
    cv_page.style.visibility="visible";
    portfolio_page_mozaik.style.visibility="hidden";
    portfolio_page_gamongus.style.visibility="hidden";
    porfolio_page_BS.style.visibility="hidden";
  }
  else if(stat=="show" && page=="portfolio"){
    main_page.style.visibility="hidden";
    cv_page.style.visibility="hidden";
    portfolio_page_mozaik.style.visibility="visible";
    portfolio_page_gamongus.style.visibility="hidden";
    porfolio_page_BS.style.visibility="hidden";
  }
  else if(stat=="show" && page=="porfolio2"){
    main_page.style.visibility="hidden";
    cv_page.style.visibility="hidden";
    portfolio_page_mozaik.style.visibility="hidden";
    portfolio_page_gamongus.style.visibility="visible";
    porfolio_page_BS.style.visibility="hidden";
  }
  else if(stat=="show" && page=="porfolio3"){
    main_page.style.visibility="hidden";
    cv_page.style.visibility="hidden";
    portfolio_page_mozaik.style.visibility="hidden";
    portfolio_page_gamongus.style.visibility="hidden";
    porfolio_page_BS.style.visibility="visible";
  }
  else if(stat=="hide"){
    main_page.style.visibility="hidden";
    cv_page.style.visibility="hidden";
    portfolio_page_mozaik.style.visibility="hidden";
    portfolio_page_gamongus.style.visibility="hidden";
    porfolio_page_BS.style.visibility="hidden";
  }
}

function affichage(index){
  switch(index){
    case 0:
      console.log("here case 0");
      Page("show","main");
      break;

    case 1:
      console.log("here case 1");
      if(isCV){
        Page("show","cv");
      }
      else{
        Page("show","portfolio");
      }
      break;

    case 2:
      Page("show","porfolio2")
      break;

    case 3:
      Page("show","porfolio3")
      break;

    default :
      console.log("here default", index);
      Page("hide");
      break;
   }
}

function Path(){
  if(isCV==true){
    animationQueue = [
      { to: { x: 0, y: 20, z: 0 }, duration: 1500 }, //premier menu, choix itinéraire
      { to: { x: -45, y: -10, z: 0 }, duration: 1000 }, //   cv { x: -45, y: -10, z: 0 }
      { to: { x: 45, y: -10, z: 0 }, duration: 1500 } 
    ];
  }
  else{
    animationQueue = [
      { to: { x: 0, y: 20, z: 0 }, duration: 1500 }, //premier menu, choix itinéraire
      { to: { x: 45, y: -10, z: 0 }, duration: 1000 }, // portfolio { x: 45, y: -10, z: 0 } 
      {to:{ x: 105, y: -60, z: -35 },duration:2000},
      {to:{ x: 15, y: -120, z: -35 },duration:1000},
      {to:{ x: 65, y: -20, z: 0 },duration:1000} //ligne jamais joué, utile pour l'enchainement
    ];
  }
}
//=================================================material definition ================================================

// Définition du matériau pour la bulle (recyclé pour toutes les bulles)
const bubbleMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xffffff),         // Couleur blanche de base, pour laisser l'iridescence visible
  roughness: 0.05,                          // Très peu de rugosité pour un effet brillant
  metalness: 0,                             // Pas de propriétés métalliques
  iridescence: 1,                           // Iridescence activée pour simuler les couleurs changeantes
  iridescenceIOR: 1.9,                      // Indice de réfraction de l'iridescence, ajustez pour intensité des couleurs
  iridescenceThicknessRange: [100, 300],    // Ajustez pour varier l'épaisseur de l'iridescence et les couleurs
  transmission: 0.8,                          // Transparence totale pour simuler la finesse de la bulle
  opacity: 0.25,                             // Légère opacité pour l'effet de bulle
  transparent: true,                        // Active la transparence
  clearcoat: 1,                             // Clearcoat pour renforcer la réflexion
  clearcoatRoughness: 0,                    // Aucune rugosité du clearcoat, pour des reflets nets
  reflectivity: 0.6,                        // Forte réflectivité pour les reflets de lumière
  ior: 1.33,                                // Indice de réfraction de l'eau, proche de celui d'une bulle de savon
  side: THREE.DoubleSide,                   // Visible de tous les côtés
  envMap: envTexture,
});

const cloudMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0xffffff), // Couleur blanche
  roughness: 0.9,                  // Surface rugueuse pour une diffusion douce
  metalness: 0.2,                    // Aucune propriété métallique
  //transmission: 0.5,               // Transmission pour la lumière traversant le matériau
  opacity: 0.4,                    // Opacité plus faible pour un effet vaporeux
  transparent: true,               // Active la transparence
  depthWrite: false,               // Désactive depthWrite pour éviter l’effet d’opacité totale
  //blending: THREE.AdditiveBlending, // Blending additif pour un effet vaporeux
  //reflectivity: 0.5,
  //side: THREE.DoubleSide          // Visible de tous les côtés
});

// =====================================================background bubble==============================

// Fonction pour générer une position aléatoire dans le cube
function getRandomPosition(range) {
  //const range = 75; // Comme le cube est de 50x50x50, les positions vont de -25 à 25
  return (Math.random() * 2 - 1) * range; // Position entre -75 et 25
}

//gros cube
// Création de 10 bulles aléatoires
for (let i = 0; i < 200; i++) {
  // Génération d'une taille de bulle aléatoire
  const radius = Math.random() * 4 + 0.5;  // Taille de la bulle entre 0.5 et 4.5

  // Création de la géométrie de la bulle avec une taille variable
  const sphereGEO = new THREE.SphereGeometry(radius, 50, 50);

  // Création de la bulle avec le matériau
  const sphereMesh = new THREE.Mesh(sphereGEO, bubbleMaterial);

  // Position aléatoire dans le cube de 50x50x50
  sphereMesh.position.set(getRandomPosition(200), getRandomPosition(200)-200, getRandomPosition(200)+100);

  // Ajout de la bulle à la scène
  scene.add(sphereMesh);
}

// rideau start
// Création de 150 bulles aléatoires
for (let i = 0; i < 250; i++) {
  // Génération d'une taille de bulle aléatoire
  const radius = Math.random() * 1 + 0.5;  // Taille de la bulle entre 0.5 et 4.5

  // Création de la géométrie de la bulle avec une taille variable
  const sphereGEO = new THREE.SphereGeometry(radius, 50, 50);

  // Création de la bulle avec le matériau
  const sphereMesh = new THREE.Mesh(sphereGEO, bubbleMaterial);

  // Position aléatoire dans le cube de 50x50x50
  sphereMesh.position.set(getRandomPosition(30),20, getRandomPosition(25)-80);

  // Ajout de la bulle à la scène
  scene.add(sphereMesh);
}


//====================================================main page=============
const loader = new GLTFLoader();
let scale =200;

    // Charge le modèle
    loader.load("./model/cloud3.gltf", 
      (gltf) => {
        // Une fois chargé, parcourez chaque objet pour appliquer le matériau
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = cloudMaterial; // Applique le matériau cloudMaterial
            }
        });

        // Ajustez l'échelle du modèle
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(5, 0, 4);
        gltf.scene.rotation.set(180,160,0);

        // Ajoutez le modèle à la scène
        scene.add(gltf.scene);
    },
    undefined, // Fonction de progression de chargement (facultative)
    (error) => {
        console.error('Erreur de chargement du modèle GLTF:', error);
    });

    const loader2 = new GLTFLoader();
let scale2 =200;

    // Charge le modèle
    loader2.load("./model/cloud3.gltf", 
      (gltf) => {
        // Une fois chargé, parcourez chaque objet pour appliquer le matériau
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = cloudMaterial; // Applique le matériau cloudMaterial
            }
        });

        // Ajustez l'échelle du modèle
        gltf.scene.scale.set(scale2, scale2, scale2);
        gltf.scene.position.set(-50, -28, 0);
        gltf.scene.rotation.set(180,170,0);

        // Ajoutez le modèle à la scène
        scene.add(gltf.scene);
    },
    undefined, // Fonction de progression de chargement (facultative)
    (error) => {
        console.error('Erreur de chargement du modèle GLTF:', error);
    });
    const loader3 = new GLTFLoader();
    let scale3 =100;
    
        // Charge le modèle
        loader3.load("./model/cloud3.gltf", 
          (gltf) => {
            // Une fois chargé, parcourez chaque objet pour appliquer le matériau
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = cloudMaterial; // Applique le matériau cloudMaterial
                }
            });
    
            // Ajustez l'échelle du modèle
            gltf.scene.scale.set(scale3, scale3, scale3);
            gltf.scene.position.set(50, -18, -3);
            gltf.scene.rotation.set(180,210,0);
    
            // Ajoutez le modèle à la scène
            scene.add(gltf.scene);
        },
        undefined, // Fonction de progression de chargement (facultative)
        (error) => {
            console.error('Erreur de chargement du modèle GLTF:', error);
        });
        const loader4 = new GLTFLoader();
        let scale4 =100;
        
            // Charge le modèle
            loader4.load("./model/cloud3.gltf", 
              (gltf) => {
                // Une fois chargé, parcourez chaque objet pour appliquer le matériau
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material = cloudMaterial; // Applique le matériau cloudMaterial
                    }
                });
        
                // Ajustez l'échelle du modèle
                gltf.scene.scale.set(scale4, scale4, scale4);
                gltf.scene.position.set(99, -67, -31);
                gltf.scene.rotation.set(130,210,100);
        
                // Ajoutez le modèle à la scène
                scene.add(gltf.scene);
            },
            undefined, // Fonction de progression de chargement (facultative)
            (error) => {
                console.error('Erreur de chargement du modèle GLTF:', error);
            });
    


// Création de la géométrie de la bulle avec une taille variable
const sphereGEO = new THREE.SphereGeometry(2, 50, 50);

// Création de la bulle avec le matériau
const sphereMesh = new THREE.Mesh(sphereGEO, bubbleMaterial);

// Position aléatoire dans le cube de 50x50x50
sphereMesh.position.set(-8, 0, 8);

// Ajout de la bulle à la scène
scene.add(sphereMesh);



// Création de la géométrie de la bulle avec une taille variable
const sphereGEO2 = new THREE.SphereGeometry(2.3, 50, 50);

// Création de la bulle avec le matériau
const sphereMesh2 = new THREE.Mesh(sphereGEO2, bubbleMaterial);

// Position aléatoire dans le cube de 50x50x50
sphereMesh2.position.set(7, 0, -7);

// Ajout de la bulle à la scène
scene.add(sphereMesh2);



// Création de la géométrie de la bulle avec une taille variable
const sphereGEO3 = new THREE.SphereGeometry(1.5, 50, 50);

// Création de la bulle avec le matériau
const sphereMesh3 = new THREE.Mesh(sphereGEO3, bubbleMaterial);

// Position aléatoire dans le cube de 50x50x50
sphereMesh3.position.set(5, 0, -9);

// Ajout de la bulle à la scène
scene.add(sphereMesh3);

const light = new THREE.PointLight( 0xffffff, 0.2, 0, 0.01 );
light.position.set(0,0,0 );
scene.add( light );


// ===================================================================== bouger la camera avec les touches du clavier ==============
document.onkeydown = function (e){
    
    
    switch( event.keyCode ) {
        case 38: // up
        camera.position.z += 5;
        console.log(camera.position.toArray());
        break;
        case 40: // down
        camera.position.z -= 5;
        console.log(camera.position.toArray());
        break;
        case 39: // right
        camera.position.x -= 5;
        console.log(camera.position.toArray());
        break;
        case 37: // left
        camera.position.x += 5;
        console.log(camera.position.toArray());
        break;
        case 70: // forward
        camera.position.y -= 5;
        console.log(camera.position.toArray());
        break;
        case 66: // backward
        camera.position.y += 5;
        console.log(camera.position.toArray());
        break;
        default:
            break;
        }
}

//===========================================================tween scroll============================================


// File d'attente des animations
let animationQueue = [
  { to: { x: 0, y: 20, z: 0 }, duration: 1500 }, //premier menu, choix itinéraire
  { to: { x: -5, y: -10, z: 0 }, duration: 1000 }, // portfolio { x: 45, y: -10, z: 0 }    ou    cv { x: -45, y: -10, z: 0 }
  {to:{ x: -5, y: -10, z: 0 },duration:1000} //ligne jamais joué, utile pour l'enchainement
];
let isCV =false;

// Variables pour la gestion de la file d'attente
let currentAnimationIndex = 0;
let previousAnimationIndex = currentAnimationIndex-1;
console.log("start",currentAnimationIndex);
let isAnimating = false;
let isEnd = false;
affichage("a");

// Fonction pour animer la caméra
function animateCamera(to, duration) {
  return new Promise((resolve) => {
    const tween = new TWEEN.Tween(camera.position)
      .to(to, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onStart(()=>{
        affichage("a");
      })
      .onUpdate(() => {
      })
      .onComplete(() =>  
      {
        console.log("croissant",currentAnimationIndex)
        affichage(currentAnimationIndex);
        resolve();
      })
      .start();
  });
}

// Gestionnaire pour la molette
function onWheel(event) {
  if (isAnimating) return; // Empêcher l'animation si déjà en cours
  if(event.deltaY > 0 && isEnd){
    isAnimating = true;
    
    const { to, duration } = {to: {x: 0,y: 40,z: -105}, duration:2000};
    animateCamera(to, duration).then(() => {
      isAnimating = false;
      console.log("pos ",camera.position,currentAnimationIndex);
      affichage("a");
      startButton.disabled=false;
      startButton.style.visibility="visible";
      previousAnimationIndex=-1;
      currentAnimationIndex =0;
      isEnd=false;
    });
 }
 else{
      isEnd=false;
      if (event.deltaY > 0 && currentAnimationIndex < animationQueue.length-1 ) {
      startButton.disabled=true;
      startButton.style.visibility="hidden";
        isAnimating = true;
        const { to, duration } = animationQueue[currentAnimationIndex];
        animateCamera(to, duration).then(() => {
          isAnimating = false;
          console.log("pos ",camera.position,currentAnimationIndex);
          if(currentAnimationIndex!=animationQueue.length-2){
            // Scroll vers le bas (suivant)
            previousAnimationIndex=currentAnimationIndex;
            console.log(currentAnimationIndex,"+1");
            currentAnimationIndex++;
          }
          else{
            isEnd=true;
          }
        });
      }
        
      else if (event.deltaY < 0 && currentAnimationIndex > 0) {
        // Scroll vers le haut (précédent)
        startButton.disabled=true;
      startButton.style.visibility="hidden";
      previousAnimationIndex=currentAnimationIndex;
        console.log(currentAnimationIndex,"-1");
          currentAnimationIndex--;
        isAnimating = true;
        const { to, duration } = animationQueue[currentAnimationIndex];
        animateCamera(to, duration).then(() => {
          isAnimating = false;
          console.log("pos ",camera.position,currentAnimationIndex); 
        });
        
      
      }
        else if (event.deltaY < 0 && currentAnimationIndex== 0) {
            
            //console.log("Scroll Up: Animation Index", currentAnimationIndex);
            isAnimating = true;
            const { to, duration } = {to: {x: 0,y: 40,z: -105}, duration:2000};
            animateCamera(to, duration).then(() => {
              isAnimating = false;
              console.log("pos ",camera.position,currentAnimationIndex);
              affichage("a");
              startButton.disabled=false;
              startButton.style.visibility="visible";
              previousAnimationIndex=-1;
            });
        }
    }
}


// Ajouter l'événement pour la molette
window.addEventListener('wheel', onWheel, { passive: false });



// Fonction de rendu
function animate() {
  requestAnimationFrame(animate);
  updateLightPosition();
  TWEEN.update();
  renderer.render(scene, camera);
}
animate();
