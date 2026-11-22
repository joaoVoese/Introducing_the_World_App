import { Group, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadModelSafe(loader, path) {
  try {
    const data = await loader.loadAsync(path);
    return data.scene;
  } catch (err) {
    console.warn(`Aviso: Não foi possível carregar ${path}.`, err);
    return null;
  }
}

async function loadFurniture() {
  const loader = new GLTFLoader();
  const furnitureGroup = new Group();

  const [sofa, armchair, cushionBase, plant, ac] = await Promise.all([
    loadModelSafe(loader, './src/World/assets/sofa.glb'),
    loadModelSafe(loader, './src/World/assets/armchair.glb'),
    loadModelSafe(loader, './src/World/assets/cushion.glb'),
    loadModelSafe(loader, './src/World/assets/plant.glb'),
    loadModelSafe(loader, './src/World/assets/ac.glb'),
  ]);

  // 1. Sofá Preto (desencostado da parede z = -2.5, sem atravessar)
  if (sofa) {
    sofa.position.set(-0.6, 0, -1.78);
    sofa.rotation.y = -Math.PI / 2;
    sofa.scale.set(0.85, 0.85, 0.85);
    furnitureGroup.add(sofa);
  }

  // 2. Poltrona Marrom (virada para o centro/sofá, como na foto)
  if (armchair) {
    armchair.position.set(1.65, 0, -1.25);
    armchair.rotation.y = -2.1; // Se ainda precisar girar 180°, troque para 1.05
    armchair.scale.set(1.0, 1.0, 1.0);
    furnitureGroup.add(armchair);
  }

  // 3. Planta no vaso (no canto entre o sofá e a poltrona)
  if (plant) {
    plant.position.set(1.05, 0, -2.05);
    plant.scale.set(0.28, 0.28, 0.28);
    furnitureGroup.add(plant);
  }

  // 4. Aparelho de Ar-Condicionado (acima da janela, sem tubulação)
  if (ac) {
    ac.position.set(-1.1, 2.68, -2.30);
    ac.rotation.y = Math.PI; // Vira a frente do aparelho para a sala
    ac.scale.set(0.18, 0.18, 0.18);
    furnitureGroup.add(ac);
  }
  // 5. Quatro Almofadas Coloridas apoiadas diretamente no assento do sofá
  if (cushionBase) {
    const cushionConfigs = [
      { color: 0x6a5acd, pos: [-1.15, 0.35, -1.74], rot: [0.45, 0.25, -0.1] },  // Roxa (esquerda)
      { color: 0xd83b8a, pos: [-0.42, 0.36, -1.78], rot: [0.55, -0.1, 0.05] },  // Pink (centro)
      { color: 0x6ec6e6, pos: [-0.18, 0.38, -1.83], rot: [0.65, -0.15, 0.08] }, // Azul claro (atrás da pink)
      { color: 0xf2a694, pos: [0.05, 0.38, -1.83],  rot: [0.60, -0.25, -0.05] },// Salmão (direita)
    ];

    cushionConfigs.forEach((cfg) => {
      const cushion = cushionBase.clone();
      cushion.position.set(...cfg.pos);
      cushion.rotation.set(...cfg.rot);
      cushion.scale.set(0.30, 0.30, 0.30);

      cushion.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.color = new Color(cfg.color);
          child.castShadow = true;
        }
      });

      furnitureGroup.add(cushion);
    });
  }

  // Habilita sombras em todos os modelos carregados
  furnitureGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return furnitureGroup;
}

export { loadFurniture };