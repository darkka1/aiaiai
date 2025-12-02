import dynamic from "next/dynamic";

const ChatUI = dynamic(() => import("../components/ChatUI"), { ssr: false });

export default function Home() {
  return <ChatUI />;
}