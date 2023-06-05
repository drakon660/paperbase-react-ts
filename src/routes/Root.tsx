import { LoaderFunction, Outlet, redirect, useLoaderData, useNavigation } from "react-router";
import { Form, Link, NavLink, useSubmit } from "react-router-dom";
import { createContact, getContacts } from "../Contacts";
import { Contact } from "../Contact";
import { useEffect, useState } from "react";

export const loader : LoaderFunction = async ({request}) => {
  const url = new URL(request.url);  
  const q = url.searchParams.get("q") || "";
  const contacts = await getContacts(q);
  console.log({ contacts , q });
  return { contacts , q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData() as { contacts: Contact[], q: string };
  const [query, setQuery] = useState(q);
  const submit = useSubmit();
   const navigation = useNavigation();

   const searching =
   navigation.location &&
   new URLSearchParams(navigation.location.search).has(
     "q"
   );

   useEffect(() => {
    setQuery(q);
  }, [q]);

    return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                className={searching ? "loading" : ""}
                value={query}
                onChange={(e) => {         
                  const isFirstSearch = q == null;         
                  submit(e.currentTarget.form, {
                    replace: !isFirstSearch
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact:Contact) => (
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