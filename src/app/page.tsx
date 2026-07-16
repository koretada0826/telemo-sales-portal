import { redirect } from "next/navigation";

/** ルートURL "/" → ダッシュボードへ強制遷移 */
export default function Home() {
  redirect("/dashboard");
}
