// import { Routes } from '@angular/router';
// import { LoginComponent } from './pages/auth/login/login';
// import { RegisterComponent } from './pages/auth/register/register';
// import { ChangePasswordComponent } from './pages/auth/change-password/change-password';

// export const routes: Routes = [
//     {path : 'login' , component : LoginComponent},
//     {path : 'register' , component : RegisterComponent},
//     {path : 'changePassword' , component : ChangePasswordComponent}
// ];


import { Routes } from '@angular/router';

// 🧾 Auth Components
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { ChangePasswordComponent } from './pages/auth/change-password/change-password';



// 🧑‍💼 Admin Components
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { CreateCandidate } from './pages/admin/create-candidate/create-candidate';
import { CreateInterviewer } from './pages/admin/create-interviewer/create-interviewer';
import { AssignInterview } from './pages/admin/assign-interview/assign-interview';
import { ViewAssignments } from './pages/admin/view-assignments/view-assignments';

export const routes: Routes = [
    // 🧾 Authentication routes
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'changePassword', component: ChangePasswordComponent },

    //Admin dashboard routes (nested)
    {
        path: 'admin/dashboard',
        component: Dashboard,
        children: [
            { path: 'create-interviewer', component: CreateInterviewer },
            { path: 'create-candidate', component: CreateCandidate },
            { path: 'assign-interview', component: AssignInterview },
              { path: 'view-assignments', component: ViewAssignments },
            { path: '', redirectTo: 'create-interviewer', pathMatch: 'full' } // default page
        ]
    },

    //Default redirect (root)
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Catch-all route for 404s
    { path: '**', redirectTo: '/login' }
];
