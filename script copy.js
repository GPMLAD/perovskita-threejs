// index.js
import * as THREE from './node_modules/three/build/three.module.js'

const mainElement = document.getElementsByTagName("main")[0]

function criarUnidade() {
  const unidade = new THREE.Group();

  // Criar oito esferas vermelhas
  const esferasVermelhas = [];
  const verticesEsferas = [
    new THREE.Vector3(-0.5, -0.5, -0.5),
    new THREE.Vector3(-0.5, -0.5, 0.5),
    new THREE.Vector3(-0.5, 0.5, -0.5),
    new THREE.Vector3(-0.5, 0.5, 0.5),
    new THREE.Vector3(0.5, -0.5, -0.5),
    new THREE.Vector3(0.5, -0.5, 0.5),
    new THREE.Vector3(0.5, 0.5, -0.5),
    new THREE.Vector3(0.5, 0.5, 0.5),
  ];

  verticesEsferas.forEach((vertice) => {
    const esfera = criarEsfera(0.1, 0xff0000); // Vermelho
    esfera.position.copy(vertice);
    esferasVermelhas.push(esfera);
    unidade.add(esfera);
  });

  // Criar um octaedro branco
  const octaedro = new THREE.Group();
  const verticesOctaedro = [
    new THREE.Vector3(0.3, 0, 0),
    new THREE.Vector3(-0.3, 0, 0),
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(0, -0.3, 0),
    new THREE.Vector3(0, 0, 0.3),
    new THREE.Vector3(0, 0, -0.3),
  ];

  verticesOctaedro.forEach((vertice) => {
    const esfera = criarEsfera(0.05, 0xffffff); // Branco
    esfera.position.copy(vertice);
    octaedro.add(esfera);
  });

  unidade.add(octaedro);

  // Criar uma pequena esfera verde no centro de tudo
  const esferaVerde = criarEsfera(0.03, 0x00ff00); // Verde
  unidade.add(esferaVerde);

  return unidade;
}

// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
mainElement.appendChild(renderer.domElement);

// Criar o cubo formado por oito unidades
const cubo = new THREE.Group();
const unidades = [];

const posicoesUnidades = [
  new THREE.Vector3(-1, -1, -1),
  new THREE.Vector3(-1, -1, 1),
  new THREE.Vector3(-1, 1, -1),
  new THREE.Vector3(-1, 1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(1, 1, -1),
  new THREE.Vector3(1, 1, 1),
];

posicoesUnidades.forEach((posicao) => {
  const unidade = criarUnidade();
  unidade.position.copy(posicao);
  unidades.push(unidade);
  cubo.add(unidade);
});

// Adicionar o cubo à cena
scene.add(cubo);

// Configurar a câmera
camera.position.z = 5;

// Função para criar uma esfera colorida
function criarEsfera(raio, cor) {
  const geometria = new THREE.SphereGeometry(raio, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: cor });
  return new THREE.Mesh(geometria, material);
}

// Função de animação
const animate = function () {
  requestAnimationFrame(animate);

  // Rotacionar o cubo e todas as suas unidades
  cubo.rotation.x += 0.001;
  cubo.rotation.y += 0.001;

  // Rotacionar cada unidade em torno de seu próprio eixo
  //unidades.forEach((unidade) => {
//    unidade.rotation.x += 0.01;
//    unidade.rotation.y += 0.01;
  //});

  renderer.render(scene, camera);
};

// Iniciar a animação
animate();