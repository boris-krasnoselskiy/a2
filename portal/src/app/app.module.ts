import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { MatDialogModule } from '@angular/material/dialog';
// import { FileUploadModule } from 'primeng/primeng';
import { SlickModule } from 'ngx-slick';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AgmCoreModule } from '@agm/core';
import { AgmMap, AgmDataLayer } from '@agm/core';

import { routes } from './app.routes';
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { WidgetsComponent } from './components/partials/widgets/widgets.component';
import { MapComponent } from './components/partials/map/map.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { CompanyComponent } from './components/company/company.component';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { PopupComponent } from './components/popup/popup.component';
import { FranchisesComponent } from './components/franchises/franchises.component';
import { MapPageComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { PointComponent } from './components/point/point.component';
import { NewsComponent } from './components/news/news.component';
import { OneNewsComponent } from './components/one-news/one-news.component';
import { BecomePartnerComponent } from './components/become-partner/become-partner.component';
import { RubricsComponent } from './components/rubrics/rubrics.component';
import { SuccessComponent } from './components/success/success.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { FeedbackComponent } from './components/feedback/feedback.component';

import { MapService } from 'app/services/map.service';
import { HeaderService } from 'app/services/header.service';
import { HomeService } from 'app/services/home.service';
import { SearchService } from 'app/services/search.service';
import { FranchisesService } from 'app/services/franchises.service';
import { HeaderMapService } from 'app/services/header_map.service';
import { MapPageService } from 'app/services/map_page.service';
import { SearchResultService } from 'app/services/search_result.service';
import { HeaderSearchService } from 'app/services/header_search.service';
import { PointService } from 'app/services/point.service';
import { CompanyService } from 'app/services/company.service';
import { CustomUrlSerializer } from 'app/customUrlSerializer';
import { AddCompanyService } from 'app/services/add-company.service';
import { NewsService } from 'app/services/news.service';
import { OneNewsService } from 'app/services/one-news.service';
import { RubricsService } from 'app/services/rubrics.service';
import { FeedbackService } from 'app/services/feedback.service';
import { RegistrationComponent } from './components/registration/registration.component';
import { AboutService } from 'app/services/about.service';
import { BecomeService } from 'app/services/become.service';
import { CompanyHeaderService } from 'app/services/company_header.service';
import { PointMapService } from 'app/services/point-map.service';
import { HeaderCompanyService } from 'app/services/header_company.service';
import { HeaderSideMapService } from 'app/services/header_side_map.service';

const googleMapsCore = AgmCoreModule.forRoot({
  apiKey : 'AIzaSyBzhpvp_zB3vLq1gYPWp0YwghzeHvaS6XY',
});

export class CORSBrowserXHR extends BrowserXhr {
  build(): any{
      var xhr:any = super.build();
      xhr.withCredentials = true;
      return xhr;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutComponent,
    CompanyComponent,
    WidgetsComponent,
    AddPhotoComponent,
    PopupComponent,
    FranchisesComponent,
    MapPageComponent,
    SearchComponent,
    PointComponent,
    NewsComponent,
    OneNewsComponent,
    BecomePartnerComponent,
    RubricsComponent,
    SuccessComponent,
    AddCompanyComponent,
    FeedbackComponent,
    RegistrationComponent,
  ],
  imports: [
    // FileUploadModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    googleMapsCore,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    // MatTabsModule,
    BrowserAnimationsModule,
    // LeafletModule.forRoot(),
    NgxCarouselModule,
    MalihuScrollbarModule.forRoot(),
    LeafletModule.forRoot(),
    [RouterModule.forRoot(routes)]
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [RouterModule],
  providers: [
    MapService,
    HeaderService,
    HomeService,
    FranchisesService,
    SearchService,
    HeaderMapService,
    MapPageService,
    CompanyHeaderService,
    HeaderSearchService,
    SearchResultService,
    PointService,
    CompanyService,
    AddCompanyService,
    NewsService,
    BecomeService,
    HeaderCompanyService,
    PointMapService,
    OneNewsService,
    AboutService,
    RubricsService,
    FeedbackService,
    HeaderSideMapService,
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    { provide: BrowserXhr, useClass: CORSBrowserXHR }
  ],
  entryComponents:[PopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
