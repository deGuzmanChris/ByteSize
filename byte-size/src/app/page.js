// Redirects to /login on landing
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

}
