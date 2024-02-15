"use client";

import React from "react";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/atoms/userAtom";

const HomePage = () => {
  const user = useRecoilValue(userAtom);

  return (
    <div className="flex flex-col w-full">
      <header className="flex w-full bg-blue-500 p-4 text-white justify-between">
        <h1 className="text-2xl font-semibold">We Meet</h1>
        <nav>
          {user ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
      </header>

      <main className="p-8">
        <section className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Welcome to We Meet</h2>
          <p className="text-lg">
            Join or start a meeting to connect with others.
          </p>
        </section>

        <section className="flex flex-col items-center">
          <Link href="/meeting">
            <button className="bg-green-500 text-white px-6 py-3 rounded-md mb-4">
              Start a New Meeting
            </button>
          </Link>

          <div className="flex">
            <input
              type="text"
              placeholder="Enter Meeting URL"
              className="border p-2 rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-500 text-white rounded-r-md px-4 focus:outline-none">
              Join Meeting
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
