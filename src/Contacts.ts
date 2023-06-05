import localforage from "localforage";
import { matchSorter } from "match-sorter";
//import sortBy from "sort-by";
import { Contact } from "./Contact";

export async function getContacts(query:any) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem<Contact[]>("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts;
  //.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact:Contact = { id, avatar:"",favorite:false,first:"",last:"",notes:"",twitter:"", createdAt: Date.now() };
  let contacts = await getContacts("");
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id:string | undefined) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem<Contact[]>("contacts");
  let contact = contacts?.find(contact => contact.id === id);
  return contact;
}

export async function updateContact(id:string, updates:any) {
  await fakeNetwork();
  let contacts = await localforage.getItem<Contact[]>("contacts");
  let contact = contacts?.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for " + id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id:string) {
  let contacts = await localforage.getItem<Contact[]>("contacts");
  let index = contacts?.findIndex(contact => contact.id === id) ?? -1;
  if (index > -1) {
    contacts?.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts:any) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache : {
    [key:string] : boolean
};

async function fakeNetwork(key?:any) {
  
  return new Promise(res => {
    setTimeout(res, Math.random() * 500);
  });
}