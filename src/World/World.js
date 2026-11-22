import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Light } from './components/Light.js';

// Novos componentes da cena da sala
import { createFloor } from './components/Floor.js';
import { createWalls } from './components/Walls.js';
import { createLamp } from './components/Lamp.js';
import { createBlinds } from './components/Blinds.js';
import { loadFurniture } from './components/Furniture.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';

// Variáveis no escopo do módulo
let camera;
let renderer;
let scene;
let controls;
let resizer;
let mainGroup;
let blinds;
let clock;

class World {
  constructor(container) {
    camera = Camera.create();
    renderer = Renderer.create();
    renderer.shadowMap.enabled = true; // Habilita sombras reais na cena

    container.append(renderer.domElement);
    resizer = new Resizer(container, camera, renderer);
    clock = new THREE.Clock();

    // Permite controle da câmera com mouse e teclado  
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);
    controls.target.set(0.25, 1.55, -1.8);
    controls.update();

    // Mostra controle de propriedades na tela (dat.GUI)
    const guiControls = new GuiControls();
    
    // -- SCENE init --    
    scene = Scene.create();    
    Scene.addGridHelper(scene, 10, 10).helper.visible = false;
    Scene.addAxesHelper(scene, 5).helper.visible = false;
    Scene.addCameraHelper(scene, camera).helper.visible = false;
    Scene.setBackgroundColor(scene, 0x090c10); // Fundo escuro para o exterior da janela

    // Grupo de objetos principal
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Adiciona estrutura da sala e luminária
    const floor = createFloor();
    const walls = createWalls();
    const lamp = createLamp();

    mainGroup.add(floor, walls, lamp);

    // Iluminação ambiente suave
    const ambientLight = Light.createAmbientLight(0xffffff, 0.6);
    mainGroup.add(ambientLight);
    
    // Controles do dat.GUI (sem addLightFolder para evitar conflito com luzes customizadas)
    guiControls.addCameraFolder(camera, controls);
    guiControls.addSceneFolder(scene);
    guiControls.datGui.open();
  }

  // Carrega de forma assíncrona a física do Rapier (cortina) e os modelos .glb
  async init() {
    blinds = await createBlinds();
    mainGroup.add(blinds);

    // Descomente as duas linhas abaixo quando os 5 arquivos .glb estiverem na pasta public/assets/
    const furniture = await loadFurniture();
    mainGroup.add(furniture);
  }

  render() {
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      // Atualiza a animação física da cortina no Rapier a cada frame
      if (blinds && blinds.tick) {
        blinds.tick(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    });
  }
}

export { World };