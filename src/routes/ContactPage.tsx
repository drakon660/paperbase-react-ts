import { ActionFunction, Form, LoaderFunction, useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Contact } from "../Contact";
import { useAppDispatch, useAppSelector } from "../store";
import { deleteContact, fetchContacts, selectContactById } from "../contactSlice";
import { useEffect } from "react";

interface Params {
  contactId: string
}

// export const action: ActionFunction = async ({ request, params }) => {
//   const typedParams = params as unknown as Params;
//   let formData = await request.formData();
//   return updateContact(typedParams.contactId, {
//     favorite: formData.get("favorite") === "true",
//   });
// }

// export const loader : LoaderFunction = async ({params}) => {  
//   const typedParams = params as unknown as Params;
//   const contact = await getContact(typedParams.contactId);  
//   return contact;
// }

export default function ContactPage() {
  const { contactId } = useParams();

  const contact = useAppSelector(selectContactById(contactId));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const deleteContactOnClick = () => {
    dispatch(deleteContact(contactId));
    navigate('/');
  }

  const editContactOnClick = () => {   
    navigate(`edit`);
  }

  return (
    contact &&
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
          <button onClick={editContactOnClick}>Edit</button>
          <button onClick={deleteContactOnClick}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Favorite(props: { contact: Contact }) {
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
