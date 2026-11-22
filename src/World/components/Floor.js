import {
  PlaneGeometry,
  MeshStandardMaterial,
  Mesh,
  GridHelper,
  Group,
} from 'three';

function createFloor() {
  const floorGroup = new Group();

  // Piso porcelanato claro
  const geometry = new PlaneGeometry(5, 5);
  const material = new MeshStandardMaterial({
    color: 0xe6e6e6,
    roughness: 0.4,
    metalness: 0.1,
  });

  const floorMesh = new Mesh(geometry, material);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;

  // Linhas sutis do rejunte do piso
  const grid = new GridHelper(5, 10, 0xbbbbbb, 0xcccccc);
  grid.position.y = 0.001;

  floorGroup.add(floorMesh, grid);
  return floorGroup;
}

export { createFloor };