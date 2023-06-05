import { ActionFunction, Form, LoaderFunction, useFetcher, useLoaderData, useParams } from "react-router-dom";
import { Contact } from "../Contact";
import { getContact, updateContact } from "../Contacts";

interface Params {
  contactId: string
}

export const action: ActionFunction = async ({ request, params }) => {
  const typedParams = params as unknown as Params;
  let formData = await request.formData();
  return updateContact(typedParams.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export const loader : LoaderFunction = async ({params}) => {  
  const typedParams = params as unknown as Params;
  const contact = await getContact(typedParams.contactId);  
  return contact;
}

export default function ContactPage() {  
  const contact = useLoaderData() as Contact;

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar}
          title="title1"
        />
      </div>
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}
        
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite(props: {contact:Contact}) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = props.contact.favorite;

  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  
  return (
    <fetcher.Form method="post">
    <button
      name="favorite"
      value={favorite ? "false" : "true"}
      aria-label={
        favorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      {favorite ? "★" : "☆"}
    </button>
  </fetcher.Form>
  );
}