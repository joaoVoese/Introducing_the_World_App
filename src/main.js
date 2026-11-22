import { World } from './World/World.js';

async function main() {
  // Obtém a referência do container HTML onde a cena será renderizada
  const container = document.querySelector('#scene-container');

  // 1. Cria uma instância da aplicação World
  const world = new World(container);

  // 2. Aguarda o carregamento da física (Rapier) e dos modelos 3D
  await world.init();

  // 3. Inicia o loop de renderização
  world.render();
}

main().catch((err) => {
  console.error('Erro ao inicializar a cena:', err);
});