import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-center items-center p-24">
      <Link className="border p-2 mx-4" href="/login">
        Log In
      </Link>
      <Link className="border p-2" href="/signup">
        Sign Up
      </Link>
    </main>
  );
}
