import { ActionFunction, Form, redirect, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Contact } from "../Contact";
import { useAppDispatch, useAppSelector } from "../store";
import { addContact, deleteContact, fetchContacts, selectContactById } from "../contactSlice";
import { useForm } from "react-hook-form";


interface Params {
    contactId: string
  }
  

// export const editAction : ActionFunction = async ({request, params}) => {  
//     const typedParams = params as unknown as Params;
//     const formData = await request.formData();
//     const updates = Object.fromEntries(formData);
//     await updateContact(typedParams.contactId, updates);
//     return redirect(`/contacts/${params.contactId}`);
//   }


export default function NewContact() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Contact>();

  const onSubmit = handleSubmit((data) => {
    dispatch(addContact(data))    
    navigate('/');
  });
  
  return (
    <div>
    <form onSubmit={onSubmit} id="contact-form">
      <p>
     <span>Name</span>
    <input {...register("first")}  placeholder="First"  aria-label="First name"  type="text" />    
    <input {...register("last")} />
    </p>
    <label>
        <span>Twitter</span>
    <input {...register("twitter")} />
    </label>
    <label>
        <span>Avatar URL</span>
    <input {...register("avatar")} />
    </label>
    <label>
        <span>Notes</span>
    <input {...register("notes")} />
    </label> <p>
    <input type="submit" />
    </p>
  </form>   
    </div>
  );
}