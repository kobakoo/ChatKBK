/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/FirebaseConfig";
import { Switch } from "@headlessui/react";
import { Tooltip } from "react-tooltip";
import Image from "next/image";
import QRCode from "../../components/qrcode";

function page() {
  let [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [IP, setIP] = useState({});
  const [showPublish, setShowPublish] = useState(false);
  const [showDeletable, setShowDeletable] = useState(false);
  let [isOpenDesc, setIsOpenDesc] = useState(false);
  const [createdId, setCreatedId] = useState("");
  const [userName, setUserName] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
    setName("");
  }

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
  }, []);

  useEffect(() => {
    if (showPublish == false) {
      setShowDeletable(false);
    }
  }, [showPublish]);

  useEffect(() => {
    const docRef = collection(db, "rooms");
    const unsub = onSnapshot(docRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setDocuments(results);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    fetch("https://ipinfo.io?callback")
      .then((res) => res.json())
      .then((json) => {
        setIP(json);
      });
  }, []);

  async function temporallyRegister() {
    if (IP.ip) {
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
      const docSnap = getDoc(docRef);
      if (docSnap.exists) {
        console.log("You already have a doc with this name!");
      } else {
        if (IP.ip == null) {
          console.error(
            "広告ブロッカーなどのトラッカー防止をオフにしてください"
          );
        } else {
          await setDoc(doc(db, "users", IP.ip), {
            id: String(count),
          });
        }
      }
    }
  }

  useEffect(() => {
    temporallyRegister();
  }, [IP]);

  // setTimeout(function () {
  //   location.reload();
  // }, 30 * 1000);

  const [baseURL, setBaseURL] = useState("https://chat.kobakoo.com");
  useEffect(() => {
    var url = new URL(window.location.href);
    setBaseURL(url.protocol + "//" + url.hostname);
  }, []);

  async function copyToClipboard() {
    await global.navigator.clipboard.writeText(baseURL + "/chat/" + createdId);
    alert("コピーされました！");
  }

  return (
    //チャット一覧を表示
    <div className="md:m-20 sm:m-10 m-2">
      <title>
        ChatKBK｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！
      </title>
      <link rel="canonical" href="https://chat.kobakoo.com/chat" />
      <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <a href="/" className="flex items-center">
            <Image
              src="https://kobakoo.com/logo.svg"
              className="h-8 w-auto mr-3"
              alt="kbk Logo"
              width={10}
              height={7}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ChatKBK
            </span>
          </a>
        </div>
      </nav>

      <div
        className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 mt-4"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-bold">部屋の作成が行えるようになりました!</span>{" "}
          少し変更して、もう一度投稿してみてください。
        </div>
      </div>
      {/* <div
        className="flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 mt-5"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">注意！</span>{" "}
          現在一時的に部屋の作成機能を消しています。しばしお待ちください
        </div>
      </div> */}
      {/* <div
        className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">警告</span>
        <div>
          <span className="font-medium">警告！</span> 一度再読み込みしてください！
        </div>
      </div> */}

      <button
        onClick={openModal}
        type="button"
        className=" mt-4 flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="ml-1">部屋を作る</p>
      </button>

      {documents.map((room) => (
        <div key={room}>
          {room.published ? (
            <></>
          ) : (
            <div className="my-2">
              <div className="p-2 bg-slate-800/80 dark:bg-slate-100/70 rounded-lg shadow-lg focus:shadow-xl w-full">
                <div className="flex justify-between">
                  <Link className="w-full" href={`/chat/${room.id}`}>
                    <h2 className="text-xl font-bold dark:text-black text-white">
                      {room.name}
                    </h2>
                  </Link>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
        </svg> */}
                  {room.enabled ? (
                    <>
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="mt-1 w-6 h-6 text-white key"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <Tooltip anchorSelect=".key" place="top">
                          この部屋にはパスワードが付いています
                        </Tooltip>
                      </>
                    </>
                  ) : (
                    <></>
                  )}
                  {room.deletable ? (
                    <></>
                  ) : (
                    <button
                      className=""
                      onClick={async () => {
                        await deleteDoc(doc(db, "rooms", room.id));
                        alert(`部屋名「${room.name}」を削除しましたよ⭐️`);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-white dark:text-black"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    部屋を作成する
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      部屋の名前を入力してください。
                    </p>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="ここに名前を入力してください"
                      id="default-input"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    ></input>
                  </div>

                  <div className="mt-3 flex">
                    <Switch
                      checked={showPublish}
                      onChange={setShowPublish}
                      className={`${showPublish ? "bg-sky-700" : "bg-sky-900"}
                        relative inline-flex w-[48px] h-[24px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          showPublish ? "translate-x-6" : "translate-x-0"
                        }
                          pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      className="w-6 h-6"
                    >
                      <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
                    </svg>
                    <p className="mb:text-lg text-md font-bold text-pretty">
                      部屋を全体に公開
                      {showPublish
                        ? "しない(友達で楽しく)"
                        : "する(みんなでワイワイ)"}
                    </p>
                  </div>
                  <div>
                    {showPublish ? (
                      <div className="mt-3 flex">
                        <Switch
                          checked={showDeletable}
                          onChange={setShowDeletable}
                          className={`${
                            showDeletable ? "bg-sky-700" : "bg-sky-900"
                          }
                                            relative inline-flex w-[48px] h-[24px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              showDeletable ? "translate-x-6" : "translate-x-0"
                            }
                                              pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={24}
                          viewBox="0 -960 960 960"
                          width={24}
                          className="w-6 h-6"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>

                        <p className="mb:text-lg text-md font-bold text-pretty">
                          部屋を誰でも消せるように
                          {showDeletable ? "しない(自分だけ)" : "する"}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="mt-3 flex">
                    <Switch
                      checked={enabled}
                      onChange={setEnabled}
                      className={`${enabled ? "bg-sky-700" : "bg-sky-900"}
                        relative inline-flex w-[48px] h-[24px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span
                        aria-hidden="true"
                        className={`${
                          enabled ? "translate-x-6" : "translate-x-0"
                        }
                          pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                      />
                    </svg>
                    <p className="mb:text-lg text-md font-bold">
                      部屋にパスワードをつける
                    </p>
                  </div>
                  <div>
                    {enabled ? (
                      <>
                        <div className="mt-2">
                          <input
                            type="password"
                            placeholder="ここにパスワードを入力してください"
                            id="default-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          ></input>
                        </div>
                        <div className="mt-2">
                          <input
                            type="password"
                            placeholder="もう一度パスワードを入力してください"
                            id="default-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => {
                              setPasswordCheck(e.target.value);
                            }}
                          ></input>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        if (
                          name === "" ||
                          (password === "" && enabled === true)
                        ) {
                          alert("入力されていない欄がありますヨ");
                        } else {
                          if (password === passwordCheck) {
                            const docRef = await addDoc(
                              collection(db, "rooms"),
                              {
                                name: name,
                                password: password,
                                enabled: enabled,
                                published: showPublish,
                                createdBy: IP.ip,
                                createdByUserName: userName,
                              }
                            );
                            closeModal();
                            await setCreatedId(docRef.id);
                            setIsOpenDesc(true);
                            if (enabled === true) {
                              alert(
                                `パスワード付きの部屋、${name}が作成されました!`
                              );
                            } else {
                              alert(`${name}が作成されました!`);
                            }
                          } else {
                            alert("入力されたパスワードが一致していません");
                          }
                        }
                      }}
                    >
                      作成する
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isOpenDesc} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpenDesc(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    URL
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      部屋のリンクをシェアしましょう！
                    </p>
                    <div className="p-3 w-full bg-slate-100 border-slate-600/80 border-2 rounded-md flex justify-between mt-2">
                      <a
                        href={baseURL + "/chat/" + createdId}
                        target="_blank"
                        className="overflow-clip truncate"
                      >
                        {baseURL + "/chat/" + createdId}
                      </a>
                      <button
                        className="w-3 h-3 mr-2"
                        onClick={() => {
                          copyToClipboard();
                        }}
                      >
                        <a
                          className=""
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Copy"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                            className="p-0.5 hover:bg-gray-300 rounded-md"
                          >
                            <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                          </svg>
                        </a>
                      </button>
                    </div>
                    <div className=" mx-auto mt-3">
                      <QRCode url={baseURL + "/chat/" + createdId} />
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={()=>setIsOpenDesc(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800 fixed bottom-1 w-10/12">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{" "}
            <Link
              href="https://kobakoo.com/"
              className="hover:underline"
              target="_blank"
            >
              KBK Corp
            </Link>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <Link
                href="https://kobakoo.com"
                className="mr-4 hover:underline md:mr-6 "
              >
                About
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="/policy"
                className="mr-4 hover:underline md:mr-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="https://kobakoo.com/contact"
                className="hover:underline"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default page;
