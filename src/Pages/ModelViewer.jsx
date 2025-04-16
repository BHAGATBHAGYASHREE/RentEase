import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const Model = ({ path }) => {
  const { scene } = useGLTF(path); // Load the model
  return <primitive object={scene} />;
};

const ModelViewer = ({ modelPath }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Model path={modelPath} />
    </Canvas>
  );
};

export default ModelViewer;
