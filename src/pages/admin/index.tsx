import { useEffect, useState, type FormEvent } from "react";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";

import { FiTrash } from 'react-icons/fi'
import { db } from '../../services/firebaseConnection'
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc
} from 'firebase/firestore'


interface LinkProps {
    id: string,
    name: string,
    url: string,
    bg: string,
    color: string
}

export function Admin() {

    const [name, setName] = useState("")
    const [url, setUrl] = useState("")
    const [textColor, setTextColor] = useState("#f1f1f1")
    const [backgroundColor, setBackgroundColor] = useState("#121212")

    const [links, setLinks] = useState<LinkProps[]>([])

    useEffect(() => {

        const linksRef = collection(db, "links")
        const queryRef = query(linksRef, orderBy("created", "asc"))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let lista = [] as LinkProps[]

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })

            setLinks(lista)
        })

        return () => {
            unsub()
        }

    }, [])

    function handleRegister(e: FormEvent) {
        e.preventDefault()

        if (name === "" || url === "") {
            alert("Preencha todos os campos")
            return
        }

        addDoc(collection(db, "links"), {
            name: name,
            url: url,
            bg: backgroundColor,
            color: textColor,
            created: new Date()
        })
            .then(() => {
                setName("")
                setUrl("")
                console.log("Cadastrado com sucesso!")
            }).catch((error) => {
                console.log(error)
            })

    }


    async function handleDeleteLink(id: string) {

        const docRef = doc(db, "links", id)
        await deleteDoc(docRef)

    }

    return (
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>
                <Input
                    placeholder="Digite o nome do link..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label className="text-white font-medium mt-2 mb-2">Url do Link</label>
                <Input
                    type="url"
                    placeholder="Digite a url..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <section className="flex my-4 gap-5">
                    <div className="flex gap-2 items-center">
                        <label className="text-white font-medium mt-2 mb-2">Cor do link</label>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do link</label>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                </section>

                {name !== '' && (
                    <div className="flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md">
                        <label className="text-white font-medium mt-2 mb-3">Veja como está ficando:</label>
                        <article
                            className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-red-200 rounded px-1 py-3"
                            style={{ marginBottom: 8, marginTop: 8, backgroundColor: backgroundColor }}
                        >
                            <p
                                className="font-medium"
                                style={{ color: textColor }}
                            >
                                {name}
                            </p>
                        </article>
                    </div>
                )}

                <button
                    type="submit"
                    className="mb-7 bg-blue-600 h-10 rounded-md text-white font-medium flex justify-center items-center gap-4 cursor-pointer"
                >
                    Cadastrar
                </button>

            </form>

            <h2 className="font-bold text-white mb-4 text-2xl">
                Meus links
            </h2>

            {links.map((link) => (
                <article
                    key={link.id}
                    className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
                    style={{ backgroundColor: link.bg, color: link.color }}
                >
                    <p>{link.name}</p>
                    <div>
                        <button
                            className="border border-dashed p-1 rounded cursor-pointer bg-neutral-900"
                            onClick={() => handleDeleteLink(link.id)}
                        >
                            <FiTrash
                                size={18}
                                color="#fff"
                            />
                        </button>
                    </div>
                </article>
            ))}

        </div >
    )
}