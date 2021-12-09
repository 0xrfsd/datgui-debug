import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from 'gsap';

import * as dat from "dat.gui";

/*
Debug
*/
const gui = new dat.GUI({ closed: true });

function App() {
  const [count, setCount] = useState(0);

  function main() {
    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector("#c");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Cube
     */
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(cube);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(cube1);
    cube1.position.y = -0.5;

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(cube2);
    cube2.position.y = 0.5;

    // Debug
    gui.add(cube.position, "y").min(-1).max(1).step(0.01).name("Elevation");
    gui.add(cube.position, "x").min(-1).max(1).step(0.01).name("Variation");
    gui.add(cube.position, "z").min(-1).max(1).step(0.01).name("Variation");
    gui.add(cube, "visible");

    gui.add(cube.material, "wireframe");
    gui.add(cube1.material, "wireframe");
    gui.add(cube2.material, "wireframe");

    const parameters = {
      color: 0xff0000,
      spin: () => {
        gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + 5 })
      },
    };

    gui.addColor(parameters, "color").onChange(() => {
      cube.material.color.set(parameters.color);
    });

    gui.add(parameters, 'spin');

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let lastElapsedTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="App">
      <canvas id="c"></canvas>
    </div>
  );
}

export default App;
