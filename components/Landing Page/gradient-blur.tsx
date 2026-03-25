const GradientBlur = ({
    className = "",
    color = "purple",
  }: {
    className?: string;
    color?: string;
  }) => {
    const colorMap = {
      purple: "from-purple-600/30 to-pink-600/30",
      blue: "from-blue-600/30 to-cyan-600/30",
      green: "from-green-600/30 to-emerald-600/30",
      orange: "from-orange-600/30 to-red-600/30",
    };
  
    return (
      <div
        className={`absolute rounded-full bg-gradient-to-br ${
          colorMap[color as keyof typeof colorMap]
        } blur-3xl opacity-70 ${className}`}
      />
    );
  };

  export default GradientBlur;
