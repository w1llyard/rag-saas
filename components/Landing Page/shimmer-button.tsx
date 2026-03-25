import React from "react";
import { Button } from "../ui/button";

const ShimmerButton = ({ children, className = "", ...props }: any) => (
  <Button className={`relative overflow-hidden group ${className}`} {...props}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    {children}
  </Button>
);

export default ShimmerButton;
