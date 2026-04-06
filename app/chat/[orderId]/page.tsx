"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import { FiSend, FiPlus } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";

import Navbar from "@/components/layout/Navbar";

type Message = {
  id: string;
  order_id: string;
  user_id: string;
  message: string | null;
  image_data: string | null;
  sender_role: string;
  created_at: string;
  is_from_admin: boolean
};

type RealtimePayload = {
  new: Message;
};

export default function ChatScreen() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  /* 🔐 AUTH */
  useEffect(() => {
    supabase.auth.getUser().then(
      ({ data }: { data: { user: User | null } }) => {
        setUser(data.user);
      }
    );
  }, []);

  /* 📜 SCROLL */
  const scrollBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    scrollBottom();
  }, [messages]);

  /* 📥 FETCH MESSAGES */
  const getCleanOrderId = useCallback(() => {
    const decoded = decodeURIComponent(orderId);
    return decoded.split("=")[1];
  }, [orderId]);

  const loadMessages = useCallback(async () => {
    const cleanOrderId = getCleanOrderId();
    const { data } = await supabase
      .from("chat_with_admin")
      .select("*")
      .eq("order_id", cleanOrderId)
      .order("created_at", { ascending: true });

    setMessages((data as Message[]) || []);
  }, [getCleanOrderId]);

  useEffect(() => {
    // Move initial fetch to a separate async function outside the effect
    // This avoids calling setState directly inside the effect body
    (async () => {
      await loadMessages();
    })();
  }, [loadMessages]);

  useEffect(() => {
    const cleanOrderId = getCleanOrderId();

    const channel = supabase
      .channel("chat-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_with_admin",
          filter: `order_id=eq.${cleanOrderId}`,
        },
        (payload: RealtimePayload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getCleanOrderId]);

  /* 📤 FILE → BASE64 */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /* 📤 SEND MESSAGE */
  const sendMessage = async () => {
    if (!text && !image) return;
    if (!user) return;

    let base64Image: string | null = null;

    if (image) {
      base64Image = await fileToBase64(image);
    }

    const cleanOrderId = getCleanOrderId();

    await supabase.from("chat_with_admin").insert({
      order_id: cleanOrderId,
      user_id: user.id,
      message: text || null,
      image_data: base64Image,
      is_from_admin: false,
    });

    setText("");
    setImage(null);

    await loadMessages();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "transparent" }}>
        <Navbar />
      </div>
      <div className="flex flex-col max-w-7xl shadow-lg mx-auto h-[calc(100vh-2rem)] my-5">
        {/* HEADER */}
        <div className="flex items-center px-4 py-3 border-b gap-3">
          <button onClick={() => router.back()}>
            <IoArrowBack className="text-xl" />
          </button>
          <p className="text-[#E72343] font-bold text-lg">User Support</p>

        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="min-h-full flex flex-col justify-end space-y-4">
            {messages.map((msg) => {
              const isUser = msg.is_from_admin === true;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-start" : "justify-end"
                    }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-xl text-sm ${isUser
                        ? "bg-primary text-white rounded-bl-none"
                        : "bg-primary text-white rounded-br-none"
                      }`}
                  >
                    {msg.message && <p>{msg.message}</p>}

                    {msg.image_data && (
                      <Image
                      draggable={false}
                  
                        src={msg.image_data}
                        alt="chat"
                        width={150}
                        height={150}
                        unoptimized
                        className="mt-2 rounded max-w-[150px]"
                      />
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="p-3 border-t">
          {image && (
            <div className="relative px-3 pb-2 w-fit">
              <Image

                      draggable={false}

                src={URL.createObjectURL(image)}
                alt="preview"
                width={96}
                height={96}
                unoptimized
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <FiPlus />
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setImage(e.target.files?.[0] || null)
                }
              />
            </label>

            <input
              value={text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setText(e.target.value)
              }
              placeholder="Write your message"
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              className="bg-red-500 p-3 rounded-full text-white"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}