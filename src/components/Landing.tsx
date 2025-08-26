import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Advantages from './Advantages';
import Comparison from './Comparison';
import Conclusion from './Conclusion';
import ArchitectureFlow from './ArchitectureFlow';
import AuthorityManagement from './AuthorityManagement';
import KeyUseCase from './KeyUseCase';
import ProblemObjective from './ProblemObjective';

const Landing: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <Hero />
      <ProblemObjective />
      <Features />
      <KeyUseCase />
      <ArchitectureFlow />
      <AuthorityManagement />
      <Advantages />
      <Comparison />
      <Conclusion />
    </div>
  );
};

export default Landing;
