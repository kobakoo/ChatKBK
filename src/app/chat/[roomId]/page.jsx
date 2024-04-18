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
  deleteDoc,
  orderBy,
  limit,
  query,
  getCountFromServer,
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
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "animate.css";
import Marquee from "react-fast-marquee";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import CustomLink from "../../components/Customlink";
// import { db } from "@/lib/FirebaseConfig";

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
  const [disabled, setDisabled] = useState(true);
  const [browser, setBrowser] = useState("");
  const [exist, setExist] = useState(true);
  const [createdBy, setCreatedBy] = useState("");
  const [createdByUserName, setCreatedByUserName] = useState("");
  const [clientUserId, setClientUserId] = useState("");
  const [whyUnsendable, setWhyUnsendable] = useState("");
  // const onEmojiClick = (event, emojiObject) => {
  //   setChosenEmoji(emojiObject);
  // };

  const share = useRouter();
  const base = "https://chat.kobakoo.com";

  const params = useParams();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  // const pass = searchParams.get('pass');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // async function startUp() {
  //   const docRef = doc(db, "rooms", params.roomId);
  //   const docSnap = await getDoc(docRef);
  //   // console.log(docSnap.data());
  //   if (docSnap.get("enabled") === true) {
  //     setEnabled(docSnap.get("enabled"));
  //     setPassword(docSnap.get("password"));
  //     setPass(searchParams.get("pass"));
  //   } else {
  //     setEnabled(false);
  //   }
  // }

  // useEffect(() => {
  //   startUp();
  // });

  // setTimeout(() => {setPass(searchParams.get("pass"))}, 1000);

  // useEffect(() => {
  //   if (password === pass) {
  //     setEnabled(false);
  //   } else {
  //     setEnabled(true);
  //   }
  // }, [pass, password]);

  // useEffect(() => {
  //   console.log("created by:" + createdBy);
  // }, [createdBy]);

  // useEffect(() => {
  //   console.log("IP:" + IP.ip);
  // }, [IP.ip]);

  async function setUp() {
    const docRef = doc(db, "rooms", params.roomId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    setCreatedBy(docSnap.get("createdBy"));
    setCreatedByUserName(docSnap.get("createdByUserName"));
    if (docSnap.get("enabled") === true) {
      setEnabled(docSnap.get("enabled"));
      setPassword(docSnap.get("password"));
      setPass(searchParams.get("pass"));
      // console.log("IP:" + IP.ip);
      if (docSnap.get("password") == searchParams.get("pass")) {
        setEnabled(false);
      }
      // console.log(docSnap.get("enabled"));
      // console.log(docSnap.get("password"));
      // console.log(searchParams.get("pass"));
    } else {
      setEnabled(false);
    }
    // console.log("created by: " + docSnap.get("createdBy"));
  }

  useEffect(() => {
    if (localStorage.getItem("userName") == "kbk") {
      setDisabled(false);
    }
  }, []);

  useEffect(() => {
    setUp();
  });

  useEffect(() => {
    console.log("enabled:" + enabled);
  }, [enabled]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getData() {
    const docRef = doc(db, "rooms", params.roomId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setExist(true);
      const collectionRef = collection(db, "rooms", params.roomId, "chats");
      const q = query(collectionRef, orderBy("sentAt", "desc"), limit(200));
      const unsub = onSnapshot(q, (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setChats(results.reverse());
      });
    } else {
      setExist(false);
    }
  }

  useEffect(() => {
    console.log(clientUserId);
  }, [clientUserId]);

  useEffect(() => {
    getData();
    // console.log(exist);
    //? return () => unsub();
  }, [getData]);

  useEffect(() => {
    fetch("https://ipinfo.io?callback")
      .then((res) => res.json())
      .then((json) => {
        // console.log(json.ip);
        // console.log(json);
        setIP(json);
      });
    var userAgent = window.navigator.userAgent;
    setBrowser(userAgent);
  }, []);

  const handleClick = () => {
    router.push(`/chat/${params.roomId}?pass=${userPassword}`);
    setPass(userPassword);
  };

  async function temporallyRegister() {
    if (IP.ip) {
      console.log(IP.ip);
      const collectionRef = collection(db, "users");
      const snapshot = await getCountFromServer(collectionRef);
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var N = 3;
      const count =
        snapshot.data().count +
        1 +
        Array.from(crypto.getRandomValues(new Uint8Array(N)))
          .map((n) => S[n % S.length])
          .join("");
      const docRef = doc(db, "users", IP.ip);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        console.log("You already have a doc with this name!");
        const id = docSnap.get("id");
        if (id == undefined) {
          await setDoc(doc(db, "users", IP.ip), {
            id: String(count),
          });
          localStorage.setItem("id", String(count));
          setClientUserId(String(count));
        } else {
          setClientUserId(id);
        }
      } else {
        if (IP.ip == null) {
          console.error(
            "広告ブロッカーなどのトラッカー防止をオフにしてください"
          );
        } else {
          await setDoc(doc(db, "users", IP.ip), {
            id: String(count),
          });
          localStorage.setItem("id", String(count));
          setClientUserId(String(count));
          console.log(String(count));
        }
      }
    } else {
      if (IP.ip == null) {
        console.error(
          "広告ブロッカーなどのトラッカー防止をオフにしてください。オフにしてある場合、これは一時的なエラーである可能性があります。"
        );
      }
    }
  }

  useEffect(() => {
    temporallyRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IP]);

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
                  await addDoc(
                    collection(db, "rooms", params.roomId, "chats"),
                    {
                      chat: downloadURL,
                      author: author,
                      type: "image",
                      ipInfo: IP,
                      browser: browser,
                      sentAt: new Date(),
                      clientId: clientUserId,
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

  const [baseURL, setBaseURL] = useState("https://chat.kobakoo.com");
  useEffect(() => {
    var url = new URL(window.location.href);
    setBaseURL(url.protocol + "//" + url.hostname);
  }, []);

  return (
    <>
      <Toaster />
      {exist ? (
        <div className="fixed top-0 z-10">
          {enabled ? (
            <></>
          ) : (
            <Marquee
              pauseOnHover={false}
              speed={50}
              autoFill={true}
              // autoFill={true}
              className="bg-gray-50 dark:bg-gray-800 text-zinc-700" //クラスをつけることができます
            >
              <Link href={`/chat/${params.roomId}`} className=" mx-4">
                この部屋は <b>{createdByUserName}</b> によって作成されました
              </Link>
            </Marquee>
          )}
        </div>
      ) : (
        <></>
      )}
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 fixed top-0 w-full mt-1">
        <div className="flex flex-wrap items-center justify-between p-4 w-screen">
          <a href="/" className="flex items-center">
            <Image
              src="https://kobakoo.com/logo.svg"
              className="h-8 w-auto mr-3"
              alt="kbk logo"
              width={150}
              height={100}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ChatKBK
            </span>
          </a>
          {createdBy == IP.ip ? (
            <button
              onClick={async () => {
                if (window.confirm("本当に部屋を削除しますか?")) {
                  await deleteDoc(doc(db, "rooms", params.roomId));
                  router.push("/chat");
                }
              }}
              className="p-2 hover:bg-slate-200 rounded-md transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={24}
                viewBox="0 -960 960 960"
                width={24}
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </button>
          ) : (
            <></>
          )}
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
              className="w-6 h-6"
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
      {exist ? (
        <>
          {enabled ? (
            <>
              <title>
                ChatKBK｜パスワード｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！
              </title>
              <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                  <Link
                    href="/"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    <Image
                      className="w-8 h-5 mr-2"
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
                  <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      パスワードフォーム
                    </h2>
                    <div className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          パスワード
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(event) =>
                            setUserPassword(event.target.value)
                          }
                        />
                      </div>
                      {/* <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="newsletter" aria-describedby="newsletter" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="newsletter" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                          </div>
                      </div> */}
                      <button
                        type="button"
                        className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
              <div className="sm:my-20 md:mx-16 sm:mx-8 mx-2 max-w-screen my-24">
                {chats.map((chat) => (
                  <div key={chat.id} className="my-2" id={chat.id}>
                    <div className="">
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
                              className={
                                chat.author == "kbk" ? "text-red-400" : ""
                              }
                            >
                              {chat.author}
                              <span className="italic text-zinc-500">
                                ({chat.clientId})
                              </span>
                            </b>
                          </p>
                        </div>
                      ) : (
                        <p className="font-sans text-lg p-2 bg-sky-100 justify-between flex max-w-full">
                          <p className="truncate markdown" as="p" id="aChat">
                            <ReactMarkdown
                              className="markdown"
                              remarkPlugins={[
                                remarkMath,
                                remarkGfm,
                                remarkBreaks,
                              ]}
                              rehypePlugins={[rehypeKatex]}
                              components={{ a: CustomLink }}
                            >
                              {chat.chat}
                            </ReactMarkdown>
                          </p>
                          <div className="flex">
                            <p className="font-mono">
                              by{" "}
                              <b
                                className={
                                  chat.author == "kbk" ? "text-red-400" : ""
                                }
                              >
                                {chat.author}
                                <span className="italic text-zinc-500">
                                  ({chat.clientId})
                                </span>
                              </b>
                            </p>
                          </div>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form className="fixed bottom-0 max-w-screen w-screen">
                {/* <label htmlFor="chat" className="sr-only">
                      Your message
                    </label> */}
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 gap-x-1.5">
                  {/* <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Add emoji</span>
                        </button> */}
                  <div className="w-full md:flex">
                    <div className="flex grow">
                      <button
                        type="button"
                        className="pl-1 inline-flex justify-center p-4 text-blue-600 rounded-full cursor-pointer  dark:text-blue-500"
                        variant="contained"
                      >
                        <label htmlFor="file_upload" className="cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 512 512"
                            fill="currentColor"
                          >
                            <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                          </svg>
                          <span className="sr-only">Add image</span>
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
                        className="max-h-32 block p-2.5 w-full md:w-10/12 lg:w-full mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:mr-2"
                        placeholder="メッセージを打ち込む..."
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                      ></textarea>
                    </div>
                    <p className="m-auto md:block hidden text-xl">by</p>
                    {disabled ? (
                      <textarea
                        id="author"
                        rows="1"
                        className="max-h-32 block p-2.5 mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ニックネームを入れてください..."
                        onChange={(e) => {
                          if (e.target.value == "kbk") {
                            toast.error("その名前は使うことができません!");
                            setAuthor("");
                            localStorage.setItem("userName", "");
                          } else {
                            if (e.target.value.length > 20) {
                              toast.error("名前が長すぎます!");
                            } else {
                              setAuthor(e.target.value);
                              localStorage.setItem("userName", e.target.value);
                            }
                          }
                        }}
                        value={author}
                      ></textarea>
                    ) : (
                      <textarea
                        id="author"
                        rows="1"
                        className="max-h-32 block p-2.5 mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ニックネームを入れてください..."
                        disabled
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
                    )}
                  </div>
                  <button
                    type="button"
                    className="pl-1 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                    onClick={async () => {
                      if (message === "") {
                        alert("メッセージが入力されていません💦");
                      } else {
                        try {
                          addDoc(
                            collection(db, "rooms", params.roomId, "chats"),
                            {
                              chat: message,
                              author: author,
                              ipInfo: IP,
                              Browser: browser,
                              sentAt: new Date(),
                              clientId: clientUserId,
                              // id: chat_id
                            }
                          );
                          setMessage("");
                        } catch (err) {
                          console.error(err.message);
                          setWhyUnsendable(err.message);
                        }
                      }
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                    <span className="sr-only">Send message</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        <>
          <section className="bg-white dark:bg-gray-900 ">
            <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
              <div className="wf-ull lg:w-1/2">
                <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                  404 error
                </p>
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                  チャットが見つかりませんでした
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  おっと！？チャットが見つからないようです！ホームに戻って再挑戦してください...
                </p>
                <div className="flex items-center mt-6 gap-x-3">
                  <button
                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                    onClick={() => router.push("/chat")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 rtl:rotate-180"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                      />
                    </svg>
                    <span>戻る</span>
                  </button>
                  <button
                    className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                    onClick={() => router.push("/")}
                  >
                    ホームへ
                  </button>
                </div>
              </div>
              <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0 animate__backInDown animate__animated animate__bounce">
                <Image
                  className="w-full max-w-lg lg:mx-auto"
                  src="https://merakiui.com/images/components/illustration.svg"
                  alt="404"
                  width={514}
                  height={164}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default page;
