import {
  Group,
  Mesh,
  CylinderGeometry,
  MeshStandardMaterial,
  PointLight,
} from 'three';

function createLamp() {
  const lampGroup = new Group();

  // Tubo central aceso (emissivo)
  const tubeGeo = new CylinderGeometry(0.025, 0.025, 1.3, 16);
  const tubeMat = new MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf4f8ff,
    emissiveIntensity: 2.5,
    roughness: 0.2,
  });
  const tube = new Mesh(tubeGeo, tubeMat);
  tube.rotation.z = Math.PI / 2;

  // Soquetes das duas pontas
  const capGeo = new CylinderGeometry(0.032, 0.032, 0.14, 16);
  const capMat = new MeshStandardMaterial({
    color: 0xe0e0e0,
    roughness: 0.5,
  });

  const leftCap = new Mesh(capGeo, capMat);
  leftCap.rotation.z = Math.PI / 2;
  leftCap.position.x = -0.7;

  const rightCap = new Mesh(capGeo, capMat);
  rightCap.rotation.z = Math.PI / 2;
  rightCap.position.x = 0.7;

  // Luz real emitida pela luminária para iluminar a sala e gerar sombras
  const mainLight = new PointLight(0xf5f8ff, 12, 12, 1.5);
  mainLight.position.set(0, -0.08, 0);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;

  lampGroup.add(tube, leftCap, rightCap, mainLight);

  // Posiciona no teto na diagonal, como na foto
  lampGroup.position.set(0.6, 2.95, -0.8);
  lampGroup.rotation.y = -0.35;

  return lampGroup;
}

export { createLamp };