"use client";

import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { userAtom } from "@/recoil/atoms/userAtom";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken } = useRecoilValue(userAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error("Please login to access admin dashboard !!!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex-center h-screen w-full">
          <p>Loading</p>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default AuthProvider;
