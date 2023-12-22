import * as THREE from 'three'

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

scene.background = new THREE.Color(0xffffff)

function createSmallSphere(color, position, parent) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color })
  )
  sphere.position.copy(position)
  parent.add(sphere)
}

const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

const octahedronFaceMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.3
})

const octahedronEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })

const octahedronGeometry = new THREE.OctahedronGeometry(0.8)
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronFaceMaterial)
scene.add(octahedron)

const octahedronWireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(octahedronGeometry),
  octahedronEdgeMaterial
)
octahedron.add(octahedronWireframe)

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

const cubeFaceMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.0
})

const cubeEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cube = new THREE.Mesh(cubeGeometry, cubeFaceMaterial)
octahedron.add(cube)

const cubeWireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeGeometry),
  cubeEdgeMaterial
)
cube.add(cubeWireframe)

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

camera.position.z = 5

let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

function rotateScene() {
  sphere.rotation.y += 0.005
  octahedron.rotation.y += 0.005

  previousMousePosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

renderer.domElement.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mouseup', handleMouseUp)
renderer.domElement.addEventListener('mousemove', handleMouseMove)

renderer.domElement.addEventListener('touchstart', handleTouchStart, {
  passive: false
})
document.addEventListener('touchend', handleTouchEnd)
renderer.domElement.addEventListener('touchmove', handleTouchMove, {
  passive: false
})

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

  sphere.rotation.y += deltaX * 0.01
  octahedron.rotation.y += deltaX * 0.01

  sphere.rotation.x += deltaY * 0.01
  octahedron.rotation.x += deltaY * 0.01

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

function handleTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault()
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

  sphere.rotation.y += deltaX * 0.01
  octahedron.rotation.y += deltaX * 0.01

  sphere.rotation.x += deltaY * 0.01
  octahedron.rotation.x += deltaY * 0.01

  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

function handleWindowResize() {
  const newWidth = window.innerWidth
  const newHeight = window.innerHeight

  renderer.setSize(newWidth, newHeight)
  camera.aspect = newWidth / newHeight
  camera.updateProjectionMatrix()
}

function animate() {
  requestAnimationFrame(animate)

  if (!isDragging) {
    rotateScene()
  }

  renderer.render(scene, camera)
}

animate()
