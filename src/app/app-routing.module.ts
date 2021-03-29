import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { IdGeneratorComponent } from './component/id-generator/id-generator.component';


const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'idGenerator', component: IdGeneratorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
