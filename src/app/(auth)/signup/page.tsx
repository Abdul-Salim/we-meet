"use client";

import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../../../firebase";
import { userAtom } from "@/recoil/atoms/userAtom";
import Link from "next/link";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [, setUser] = useRecoilState(userAtom);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const accessToken = await userCredential.user.getIdToken();
        const user = userCredential.user;
        setUser({
          email: user?.email ?? "",
          name: user?.displayName ?? "",
          id: user?.uid ?? "",
          accessToken: accessToken ?? "",
        });
        toast.success("Sign up successful");
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error?.message ?? "Failed to sign up";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white p-8 rounded shadow-md max-w-md w-full text-gray-800"
        onSubmit={(e) => handleSignUp(e)}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-500">
          Sign Up
        </h2>

        <input
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          type="submit"
        >
          Sign Up
        </button>
        <p className="text-sm mt-4 text-right">
          Already a user ?{" "}
          <Link className="text-blue-500 hover:underline" href="/login">
            Log in
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default SignUp;
