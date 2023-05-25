/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React,{useState,useEffect} from 'react'
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc ,doc,setDoc,onSnapshot, getDoc } from "firebase/firestore";
import {db} from "@/lib/FirebaseConfig";
import { useRouter } from 'next/navigation';
import Picker from 'emoji-picker-react';
import { Popover, Transition } from '@headlessui/react'
import Fragment from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';


function page() {
  const [chats,setChats] = useState([]);
  // const [chat,setChat]= useState([]);
  const [password,setPassword] = useState("");
  const [pass,setPass] = useState("");
  const [userPassword,setUserPassword] = useState("");
  const [enabled,setEnabled] =useState(true);
  const [author,setAuthor] = useState(localStorage.getItem("userName"));
  const [chosenEmoji, setChosenEmoji] = useState(null);
  // const onEmojiClick = (event, emojiObject) => {
  //   setChosenEmoji(emojiObject);
  // };

  const share = useRouter();
  const base = "https://chat.kobakoo.com";

  const params = useParams();
  const [message,setMessage] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const getPass = searchParams.get('pass')
  // const pass = searchParams.get('pass');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async ()=>{
    const docRef = doc(db, "rooms",params.roomId);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    const data= docSnap.data();
    if(docSnap.get("enabled")===true){
      setEnabled(docSnap.get("enabled"));
    }else{
      setEnabled(false);
    }
    if(docSnap.get("enabled")===true){
    setPassword(docSnap.get("password"));
    }
  },[params.roomId])

  useEffect(()=>{
    setPass(getPass);
  }, [getPass])

  useEffect(()=>{
    if(password===pass){
      setEnabled(false)
    }else{
      setEnabled(true)
    }
    // console.log(password===pass);
    // console.log(pass);
    // console.log(password);
  },[pass, password])

  useEffect(()=>{
    const docRef = collection(db, "rooms",params.roomId,"chats");
    const unsub = onSnapshot(docRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(),id: doc.id});
      });
      setChats(results);
    });
    // return () => unsub();
  },[params.roomId])

  const handleClick = () => {
    window.location.href = `http://chat.kobakoo.com/chat/${params.roomId}?pass=${userPassword}`;
  }

  return (
    <>
          <nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 fixed top-0 w-full">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" class="flex items-center">
              <Image src="https://kobakoo.com/logo.svg" class="h-8 w-auto mr-3" alt="kbk logo" width={150} height={100}/>
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ChatKBK</span>
          </Link>
          <Link href="/chat" className='p-2 hover:bg-slate-200 rounded-md transition'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
        </div>
      </nav>
    {enabled?(
      <>
            <title>ChatKBK｜パスワード｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！</title>
        <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image class="w-8 h-5 mr-2" src="https://kobakoo.com/logo.svg" alt="logo" width={150} height={100}/>
          ChatKBK
      </Link>
      <p className="max-w-full w-96 mx-auto text-center mb-3">パスワードを入力してください。パスワードを入力しても表示されている場合はパスワードが間違っている可能性があります。</p>
      <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              パスワードフォーム
          </h2>
          <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> パスワード</label>
                  <input type="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(event) => setUserPassword(event.target.value)} />
              </div>
              {/* <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="newsletter" aria-describedby="newsletter" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="newsletter" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                  </div>
              </div> */}
              <button type="button" class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={handleClick}>Submit</button>
          </div>
      </div>
  </div>
</section>
      </>
    ):(
      <div>
      <title>ChatKBK｜登録不要で今すぐ始められるSNS！規制に引っかからずに使えます！</title>
      <link
          rel="canonical"
          href={`https://chat.kobakoo.com/chat/${params.roomId}`}
        />
      <h1>{chats.name}</h1>
      <div className=' my-20 md:mx-16 sm:mx-8 mx-2'>
        {chats.map((chat)=>(
          <div key={chat.id} className='my-2'>
            <Link href={`/chat/${params.roomId}#${chat.id-999999999}`} className=''>
              <p className='font-sans text-lg p-2 bg-sky-100 justify-between flex'>{chat.chat}
                <div className='flex'>
                  <p className="font-mono">by <b>{chat.author}</b></p>
                </div>
              </p>
            </Link>
          </div>
        ))}
      </div>
      <form className='fixed bottom-1 w-full'>
          <label for="chat" class="sr-only">Your message</label>
          <div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          {/* <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Add emoji</span>
                </button> */}
              <div className="w-full md:flex">
              <textarea id="chat" rows="1" class="max-h-32 block p-2.5 md:w-10/12 w-full mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="メッセージを打ち込む..." onChange={(e)=>setMessage(e.target.value)} value={message}></textarea>
              <p className="m-auto md:block hidden text-xl">by</p>
              <textarea id="author" rows="1" class="max-h-32 block p-2.5 mx-auto text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="ニックネームを入れてください..." onChange={(e)=>{setAuthor(e.target.value);localStorage.setItem('userName', e.target.value);}} value={author}></textarea>
              </div>
              <button type="button" class="pl-1 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600" onClick={async ()=>{
                if(message===""){
                  alert("メッセージが入力されていません💦");
                }else{
                  const chat_id = String(chats.length+1000000000);
                  setDoc(doc(db, "rooms",params.roomId,"chats",chat_id), {
                    chat: message,
                    author: author,
                    // id: chat_id
                  });
                  setMessage("");
                }
              }}>
                  <svg aria-hidden="true" class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                  <span class="sr-only">Send message</span>
              </button>
          </div>
      </form>
    </div>
    )}
    </>
  )
}



export default page
