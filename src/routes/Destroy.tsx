import { ActionFunction, redirect } from "react-router-dom";
import { deleteContact } from "../Contacts";

interface Params {
    contactId: string
  }

export const destroyAction : ActionFunction = async ({params}) => {  
    console.log(params);
    throw new Error("pocaluj mnie w dupe");
    const typedParams = params as unknown as Params;    
    await deleteContact(typedParams.contactId)
    return redirect("/");
  }
