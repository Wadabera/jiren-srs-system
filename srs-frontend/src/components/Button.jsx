import React from 'react';

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  let sizeClass = '';
  if (size === 'sm') sizeClass = 'btn-sm';
  if (size === 'lg') sizeClass = 'btn-lg';

  const combinedClasses = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
