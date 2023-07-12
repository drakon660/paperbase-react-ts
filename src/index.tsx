import React, { Children } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//import Root, { loader as rootLoader, action as rootAction } from "./routes/Root";
import Root from "./routes/Root";
import ErrorPage from './error-page';
import ContactPage from './routes/ContactPage';
import NewContact from './routes/Edit';
import { destroyAction } from './routes/Destroy';
import { Provider } from 'react-redux';
import store from './store';
import { fetchContacts } from './contactSlice';
import { NotFound } from './routes/NotFound';
import EditContact from './routes/Edit';

store.dispatch(fetchContacts());

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    //loader: rootLoader,
    //action: rootAction,
    children: [
      {
        errorElement: <div>Oops! There was an error.</div>,
        children: [
          {
            index: true,
            element: "empty page"
          },
          {
            path: "contacts/:contactId",
            element: <ContactPage />,
            //loader: contactLoader,
            //action: contactAction
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            //loader: contactLoader,
            //action: contactAction
          },
          {
            path: "notfound",
            element: <NotFound />,
            //loader: contactLoader,
            //action: editAction
          },
          {
            path: "contacts/new",
            element: <NewContact />,
            //loader: contactLoader,
            //action: editAction
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
          }],
      }
    ],
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
