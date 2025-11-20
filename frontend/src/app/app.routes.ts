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



// Admin Components
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { CreateCandidate } from './pages/admin/create-candidate/create-candidate';
import { CreateInterviewer } from './pages/admin/create-interviewer/create-interviewer';
import { AssignInterview } from './pages/admin/assign-interview/assign-interview';
import { ViewAssignments } from './pages/admin/view-assignments/view-assignments';
import { MeetingComponent } from './pages/meeting/meeting';
import { ReportsComponent } from './pages/admin/reports/reports';
import { OfferLetterComponent } from './pages/admin/offer-letter/offer-letter';
import { AdminCandidatesComponent } from './pages/admin/admin-candidates/admin-candidates';

import { Hello } from './hello/hello';

import { authGuard } from './guards/auth-guard';
import { candidateGuard } from './guards/candidate-guard';
import { interviewerGuard } from './guards/interviewer-auth-guard';

// 🚪 Candidate Components
import { CandidateDashboard } from './pages/candidate/candidate-dashboard/candidate-dashboard';
import { CandidateHome } from './pages/candidate/candidate-home/candidate-home';
import { InterviewUpdate } from './pages/candidate/interview-update/interview-update';
import { UploadResume } from './pages/candidate/upload-resume/upload-resume';
import { CandidateFeedback } from './pages/candidate/candidate-feedback/candidate-feedback';

// Interviewer Components
import { InterviewerDashboard } from './pages/interviewer/interviewer-dashboard/interviewer-dashboard';
import { InterviewerHome } from './pages/interviewer/interviewer-home/interviewer-home';
import { UpcomingInterviews } from './pages/interviewer/upcoming-interviews/upcoming-interviews';
import { AssignedInterviews } from './pages/interviewer/assigned-interviews/assigned-interviews';
import { CompletedInterviews } from './pages/interviewer/completed-interviews/completed-interviews';
import { LandingComponent } from './pages/landing/landing';




export const routes: Routes = [
    // 🧾 Authentication routes
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'changePassword', component: ChangePasswordComponent },
    { path: 'meeting/:meetingId', component: MeetingComponent },
    { path: 'landing', component: LandingComponent },
    {
        path: 'hello',
        component: Hello,
        canActivate: [authGuard]     // <-- PROTECT PAGE
    },

    //Admin dashboard routes (nested)
    {
        path: 'admin/dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        children: [
            { path: 'create-interviewer', component: CreateInterviewer },
            { path: 'create-candidate', component: CreateCandidate },
            { path: 'assign-interview', component: AssignInterview },
            { path: 'view-assignments', component: ViewAssignments },
            { path: 'view-reports', component: ReportsComponent },
            { path: 'offer-letter', component: OfferLetterComponent},
            {path: 'admin-candidates', component: AdminCandidatesComponent},
            { path: '', redirectTo: 'create-interviewer', pathMatch: 'full' } // default page
        ]
    },


    // Candidate dashboard routes (nested)
    {
        path: 'candidate/candidate-dashboard',
        canActivate: [candidateGuard],
        component: CandidateDashboard,
        children: [
            { path: 'candidate-home', component: CandidateHome },
            { path: 'interview-update', component: InterviewUpdate },
            { path: 'upload-resume', component: UploadResume },
            { path: 'candidate-feedback', component: CandidateFeedback },
            { path: '', redirectTo: 'candidate-home', pathMatch: 'full' } // default page
        ]
    },

    // Interviewer dashboard routes (nested)
    {
        path: 'interviewer/interviewer-dashboard',
        component: InterviewerDashboard,
        canActivate: [interviewerGuard],
        children: [
            { path: 'interviewer-home', component: InterviewerHome },
            { path: 'upcoming-interviews', component: UpcomingInterviews },
            { path: 'assigned-interviews', component: AssignedInterviews },
            { path: 'completed-interviews', component: CompletedInterviews},
            { path: '', redirectTo: 'interviewer-home', pathMatch: 'full' } // default page
        ]
    },
    //Default redirect (root)
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Catch-all route for 404s
    { path: '**', redirectTo: '/login' }
];
