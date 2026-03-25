import React from 'react'

const DotPattern = ({ className = "" }: { className?: string }) => (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:20px_20px]" />
    </div>
  );

export default DotPattern
