import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  // Componentes que pertenecen a este módulo
  declarations: [NavbarComponent, NotFoundComponent],

  // Lo que ESTE módulo necesita para que sus plantillas funcionen
  // (ngIf/ngFor, formularios reactivos, routerLink)
  imports: [CommonModule, ReactiveFormsModule, RouterModule],

  // Lo que COMPARTE con cualquier módulo que importe SharedModule.
  // Así los módulos de funcionalidades no repiten estos imports.
  exports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, NotFoundComponent],
})
export class SharedModule {}
