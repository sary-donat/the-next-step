import { createBrowserRouter } from "react-router";
import App from "../App";
import Welcome from "../pages/Welcome";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/login";
import Protected from "./protected";
import Applications from "../pages/Application";
import MyJobRoles from "../pages/JobRoles";
import ManageUsers from "../pages/ManageUsers";
import ManageJobRoles from "../pages/ManageJobRoles";
import ApplicationDetails from "../pages/ApplicationDetails";
import ApplicationForm from "../pages/ApplicationForm";
import Note from "../pages/Note";
import InstitutionLAndCreateAdmin from "../pages/Institutions";
import CreateInstitution from "../pages/CreateInstitution";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [

            {
                index: true,
                element: <Welcome />
            },

            {
                path: "register",
                element: <Register></Register>,
            },
            {
                path: "login",
                element: <Login></Login>

            },

            {
                element: <Protected></Protected>,
                children: [
                    {
                        path: "home",
                        element: <Home></Home>
                    },
                    {
                        path: "application",
                        element: <Applications></Applications>

                    },
                    {
                        path: "my-job-roles",
                        element: <MyJobRoles></MyJobRoles>
                    },

                    {
                        path: 'applications/new',
                        element: <ApplicationForm />
                    },
                    {
                        path: 'applications/:id/edit',
                        element: <ApplicationForm />
                    },
                    {
                        path: 'applications/:id',
                        element: <ApplicationDetails />
                    },
                    {
                        element: <Protected allowedRoles={['STUDENT']} />,
                        children:[
                            { path: 'notifications', element: <Note/> },
                        ]
                    },
                    {
                        element: <Protected allowedRoles={['INSTITUTION_ADMIN', 'SUPER_ADMIN']} />,
                        children: [
                            { path: 'admin/users', element: <ManageUsers /> },
                            { path: 'admin/job-roles', element: <ManageJobRoles /> },
                            // { path: 'admin/statuses', element: <ManageStatuses /> },
                        ],
                    },
                    {
                        element: <Protected allowedRoles={['SUPER_ADMIN']} />,
                        children:[
                            { path: 'institutions', element: <InstitutionLAndCreateAdmin/> },
                            {path:'createInstitution',element:<CreateInstitution/>}
                        ]
                    }

                    // {
                    //     element: <Protected allowedRoles={['SUPER_ADMIN']} />,
                    //     children: [{ path: 'admin/institutions', element: <ManageInstitutions /> }],
                    // },
                ]
            }
            ,
            {
                path: "*",
                element: <div className="mx-auto mt-10 max-w-md rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-5xl font-extrabold text-red-600">404</div>
            }
        ]
    }

])
export default router