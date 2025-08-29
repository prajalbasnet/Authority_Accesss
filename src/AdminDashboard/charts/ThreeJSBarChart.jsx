import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Dummy data for 3D bar chart
const data = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 15 },
  { label: "Mar", value: 7 },
  { label: "Apr", value: 20 },
  { label: "May", value: 12 },
  { label: "Jun", value: 18 },
];

const COLORS = [0x3b82f6, 0x10b981, 0xf59e42, 0xf43f5e, 0x6366f1, 0xfbbf24];

const ThreeJSBarChart = () => {
  const mountRef = useRef();

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = 350;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 20, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 20);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Draw bars
    const barWidth = 2;
    const barDepth = 2;
    const gap = 1.5;
    data.forEach((d, i) => {
      const geometry = new THREE.BoxGeometry(barWidth, d.value, barDepth);
      const material = new THREE.MeshPhongMaterial({ color: COLORS[i % COLORS.length] });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = i * (barWidth + gap) - ((data.length - 1) * (barWidth + gap)) / 2;
      bar.position.y = d.value / 2;
      scene.add(bar);
    });

    // Add axes (simple lines)
    const axesMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const points = [
      [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)], // X
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 25, 0)], // Y
      [new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 10)], // Z
    ];
    points.forEach(([start, end]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const line = new THREE.Line(geometry, axesMaterial);
      scene.add(line);
    });

    // Animation
    let frameId;
    const animate = () => {
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-semibold mb-2">3D Bar Chart (Three.js)</h3>
      <div ref={mountRef} style={{ width: "100%", height: 350 }} />
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

export default ThreeJSBarChart;
