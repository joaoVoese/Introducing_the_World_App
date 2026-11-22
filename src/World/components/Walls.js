import {
  Group,
  Mesh,
  BoxGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
} from 'three';

function createWalls() {
  const roomGroup = new Group();

  const whiteWallMat = new MeshStandardMaterial({
    color: 0xf2f2f2,
    roughness: 0.9,
  });

  const darkWallMat = new MeshStandardMaterial({
    color: 0x1a1a1c, // Parede escura à direita (sem letras)
    roughness: 0.85,
  });

  const ceilingMat = new MeshStandardMaterial({
    color: 0xededed,
    roughness: 1.0,
  });

  // 1. Teto (altura Y = 3.0m)
  const ceiling = new Mesh(new PlaneGeometry(5, 5), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3.0;
  roomGroup.add(ceiling);

  // 2. Parede Escura (Direita, em X = 2.5)
  const rightWall = new Mesh(new PlaneGeometry(5, 3.0), darkWallMat);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(2.5, 1.5, 0);
  rightWall.receiveShadow = true;
  roomGroup.add(rightWall);

  // 3. Parede do Fundo com vão da Janela (em Z = -2.5)
  // Parte inferior (abaixo da janela)
  const wallBottom = new Mesh(new BoxGeometry(5, 1.0, 0.15), whiteWallMat);
  wallBottom.position.set(0, 0.5, -2.5);
  wallBottom.receiveShadow = true;

  // Parte superior (acima da janela, onde vai o ar-condicionado)
  const wallTop = new Mesh(new BoxGeometry(5, 0.65, 0.15), whiteWallMat);
  wallTop.position.set(0, 2.675, -2.5);
  wallTop.receiveShadow = true;

  // Pilar esquerdo da janela
  const wallLeft = new Mesh(new BoxGeometry(0.4, 1.35, 0.15), whiteWallMat);
  wallLeft.position.set(-2.3, 1.675, -2.5);
  wallLeft.receiveShadow = true;

  // Pilar direito da janela (canto próximo à planta)
  const wallRight = new Mesh(new BoxGeometry(1.4, 1.35, 0.15), whiteWallMat);
  wallRight.position.set(1.8, 1.675, -2.5);
  wallRight.receiveShadow = true;

  roomGroup.add(wallBottom, wallTop, wallLeft, wallRight);

  // 4. Janela (Esquadrias metálicas + Vidro escuro da noite)
  const windowGroup = new Group();
  const frameMat = new MeshStandardMaterial({
    color: 0xc8ccd0,
    metalness: 0.6,
    roughness: 0.35,
  });

  const glassMat = new MeshStandardMaterial({
    color: 0x090c10,
    metalness: 0.85,
    roughness: 0.1,
  });

  // Vidro único atrás das esquadrias (largura 3.2m, altura 1.35m)
  const glass = new Mesh(new PlaneGeometry(3.2, 1.35), glassMat);
  glass.position.set(-0.5, 1.675, -2.54);
  windowGroup.add(glass);

  // Barras horizontais da janela (base, meio, topo)
  const hPositions = [1.02, 1.675, 2.33];
  hPositions.forEach((yPos) => {
    const hBar = new Mesh(new BoxGeometry(3.2, 0.05, 0.08), frameMat);
    hBar.position.set(-0.5, yPos, -2.5);
    windowGroup.add(hBar);
  });

  // Barras verticais dividindo a janela em 3 colunas
  const vPositions = [-2.08, -1.02, 0.04, 1.08];
  vPositions.forEach((xPos) => {
    const vBar = new Mesh(new BoxGeometry(0.05, 1.35, 0.08), frameMat);
    vBar.position.set(xPos, 1.675, -2.5);
    windowGroup.add(vBar);
  });

  roomGroup.add(windowGroup);

  return roomGroup;
}

export { createWalls };