// src/components/common/Icon.tsx
import React from 'react';
import * as icons from '@/icons';

// Helper to convert kebab-case to PascalCase and add "Icon" suffix
const toPascalCase = (str: string) => {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
};

type IconName = keyof typeof icons;

// Define the props for the Icon component
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string; // Allow any string for the name
}

// The Icon component
const Icon = ({ name, ...props }: IconProps) => {
  // Construct the component name in PascalCase and add "Icon" suffix
  const componentName = `${toPascalCase(name)}Icon` as IconName;
  
  // Find the corresponding icon component from the imported icons
  const IconComponent = icons[componentName];

  // If the icon component doesn't exist, return null and log a warning
  if (!IconComponent) {
    console.warn(`Icon "${name}" with component name "${componentName}" not found.`);
    return null;
  }

  // Render the found icon component with the given props
  return <IconComponent {...props} />;
};

export default Icon;
