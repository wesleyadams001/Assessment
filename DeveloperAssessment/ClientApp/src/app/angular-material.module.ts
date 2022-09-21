import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio'; 

//Dedicated module for hosting all the angular material items of interest
@NgModule({
  imports: [

    MatRadioModule,

    //to set up the side controls
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    //pull in to render our table
    MatTableModule,

    //allow us to paginate
    MatPaginatorModule,

    //allow us to sort if necessary
    MatSortModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    MatRadioModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule
  ]
})

export class AngularMaterialModule { }