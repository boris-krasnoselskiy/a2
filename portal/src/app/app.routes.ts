import { Routes } from "@angular/router";
import { HomeComponent } from "app/components/home/home.component";
import { PageNotFoundComponent } from "app/components/page-not-found/page-not-found.component";
import { AboutComponent } from "app/components/about/about.component";
import { CompanyComponent } from "app/components/company/company.component";
import { AddPhotoComponent } from "app/components/add-photo/add-photo.component";
import { FranchisesComponent } from './components/franchises/franchises.component';
import { MapPageComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { PointComponent } from "app/components/point/point.component";
import { SuccessComponent } from "app/components/success/success.component";
import { OneNewsComponent } from "app/components/one-news/one-news.component";
import { NewsComponent } from "app/components/news/news.component";
import { RubricsComponent } from "app/components/rubrics/rubrics.component";
import { RegistrationComponent } from "app/components/registration/registration.component";
import { AddCompanyComponent } from "app/components/add-company/add-company.component";
import { FeedbackComponent } from "app/components/feedback/feedback.component";
import { BecomePartnerComponent } from "app/components/become-partner/become-partner.component";

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'add-photo/:id', component: AddPhotoComponent},
    { path: 'add-company', component: AddCompanyComponent},
    { path: 'all-rubrics', component: RubricsComponent},
    { path: 'all-rubrics/:id', component: RubricsComponent},
    { path: 'franchises', component: FranchisesComponent},
    { path: 'companies/:id', component: CompanyComponent},
    { path: 'points/:id', component: PointComponent},
    { path: 'about', component: AboutComponent},
    { path: 'search/', redirectTo: 'home', pathMatch: 'full'},
    { path: 'search/:name', component: SearchComponent},
    { path: 'search/work_now/:name', component: SearchComponent},
    { path: 'search/near/:name', component: SearchComponent},
    { path: 'search/work_now/near/:name', component: SearchComponent},
    { path: 'map_page', component: MapPageComponent},
    { path: 'map_page/company/:id', component: MapPageComponent},
    { path: 'map_page/point/:id', component: MapPageComponent},
    { path: 'success', component: SuccessComponent},
    { path: 'news', component: NewsComponent},
    { path: 'news/:id', component: OneNewsComponent},
    { path: 'feedback/:id', component: FeedbackComponent},
    { path: 'become/:id', component: BecomePartnerComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
]