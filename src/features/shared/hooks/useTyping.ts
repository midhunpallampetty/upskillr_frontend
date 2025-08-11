// hooks/useTyping.ts
import { useRef } from 'react';
import socket from '../socket';   // the shared instance

export function useTyping(threadId:string, user:{_id:string; fullName:string}) {
  const timer = useRef<NodeJS.Timeout>();

  function handleKeystroke() {
    socket.emit('typing', { threadId, userId:user._id, userName:user.fullName });

    clearTimeout(timer.current as NodeJS.Timeout);
    timer.current = setTimeout(() => {
      socket.emit('stop_typing', { threadId, userId:user._id, userName:user.fullName });
    }, 2_000);                              // 2 s inactivity
  }

  function stopNow() {
    clearTimeout(timer.current as NodeJS.Timeout);
    socket.emit('stop_typing', { threadId, userId:user._id, userName:user.fullName });
  }

  return { handleKeystroke, stopNow };
}
