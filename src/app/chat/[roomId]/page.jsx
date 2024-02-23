/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/FirebaseConfig";
import { useRouter } from "next/navigation";
// import Picker from "emoji-picker-react";
// import { Popover, Transition } from "@headlessui/react";
// import Fragment from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import storage from "@/lib/FirebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";

function page() {
  const [chats, setChats] = useState([]);
  // const [chat,setChat]= useState([]);
  const [password, setPassword] = useState("");
  const [pass, setPass] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [enabled, setEnabled] = useState(null);
  const [author, setAuthor] = useState(
    typeof window !== "undefined" ? localStorage.getItem("userName") : ""
  );
  const [IP, setIP] = useState({});

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [loading, setLoading] = useState(null);
  const [isUploded, setIsUploaded] = useState(false);
  // const onEmojiClick = (event, emojiObject) => {
  //   setChosenEmoji(emojiObject);
  // };

  const share = useRouter();
  const base = "https://chat.kobakoo.com";

  const params = useParams();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const getPass = searchParams.get("pass");
  // const pass = searchParams.get('pass');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function startUp() {
    const docRef = doc(db, "rooms", params.roomId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    if (docSnap.get("enabled") === true) {
      setEnabled(docSnap.get("enabled"));
    } else {
      setEnabled(false);
    }
    if (docSnap.get("enabled") === true) {
      setPassword(docSnap.get("password"));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startUp();
  }, [startUp]);

  useEffect(() => {
    setPass(getPass);
  }, [getPass]);

  useEffect(() => {
    if (password === pass) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [pass, password]);

  useEffect(() => {
    const docRef = collection(db, "rooms", params.roomId, "chats");
    const unsub = onSnapshot(docRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setChats(results);
    });
    // return () => unsub();
  }, [params.roomId]);

  useEffect(() => {
    fetch("https://ipinfo.io?callback")
      .then((res) => res.json())
      .then((json) => {
        // console.log(json.ip);
        // console.log(json);
        setIP(json);
      });
  }, []);

  const handleClick = () => {
    router.push(`/chat/${params.roomId}?pass=${userPassword}`);
  };

  // history.pushState(null, null, location.href);
  // window.addEventListener("popstate", (e) => {
  //   alert("ブラウザバックを使わないでください。");
  //   history.go(1);
  // });

  const onFileUploadToFirebase = (e) => {
    // console.log(e.target.files[0].name);
    var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N = 16;
    const random = Array.from(Array(N))
      .map(() => S[Math.floor(Math.random() * S.length)])
      .join("");
    // console.log(`${random}${e.target.files[0].name}`);
    const sizeLimit = 1024 * 1024 * 1;
    console.log(e.target.files[0]);
    if (e.target.files[0].size > sizeLimit) {
      toast.error("ファイルサイズが大きすぎます！ 1MB以下にしてください");
    } else {
      if (e.target.files[0].type.includes("image") === false) {
        toast.error("画像を貼ってください!!");
      } else {
        const storageRef = ref(
          storage,
          `image/${random}${e.target.files[0].name}`
        );
        var res = confirm(
          `「${e.target.files[0].name}」を送信してもいいですか?`
        );
        if (res == true) {
          // uploadBytes(storageRef, e.target.files[0].name).then((snapshot) => {
          //   console.log("Uploaded a blob or file!");
          // });
          const uploadImage = uploadBytesResumable(
            storageRef,
            e.target.files[0]
          );
          uploadImage.on(
            "state_changed",
            (snapshot) => {
              // setLoading();
            },
            (err) => {
              setLoading(false);
              toast.error(`エラー「${err}」が発生しました`);
            },
            () => {
              setLoading(true);
              toast.success("アップロードが完了しました!");
              getDownloadURL(uploadImage.snapshot.ref).then(
                async (downloadURL) => {
                  console.log("File available at", downloadURL);
                  const chat_id = String(chats.length + 1000000000);
                  await setDoc(
                    doc(db, "rooms", params.roomId, "chats", chat_id),
                    {
                      chat: downloadURL,
                      author: author,
                      type: "image",
                      ipInfo: IP,
                      // id: chat_id
                    }
                  );
                  toast.success("投稿が完了しました!");
                },
                (err) => {
                  toast.error(`エラー「${err.toString()}」が発生しました`);
                }
              );
            }
          );
        } else {
          toast.error("画像を送信できませんでした");
        }
      }
    }
  };
  return (
    <>
      <Toaster />
      <nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 fixed top-0 w-full">
        <div class="flex flex-wrap items-center justify-between p-4 w-screen">
          <a href="/" class="flex items-center">
            <Image
              src="https://kobakoo.com/logo.svg"
              class="h-8 w-auto mr-3"
              alt="kbk logo"
              width={150}
              height={100}
            />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ChatKBK
            </span>
          </a>
          <a
            href="/chat"
            className="p-2 hover:bg-slate-200 rounded-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </a>
        </div>
      </nav>
      {enabled ? (
        <>
          <title>
            ChatKBK｜パスワード｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！
          </title>
          <section class="bg-gray-50 dark:bg-gray-900">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <Link
                href="/"
                class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
              >
                <Image
                  class="w-8 h-5 mr-2"
                  src="https://kobakoo.com/logo.svg"
                  alt="logo"
                  width={150}
                  height={100}
                />
                ChatKBK
              </Link>
              <p className="max-w-full w-96 mx-auto text-center mb-3">
                パスワードを入力してください。パスワードを入力しても表示されている場合はパスワードが間違っている可能性があります。
              </p>
              <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  パスワードフォーム
                </h2>
                <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      パスワード
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(event) => setUserPassword(event.target.value)}
                    />
                  </div>
                  {/* <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="newsletter" aria-describedby="newsletter" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="newsletter" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                  </div>
              </div> */}
                  <button
                    type="button"
                    class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={handleClick}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div>
          <title>
            ChatKBK｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！
          </title>
          <link
            rel="canonical"
            href={`https://chat.kobakoo.com/chat/${params.roomId}`}
          />
          <h1>{chats.name}</h1>
          <div className=" my-20 md:mx-16 sm:mx-8 mx-2 max-w-screen">
            {chats.map((chat) => (
              <div key={chat.id} className="my-2">
                <Link
                  href={`/chat/${params.roomId}#${chat.id - 999999999}`}
                  className=""
                >
                  {chat.type ? (
                    <div className="w-full p-3 bg-sky-100 sm:flex">
                      <img
                        src={chat.chat}
                        alt={chat.chat}
                        className=" w-96 h-auto"
                      />
                      <p className="ml-1 items-end bottom-1 md:text-lg sm:text-sm text-xs">
                        by{" "}
                        <b
                          className={chat.author == "kbk" ? "text-red-400" : ""}
                        >
                          {chat.author}
                        </b>
                      </p>
                    </div>
                  ) : (
                    <p className="font-sans text-lg p-2 bg-sky-100 justify-between flex max-w-full">
                      <p className="whitespace-pre-wrap">{chat.chat}</p>
                      <div className="flex">
                        <p className="font-mono">
                          by{" "}
                          <b
                            className={
                              chat.author == "kbk" ? "text-red-400" : ""
                            }
                          >
                            {chat.author}
                          </b>
                        </p>
                      </div>
                    </p>
                  )}
                </Link>
              </div>
            ))}
          </div>

          <form className="fixed bottom-0 max-w-screen w-screen">
            {/* <label for="chat" class="sr-only">
              Your message
            </label> */}
            <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 gap-x-1.5">
              {/* <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Add emoji</span>
                </button> */}
              <div className="w-full md:flex">
                <div className="flex grow">
                  <button
                    type="button"
                    class="pl-1 inline-flex justify-center p-4 text-blue-600 rounded-full cursor-pointer  dark:text-blue-500"
                    variant="contained"
                  >
                    <label for="file_upload" className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                      </svg>
                      <span class="sr-only">Add image</span>
                      <input
                        type="file"
                        id="file_upload"
                        accept="image/*"
                        className=" hidden"
                        onChange={onFileUploadToFirebase}
                      />
                    </label>
                  </button>
                  <textarea
                    id="chat"
                    rows="1"
                    class="max-h-32 block p-2.5 w-full md:w-10/12 lg:w-full mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:mr-2"
                    placeholder="メッセージを打ち込む..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                  ></textarea>
                </div>
                <p className="m-auto md:block hidden text-xl">by</p>
                <textarea
                  id="author"
                  rows="1"
                  class="max-h-32 block p-2.5 mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ニックネームを入れてください..."
                  onChange={(e) => {
                    if (e.target.value == "kbk") {
                      toast.error("その名前は使うことができません!");
                      setAuthor("");
                      localStorage.setItem("userName", "");
                    } else {
                      setAuthor(e.target.value);
                      localStorage.setItem("userName", e.target.value);
                    }
                  }}
                  value={author}
                ></textarea>
              </div>
              <button
                type="button"
                class="pl-1 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                onClick={async () => {
                  if (message === "") {
                    alert("メッセージが入力されていません💦");
                  } else {
                    const chat_id = String(chats.length + 1000000000);
                    setDoc(doc(db, "rooms", params.roomId, "chats", chat_id), {
                      chat: message,
                      author: author,
                      ipInfo: IP,
                      // id: chat_id
                    });
                    setMessage("");
                  }
                }}
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 rotate-90"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
                <span class="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default page;
