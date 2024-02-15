"use client";
import React, { ReactNode } from "react";

import AuthProvider from "@/providers/AuthProvider";

interface LayoutProps {
  children?: ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <div className="flex flex-col">
          <div className="h-full">{children}</div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default layout;
