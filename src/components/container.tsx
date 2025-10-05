import React from "react";
import { cn } from "@/lib/utils";

//this children and container is used so that, we do not need to 
// define the auto-widths again and again,

export const Container = ({children, className}:{
    children:React.ReactNode,
    className?:string
}) => {
  return (
    <div className={cn("max-w-6xl mx-auto px-4 md:py-4 relative z-10",className)}>
      {children}
    </div>
  );
};