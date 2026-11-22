import {
  Group,
  Mesh,
  PlaneGeometry,
  CylinderGeometry,
  MeshStandardMaterial,
  DoubleSide,
} from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

async function createBlinds() {
  // Inicializa o motor de física Rapier
  await RAPIER.init();
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const physicsWorld = new RAPIER.World(gravity);

  const blindsGroup = new Group();

  const fabricMat = new MeshStandardMaterial({
    color: 0xd6d7db,
    roughness: 0.85,
    side: DoubleSide,
  });

  const rollerMat = new MeshStandardMaterial({
    color: 0xefefef,
    roughness: 0.4,
  });

  // --- CORTINA ESQUERDA (Fixa, mais recolhida, como na imagem) ---
  const leftRoller = new Mesh(new CylinderGeometry(0.025, 0.025, 1.06, 16), rollerMat);
  leftRoller.rotation.z = Math.PI / 2;
  leftRoller.position.set(-1.55, 2.34, -2.41);

  const leftFabric = new Mesh(new PlaneGeometry(1.04, 0.16), fabricMat);
  leftFabric.position.set(-1.55, 2.26, -2.41);
  blindsGroup.add(leftRoller, leftFabric);

  // --- CORTINA DIREITA (Animada em loop com Rapier) ---
  const topY = 2.34;
  const centerX = 0.03;
  const posZ = -2.41;

  // Rolo superior
  const rightRoller = new Mesh(new CylinderGeometry(0.025, 0.025, 2.1, 16), rollerMat);
  rightRoller.rotation.z = Math.PI / 2;
  rightRoller.position.set(centerX, topY, posZ);

  // Tecido com pivô deslocado para o topo (permite esticar para baixo)
  const fabricGeo = new PlaneGeometry(2.08, 1.0);
  fabricGeo.translate(0, -0.5, 0);
  const rightFabric = new Mesh(fabricGeo, fabricMat);
  rightFabric.position.set(centerX, topY, posZ);
  rightFabric.castShadow = true;

  // Barra inferior de acabamento da cortina
  const bottomBarMesh = new Mesh(new CylinderGeometry(0.012, 0.012, 2.08, 12), rollerMat);
  bottomBarMesh.rotation.z = Math.PI / 2;

  blindsGroup.add(rightRoller, rightFabric, bottomBarMesh);

  // Corpo rígido cinemático no Rapier para controlar o movimento da barra inferior
  const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
    .setTranslation(centerX, topY - 0.5, posZ);
  const barRigidBody = physicsWorld.createRigidBody(rigidBodyDesc);

  let elapsedTime = 0;

  // Método chamado automaticamente a cada frame pelo Loop.js
  blindsGroup.tick = (delta) => {
    elapsedTime += delta;

    // Oscila suavemente entre 0.15m (subida) e 1.25m (descida)
    const dropLength = 0.7 + 0.55 * Math.sin(elapsedTime * 1.2);
    const targetY = topY - dropLength;

    // Atualiza a posição no Rapier e avança a simulação
    barRigidBody.setNextKinematicTranslation({ x: centerX, y: targetY, z: posZ });
    physicsWorld.step();

    // Lê a posição calculada pelo Rapier e atualiza os objetos 3D
    const bodyPos = barRigidBody.translation();
    bottomBarMesh.position.set(bodyPos.x, bodyPos.y, bodyPos.z);
    rightFabric.scale.y = topY - bodyPos.y;
  };

  return blindsGroup;
}

export { createBlinds };