import * as THREE from './node_modules/three/build/three.module.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Defina a cor de fundo da cena como branca
scene.background = new THREE.Color(0xffffff)

// Função para criar uma esfera pequena
function createSmallSphere(color, position, parent) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color })
  )
  sphere.position.copy(position)
  parent.add(sphere)
}

// Crie uma esfera azul
const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

// Crie um material para as faces do octaedro
const octahedronFaceMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.3
})

// Crie um material para as arestas do octaedro
const octahedronEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })

// Crie um octaedro com faces vermelhas e arestas pretas
const octahedronGeometry = new THREE.OctahedronGeometry(0.8)
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronFaceMaterial)
scene.add(octahedron)

// Crie um wireframe (linhas) para as arestas do octaedro
const octahedronWireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(octahedronGeometry),
  octahedronEdgeMaterial
)
octahedron.add(octahedronWireframe)

// Adicione pequenas esferas vermelhas nos vértices do octaedro
const vertices = octahedronGeometry.attributes.position.array
vertices.forEach((_, i) => {
  if (i % 3 === 0) {
    createSmallSphere(
      0xff0000,
      new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]),
      octahedron
    )
  }
})

// Crie um material para as faces do cubo
const cubeFaceMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00, // Verde
  transparent: true,
  opacity: 0.0
})

// Crie um material para as arestas do cubo
const cubeEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })

// Crie um cubo com faces verdes e arestas pretas
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cube = new THREE.Mesh(cubeGeometry, cubeFaceMaterial)
octahedron.add(cube)

// Crie um wireframe (linhas) para as arestas do cubo
const cubeWireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeGeometry),
  cubeEdgeMaterial
)
cube.add(cubeWireframe)

// Adicione pequenas esferas verdes nos vértices do cubo
const cubeVertices = cubeGeometry.attributes.position.array
cubeVertices.forEach((_, i) => {
  if (i % 3 === 0) {
    createSmallSphere(
      0x00ff00,
      new THREE.Vector3(
        cubeVertices[i],
        cubeVertices[i + 1],
        cubeVertices[i + 2]
      ),
      cube
    )
  }
})

// Posicione a câmera para que possamos ver a esfera, o octaedro e o cubo
camera.position.z = 5

// Variáveis para controle de rotação
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

// Adicione uma rotação contínua à cena
function rotateScene() {
  // Faça a esfera e o octaedro girarem continuamente
  sphere.rotation.y += 0.005
  octahedron.rotation.y += 0.005

  // Atualize a posição do mouse para o próximo frame
  previousMousePosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

// Adicione eventos de mouse limitados ao elemento do renderizador
renderer.domElement.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mouseup', handleMouseUp)
renderer.domElement.addEventListener('mousemove', handleMouseMove)

// Adicione eventos de toque limitados ao elemento do renderizador
renderer.domElement.addEventListener('touchstart', handleTouchStart, {
  passive: false
})
document.addEventListener('touchend', handleTouchEnd)
renderer.domElement.addEventListener('touchmove', handleTouchMove, {
  passive: false
})

// Adicione um manipulador de eventos para redimensionar a janela
window.addEventListener('resize', handleWindowResize)

function handleMouseDown(event) {
  isDragging = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

function handleMouseUp() {
  isDragging = false
}

function handleMouseMove(event) {
  if (!isDragging) return

  const deltaX = event.clientX - previousMousePosition.x
  const deltaY = event.clientY - previousMousePosition.y

  // Faça a esfera e o octaedro girarem com base no movimento do mouse
  sphere.rotation.y += deltaX * 0.01
  octahedron.rotation.y += deltaX * 0.01

  sphere.rotation.x += deltaY * 0.01
  octahedron.rotation.x += deltaY * 0.01

  // Atualize a posição do mouse para o próximo frame
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

function handleTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault() // Evita o comportamento padrão de toque (scroll/zoom)
    isDragging = true
    previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }
}

function handleTouchEnd() {
  isDragging = false
}

function handleTouchMove(event) {
  if (!isDragging || event.touches.length !== 1) return

  const deltaX = event.touches[0].clientX - previousMousePosition.x
  const deltaY = event.touches[0].clientY - previousMousePosition.y

  // Faça a esfera e o octaedro girarem com base no movimento do toque
  sphere.rotation.y += deltaX * 0.01
  octahedron.rotation.y += deltaX * 0.01

  sphere.rotation.x += deltaY * 0.01
  octahedron.rotation.x += deltaY * 0.01

  // Atualize a posição do toque para o próximo frame
  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

// Manipulador de evento de redimensionamento da janela
function handleWindowResize() {
  const newWidth = window.innerWidth
  const newHeight = window.innerHeight

  // Atualize o tamanho do renderizador e a relação de aspecto da câmera
  renderer.setSize(newWidth, newHeight)
  camera.aspect = newWidth / newHeight
  camera.updateProjectionMatrix()
}

// Adicione uma função de animação
function animate() {
  requestAnimationFrame(animate)

  // Execute a rotação contínua da cena
  if (!isDragging) {
    rotateScene()
  }

  // Renderize a cena
  renderer.render(scene, camera)
}

// Chame a função de animação
animate()
