import * as THREE from 'three';

class Camera {
  static create() {
    const camera = new THREE.PerspectiveCamera(
      58, // fov = Field Of View | amplitude vertical da visão da câmera em graus
      1, // aspect ratio (dummy value)
      0.1, // near clipping plane
      100, // far clipping plane
    );

    // posiciona a câmera dentro da sala enquadrando a janela, o sofá e a parede escura
    camera.position.set(-0.35, 1.25, 1.95);

    return camera;
  }
}

export { Camera };