import { PayloadAction, createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { Contact } from "./Contact";
import { Console } from "console";

axios.defaults.baseURL = "http://localhost:5276/";

export const fetchContacts = createAsyncThunk(
  'contact/fetchContacts',
  async (userId, thunkAPI) => {
    const response = await axios.get("Contact");
    return response.data
  }
)

export const addContact = createAsyncThunk(
  'contact/addContact',
  async (contact:Contact) => {
    const { data:id } = await axios.post("Contact", contact);    
    return { ...contact, id };
  }
)

export const editContact = createAsyncThunk(
  'contact/editContact',
  async (contact:Contact) => {
    
    const response = await axios.put(`Contact/${contact.id}`, contact);    
    return contact;
  }
)

export const deleteContact = createAsyncThunk(
  'contact/deleteContact',
  async (contactId: string | undefined) => {
    const response = await axios.delete(`Contact/${contactId}`);
    
    return contactId;
  }
)

type ContactStore = {
  contacts: Contact[];
}

const initialState: ContactStore = {
  contacts: []
}

const contactSlice = createSlice({
  name: 'contacts',
  initialState: initialState,
  reducers: {
    filter(state, action: PayloadAction<string>) {      
      if(action.payload.length)
        state.contacts = state.contacts.filter(x=>x.first.includes(action.payload));
    },

  },
  extraReducers: (builder) => {    
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      // Add user to the state array
      state.contacts = action.payload;
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      // Add user to the state array
      state.contacts = state.contacts.filter(x=>x.id !== action.payload);
    });

    builder.addCase(addContact.fulfilled, (state, action) => {
      // Add user to the state array
      state.contacts.push(action.payload);
    });

    builder.addCase(editContact.fulfilled, (state, action) => {
      // Add user to the state array
      state.contacts = state.contacts.map((item) => item.id === action.payload.id ? action.payload : item );
    });
  },
});


export const { filter } = contactSlice.actions;
export default contactSlice.reducer;

export const selectContacts = (state: RootState) => state.contacts;
export const selectContactById = (id: string | undefined) => createSelector(
  (state: RootState) => state.contacts, // Assuming your store has a "data" property
  (contacts) => {
    // Filter the data based on the input
    const filteredData = contacts.filter(x => x.id == id);
    return filteredData[0];
  }
);

