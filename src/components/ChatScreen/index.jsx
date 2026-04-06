"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { IoArrowBack } from "react-icons/io5";
import { FiSend, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChatScreen({ orderId }) {
    const router = useRouter();
    const bottomRef = useRef(null);
    const [user, setUser] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [orderDetails, setOrderDetails] = useState()

    const scrollBottom = useCallback(() => {
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    }, []);

    const fetchMessages = useCallback(async () => {
        const { data } = await supabase
            .from("chat_with_admin")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: true });

        setMessages(data || []);
        // scrollBottom();
    }, [orderId]);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data } = await supabase
                .from("vendor_order")
                .select("*")
                .eq("id", orderId).limit(1)
                .single(); // 👈 convert array → object
            setOrderDetails(data)
        }
        fetchOrder();
    }, [orderId]);

    const fileInputRef = useRef(null);
    /* 🔐 AUTH */
    useEffect(() => {
        const resolveAvatarUrl = async (avatarPath, fallbackUrl) => {
            if (avatarPath) {
                const { data } = await supabase.storage
                    .from("user_images")
                    .createSignedUrl(avatarPath, 60 * 60 * 24);

                if (data?.signedUrl) return data.signedUrl;

                const { data: publicData } = supabase.storage
                    .from("user_images")
                    .getPublicUrl(avatarPath);

                if (publicData?.publicUrl) return publicData.publicUrl;
            }

            return fallbackUrl || null;
        };

        supabase.auth.getUser().then(async ({ data }) => {
            const currentUser = data?.user || null;
            setUser(currentUser);

            if (currentUser) {
                const resolvedAvatar = await resolveAvatarUrl(
                    currentUser.user_metadata?.avatar_path,
                    currentUser.user_metadata?.avatar_url
                );

                setUserAvatar(resolvedAvatar);
            }
        });
    }, []);

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    /* 📥 FETCH MESSAGES */
    useEffect(() => {
        const init = async () => {
            await fetchMessages();
        };
        init();

        const channel = supabase
            .channel("chat-realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "chat_with_admin" },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                    scrollBottom();
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [fetchMessages, scrollBottom]);

    useEffect(() => {
        scrollBottom();
    }, [messages, scrollBottom]);

   

    /* 📤 SEND MESSAGE */
    const sendMessage = async () => {
       
        if (!text && !image) return;

        let base64Image = null;

        if (image) {
            base64Image = await fileToBase64(image); // ✅ convert to base64
        }
        

        await supabase.from("chat_with_admin").insert({
            order_id: orderId,
            user_id: user.id,
            message: text || null,
            is_from_admin: true,
            vendor_id:orderDetails?.vendor_id ? orderDetails?.vendor_id : null,
            image_data: base64Image, // ✅ BASE64 STRING
        });

        setText("");
        setImage(null);
    };
    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset input
        }
    };

    const USER_AVATAR = userAvatar || user?.user_metadata?.avatar_url || "/images/Zirwa.png"; // user image
    const ADMIN_LOGO = "/images/Zirwa.png"; // admin/support logo

    return (
        <div className="flex w-full flex-col h-[70vh] bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()}>
                        <IoArrowBack className="text-xl" />
                    </button>
                    <h2 className="text-lg font-semibold text-red-500">User Support</h2>
                </div>
                {/* <button className="border px-4 py-1 rounded-full text-red-500">
          Chat with us
        </button> */}
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto scroll-hidden p-4">
                <div className="min-h-full flex flex-col justify-end space-y-4">
                    {messages.map((msg) => {
                        const isUser = msg.sender_role === "user";
                        return (
                            <>
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${isUser ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    {/* USER IMAGE (LEFT) */}
                                    {isUser && (
                                        <Image
                      draggable={false}

                                            src={ADMIN_LOGO}
                                            alt="user"
                                            width={32}
                                            height={32}
                                            className="rounded-full w-[20px] h-[20px] object-cover"
                                        />
                                    )}

                                    {/* MESSAGE BUBBLE */}
                                    <div
                                        className={`max-w-xs p-3 rounded-xl text-sm ${isUser
                                            ? "bg-primary text-white rounded-bl-none"
                                            : "bg-primary text-white rounded-br-none"
                                            }`}
                                    >
                                        {msg.message && <p>{msg.message}</p>}

                                        {msg.image_data && (
                                            msg.image_data.startsWith("data:image") ? (
                                                <Image
                                                    draggable={false}
                                                    src={msg.image_data}
                                                    alt="chat"
                                                    width={150}
                                                    height={150}
                                                    unoptimized
                                                    className="mt-2 rounded max-w-[150px] h-auto"
                                                />
                                            ) : (
                                                <a
                                                    href={msg.image_data}
                                                    download="document"
                                                    className="mt-2 flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg text-xs underline"
                                                >
                                                    📄 View Document
                                                </a>
                                            )
                                        )}
                                    </div>
                                    {/* ADMIN LOGO (RIGHT) */}
                                    {!isUser && (
                                        <Image
                      draggable={false}

                                            src={USER_AVATAR}
                                            alt="admin"
                                            width={32}
                                            height={32}
                                            className="rounded-full w-[20px] h-[20px] object-cover"
                                        />
                                    )}
                                    <div className="m-0" ref={bottomRef} />
                                </div>
                            </>
                        );
                    })}


                </div>
            </div>

            {/* INPUT */}

            <div className="p-3 border-t gap-3">
                <div>
                    {image && (
                        <div className="relative px-3 pb-2 w-fit">
                            {image.type.startsWith("image/") ? (
                                <Image
                                    draggable={false}
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    width={96}
                                    height={96}
                                    unoptimized
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                            ) : (
                                <div className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border bg-gray-50 text-xs text-gray-600 gap-1 px-1 text-center">
                                    <span className="text-2xl">📄</span>
                                    <span className="truncate w-full text-center">{image.name}</span>
                                </div>
                            )}

                            {/* ❌ Remove button */}
                            <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                </div>
                <div className="flex  items-center gap-3">
                    <div className="bg-primary p-2 rounded-full text-white hover:bg-red-600">
                        <label className="cursor-pointer">
                            <FiPlus />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*,application/pdf,.doc,.docx"
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your message"
                        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
                        onKeyDown={(e) => {
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
    );
}
