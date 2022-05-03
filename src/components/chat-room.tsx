import { FC } from "react";

interface ChatRoomProps {}

const ChatRoom: FC<ChatRoomProps> = () => {
  return (
    <div className="w-3/4 h-[500px] bg-red-400 shadow-md relative">
      <div>
        <p>message</p>
      </div>
      <div className="absolute bottom-0 p-2 flex w-full bg-gray-400">
        <div className="w-10/12">
          <div className="w-full h-full bg-green-500" contentEditable="true" ></div>
        </div>
        <div className="flex items-end justify-center w-2/12">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
