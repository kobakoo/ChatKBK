/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { collection, onSnapshot, addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "@/lib/FirebaseConfig"

function page() {
  let [isOpen, setIsOpen] = useState(false)
  const [documents,setDocuments] = useState([])
  const [name,setName] = useState("")

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    setName("")
  }


  useEffect(()=>{
    const docRef = collection(db, "rooms");
    const unsub = onSnapshot(docRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(),id: doc.id});
      });
      setDocuments(results);
    });
    return () => unsub();
  },[])

  return (
    //チャット一覧を表示
    <div className='md:m-20 sm:m-10 m-2'>

<nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link href="/" class="flex items-center">
        <img src="https://kobakoo.com/logo.svg" class="h-8 w-auto mr-3" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ChatKBK</span>
    </Link>
  </div>
</nav>

      <button onClick={openModal} type="button" class=" mt-4 flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" /></svg>
        <p className='ml-1'>部屋を作る</p>
      </button>
    {documents.map((room)=>(
      <div key={room} className='my-2'>
        <div className='p-2 bg-slate-800/80 dark:bg-slate-100/70 rounded-lg shadow-lg focus:shadow-xl w-full'>
        <div className='flex justify-between'>
        <Link className='w-full' href={`/chat/${room.id}`}><h2 className='text-xl font-bold dark:text-black text-white'>{room.name}</h2></Link>
        <button className='' onClick={async ()=>{
          await deleteDoc(doc(db, "rooms", room.id));
          alert(`部屋名「${room.name}」を削除しましたよ⭐️`);
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white dark:text-black">
          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        </svg>
        </button>
        </div>
        </div>
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
                      この部屋は全ての人に公開されます。部屋の名前を入力してください。
                    </p>
                  </div>

                  <div className="mt-2">
                    <input type="text" placeholder="ここに名前を入力してください" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e)=>{
                      setName(e.target.value)
                      console.log(name);
                    }}></input>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async ()=>{
                        if(name === ""){
                          alert("名前を入力してください")
                        }else{
                          const docRef = await addDoc(collection(db, "rooms"), {
                            name: name,
                          });
                          closeModal();
                          alert(`${name}が作成されました!`)
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

<footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800 fixed bottom-1 w-10/12">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="https://kobakoo.com/" class="hover:underline" target='_blank'>KBK Corp</Link>. All Rights Reserved.
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <Link href="https://kobakoo.com" class="mr-4 hover:underline md:mr-6 ">About</Link>
        </li>
        <li>
            <Link target="_blank" href="/policy" class="mr-4 hover:underline md:mr-6">Privacy Policy</Link>
        </li>
        <li>
            <Link href="https://kobakoo.com/contact" class="hover:underline">Contact</Link>
        </li>
    </ul>
    </div>
</footer>

    </div>
  )
}

export default page
