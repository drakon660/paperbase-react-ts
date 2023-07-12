import { LoaderFunction, Navigate, Outlet, redirect, useLoaderData, useMatch, useNavigate, useNavigation } from "react-router";
import { Form, NavLink, useSubmit } from "react-router-dom";
import { createContact, getContacts } from "../Contacts";
import { Contact } from "../Contact";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchContacts, filter, selectContacts } from "../contactSlice";
import { Control, useForm, useWatch } from "react-hook-form";
// export const loader : LoaderFunction = async ({request}) => {
//   const url = new URL(request.url);  
//   const q = url.searchParams.get("q") || "";
//   const contacts = await getContacts(q);
//   console.log({ contacts , q });
//   return { contacts , q };
// }

// export async function action() {
//   const contact = await createContact();
//   return redirect(`/contacts/${contact.id}/edit`);
// }

interface SearchInput {
  query: string;
}

export default function Root() {
  const contacts = useAppSelector(selectContacts);
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { register, control } = useForm<SearchInput>();

  const query = useWatch({
    control,
    name: "query", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: "" // default value before the render
  });

  const filteredContacts = contacts.filter(x => x.first.includes(query));

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input {...register("query")} />                        
          </form>
          <button onClick={() => navigate('contacts/new')}>New</button>
        </div>
        <nav>
          {filteredContacts.length ? (
            <ul>
              {filteredContacts.map((contact: Contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                        ? "pending"
                        : ""
                  }>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={
        navigation.state === "loading" ? "loading" : ""
      }><Outlet /></div>
    </>
  );
}