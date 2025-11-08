// ThreeJSHumanModel.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ThreeJSHumanModel = ({ 
  width = 400, 
  height = 600, 
  showControls = true,
  animateGesture = false,
  gestureType = 'wave' 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const humanRef = useRef(null);
  const animationIdRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x4080ff, 0.3);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    // Create human figure
    createHumanFigure(scene);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xcccccc,
      transparent: true,
      opacity: 0.5
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (animateGesture && humanRef.current) {
        animateHumanGesture();
      }
      
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Mouse controls for camera
    if (showControls) {
      setupMouseControls();
    }

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height, showControls]);

  const createHumanFigure = (scene) => {
    try {
      const humanGroup = new THREE.Group();
      humanRef.current = humanGroup;

      // Body proportions (based on average human proportions)
      const headHeight = 0.25;
      const torsoHeight = 0.6;
      const armLength = 0.7;
      const legLength = 0.9;

      // Materials
      const skinMaterial = new THREE.MeshLambertMaterial({ color: 0xfdbcb4 });
      const clothingMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
      const pantsMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
      const shoeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

      // Head
      const headGeometry = new THREE.SphereGeometry(headHeight / 2, 16, 16);
      const head = new THREE.Mesh(headGeometry, skinMaterial);
      head.position.y = 1.75;
      head.castShadow = true;
      humanGroup.add(head);

      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.06, 1.78, 0.1);
      humanGroup.add(leftEye);
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.06, 1.78, 0.1);
      humanGroup.add(rightEye);

      // Torso
      const torsoGeometry = new THREE.BoxGeometry(0.4, torsoHeight, 0.2);
      const torso = new THREE.Mesh(torsoGeometry, clothingMaterial);
      torso.position.y = 1.2;
      torso.castShadow = true;
      humanGroup.add(torso);

      // Arms
      const armGeometry = new THREE.CapsuleGeometry(0.05, armLength - 0.1, 8, 16);
      
      // Left arm
      const leftUpperArm = new THREE.Mesh(armGeometry, skinMaterial);
      leftUpperArm.position.set(-0.3, 1.4, 0);
      leftUpperArm.rotation.z = Math.PI / 6;
      leftUpperArm.castShadow = true;
      humanGroup.add(leftUpperArm);
      
      // Right arm  
      const rightUpperArm = new THREE.Mesh(armGeometry, skinMaterial);
      rightUpperArm.position.set(0.3, 1.4, 0);
      rightUpperArm.rotation.z = -Math.PI / 6;
      rightUpperArm.castShadow = true;
      humanGroup.add(rightUpperArm);

      // Hands
      const handGeometry = new THREE.SphereGeometry(0.08, 12, 12);
      
      const leftHand = new THREE.Mesh(handGeometry, skinMaterial);
      leftHand.position.set(-0.5, 1.0, 0.1);
      leftHand.castShadow = true;
      humanGroup.add(leftHand);
      
      const rightHand = new THREE.Mesh(handGeometry, skinMaterial);
      rightHand.position.set(0.5, 1.0, 0.1);
      rightHand.castShadow = true;
      humanGroup.add(rightHand);

      // Store hand references for animation
      humanGroup.leftHand = leftHand;
      humanGroup.rightHand = rightHand;

      // Legs
      const legGeometry = new THREE.CapsuleGeometry(0.08, legLength - 0.16, 8, 16);
      
      const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      leftLeg.position.set(-0.12, 0.5, 0);
      leftLeg.castShadow = true;
      humanGroup.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
      rightLeg.position.set(0.12, 0.5, 0);
      rightLeg.castShadow = true;
      humanGroup.add(rightLeg);

      // Feet
      const footGeometry = new THREE.BoxGeometry(0.12, 0.06, 0.25);
      
      const leftFoot = new THREE.Mesh(footGeometry, shoeMaterial);
      leftFoot.position.set(-0.12, 0.03, 0.08);
      leftFoot.castShadow = true;
      humanGroup.add(leftFoot);
      
      const rightFoot = new THREE.Mesh(footGeometry, shoeMaterial);
      rightFoot.position.set(0.12, 0.03, 0.08);
      rightFoot.castShadow = true;
      humanGroup.add(rightFoot);

      scene.add(humanGroup);
    } catch (err) {
      console.error('Error creating human figure:', err);
      setError('Failed to create 3D model');
    }
  };

  const animateHumanGesture = () => {
    if (!humanRef.current) return;

    const time = Date.now() * 0.003;
    
    switch (gestureType) {
      case 'wave':
        if (humanRef.current.rightHand) {
          humanRef.current.rightHand.position.y = 1.3 + Math.sin(time * 3) * 0.1;
          humanRef.current.rightHand.position.x = 0.5 + Math.sin(time * 2) * 0.1;
        }
        break;
        
      case 'asl_a':
        // Simulate ASL 'A' gesture
        if (humanRef.current.rightHand) {
          humanRef.current.rightHand.position.y = 1.4;
          humanRef.current.rightHand.position.x = 0.3;
          humanRef.current.rightHand.position.z = 0.2;
        }
        break;
        
      case 'point':
        if (humanRef.current.rightHand) {
          humanRef.current.rightHand.position.y = 1.2;
          humanRef.current.rightHand.position.x = 0.4;
          humanRef.current.rightHand.position.z = 0.3;
        }
        break;
        
      default:
        // Idle breathing animation
        if (humanRef.current.children[2]) { // Torso
          humanRef.current.children[2].scale.y = 1 + Math.sin(time) * 0.02;
        }
    }
  };

  const setupMouseControls = () => {
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const onMouseMove = (event) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      if (humanRef.current) {
        humanRef.current.rotation.y += deltaX * 0.01;
        humanRef.current.rotation.x += deltaY * 0.01;
        
        // Limit vertical rotation
        humanRef.current.rotation.x = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 4, humanRef.current.rotation.x)
        );
      }
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    if (mountRef.current) {
      mountRef.current.addEventListener('mousemove', onMouseMove);
      mountRef.current.addEventListener('mousedown', onMouseDown);
      mountRef.current.addEventListener('mouseup', onMouseUp);
      mountRef.current.addEventListener('mouseleave', onMouseUp);
    }
  };

  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gradient-to-b from-blue-50 to-white"
        style={{ width, height }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error loading model</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {showControls && !isLoading && !error && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          Click and drag to rotate
        </div>
      )}
    </div>
  );
};

export default ThreeJSHumanModel;