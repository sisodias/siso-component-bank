import React from 'react';

interface TestProps {
  label?: string;
}

export const TestComp: React.FC<TestProps> = ({ label = 'Hello' }) => (
  <div>{label}</div>
);

export default TestComp;
