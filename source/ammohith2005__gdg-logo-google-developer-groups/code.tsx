

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Component = () => {
  const groupRef = useRef<THREE.Group>(null); // Specify the type for the ref

  // Add continuous rotation to the entire group
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5; // Continuous rotation along the Y-axis
    }
  });

  // Function to create a rounded rectangle shape
  const createRoundedBar = () => {
    const shape = new THREE.Shape();
    const width = 1.6; // Increased size
    const height = 0.6; // Increased height
    const radius = 0.3; // Adjusted for proportion

    // Create a rounded rectangle
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    return shape;
  };

  // Extrude geometry settings
  const extrudeSettings = {
    steps: 1,
    depth: 0.5, // Increased thickness for better visibility
    bevelEnabled: false,
  };

  return (
    <group ref={groupRef}> {/* Add rotation to the entire group */}
      {/* Left symbol (<) */}
      <mesh position={[-1.2, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}> {/* Red bar with reduced gap */}
        <extrudeGeometry args={[createRoundedBar(), extrudeSettings]} />
        <meshPhysicalMaterial
          color="#DB4437" // Red
          metalness={0.0} // Set to 0 for a non-metallic look
          roughness={0.3} // Increased roughness for better visibility
          transparent={false} // Ensure transparency is off
          polygonOffset={true} // Enable polygon offset
          polygonOffsetFactor={1} // Adjust factor as needed
        />
      </mesh>
      <mesh position={[-1.2, -0.4, 0]} rotation={[0, 0, -Math.PI / 4]}> {/* Blue bar with reduced gap */}
        <extrudeGeometry args={[createRoundedBar(), extrudeSettings]} />
        <meshStandardMaterial
          color="#4285F4" // Blue
          metalness={0.0} // Set to 0 for a non-metallic look
          roughness={0.1} // Lower roughness for a smoother appearance
        />
      </mesh>

      {/* Right symbol (>) */}
      <mesh position={[1.2, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}> {/* Green bar with reduced gap */}
        <extrudeGeometry args={[createRoundedBar(), extrudeSettings]} />
        <meshStandardMaterial
          color="#0F9D58" // Green
          metalness={0.0} // Set to 0 for a non-metallic look
          roughness={0.1} // Lower roughness for a smoother appearance
        />
      </mesh>
      <mesh position={[1.2, -0.4, 0]} rotation={[0, 0, Math.PI / 4]}> {/* Yellow bar with reduced gap */}
        <extrudeGeometry args={[createRoundedBar(), extrudeSettings]} />
        <meshStandardMaterial
          color="#F4B400" // Yellow
          metalness={0.0} // Set to 0 for a non-metallic look
          roughness={0.3} // Increased roughness for better visibility
          transparent={false} // Ensure transparency is off
          polygonOffset={true} // Enable polygon offset
          polygonOffsetFactor={1} // Adjust factor as needed
        />
      </mesh>
    </group>
  );
}