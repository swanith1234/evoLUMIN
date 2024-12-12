import React from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RotatingCube = () => {
  const createTextTexture = (letter, color = "red", bgColor = "gray") => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    // Background
    context.fillStyle = bgColor;
    context.fillRect(0, 0, size, size);

    // Text
    context.fillStyle = color;
    context.font = `${size / 2}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(letter, size / 2, size / 2);

    return new THREE.CanvasTexture(canvas);
  };

  const materials = [
    new THREE.MeshBasicMaterial({ map: createTextTexture("M") }), // Right
    new THREE.MeshBasicMaterial({ map: createTextTexture("C") }), // Left
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Top (green)
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bottom (blue)
    new THREE.MeshBasicMaterial({ map: createTextTexture("S") }), // Front
    new THREE.MeshBasicMaterial({ map: createTextTexture("A") }), // Back
  ];

  const meshRef = React.useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = -elapsedTime * 3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={new THREE.BoxGeometry(1, 1, 1)}
      material={materials}
    />
  );
};

const Loader = ({ show }) => {
  console.log(show);
  if (!show) return null; // If not showing, render nothing.

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(144, 161, 125, 0.6)", // Light wrapper effect with transparency
        inset: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)", // Optional: Adds a subtle blur to the background
      }}
    >
      <Canvas>
        <ambientLight />
        <RotatingCube />
      </Canvas>
    </div>
  );
};

export default Loader;
