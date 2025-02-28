import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">{user ? <CreatePost /> : null}</div>
      <h1 className="text-center text-2xl font-bold">Welcome To Vybe</h1>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
