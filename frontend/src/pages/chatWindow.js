export default function ChatWindow(props) {
  const { activeChat, setActiveChat } = props;
  return (
    <div className="flex w-full h-full">
      <div className="w-1/4 min-w-[250px] border-r border-gray-200 shadow-sm">
        <Sidebar setActiveChat={setActiveChat} />
      </div>
      <main className="flex-1 flex flex-col">
        <ChatWindow activeChat={activeChat} />
      </main>
    </div>
  );
}
