import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, signal } from '@angular/core';

const API = '/api'; // API local de demo (repo api-java).

interface Pedido { id: number; productos: string; total: number; fecha: string; }

// Pedidos está en otro apartado: no escucha eventos, lee el historial de la API al abrir.
@Component({
 selector: 'app-pedidos',
 standalone: true,
 schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite usar <tienda-resumen-carrito>, que no es Angular.
 template: `<section><small>ANGULAR · localhost:4504</small><h2>Mis pedidos</h2>
 <div class="columnas"><div>
   @if (error()) { <p>{{ error() }}</p> }
   @for (p of pedidos(); track p.id) {
     <div class="pedido"><b>Pedido #{{ p.id }} · S/ {{ total(p).toFixed(2) }}</b><span>{{ p.productos }}</span><small>{{ p.fecha }}</small></div>
   } @empty { @if (!error()) { <p>Todavía no hay pedidos. Finaliza una compra en el carrito.</p> } }
 </div>
 <!-- La misma pieza del módulo carrito, reutilizada en otro módulo Angular. -->
 <tienda-resumen-carrito>Resumen del carrito no disponible.</tienda-resumen-carrito>
 </div></section>`,
 styles: [`section { border:2px solid #6d28d9;padding:20px;border-radius:8px; }
  .columnas { display:grid;grid-template-columns:3fr 2fr;gap:20px;align-items:start; }
  @media (max-width:700px) { .columnas { grid-template-columns:1fr; } }
  .pedido { display:grid;gap:2px;padding:10px 0;border-bottom:1px solid #eee; }
  .pedido small { color:#666; }`]
})
export class PedidosComponent implements OnInit {
 pedidos = signal<Pedido[]>([]);
 error = signal('');
 // Le pide al shell el total con descuento e IGV; si no lo tiene (o no hay shell), usa el de la API.
 total(p: Pedido): number { return (window as any).tiendaEstado?.totalPedido(p.id) ?? p.total; }
 async ngOnInit() {
   try {
     const respuesta = await fetch(API + '/pedidos');
     this.pedidos.set(await respuesta.json());
   } catch {
     this.error.set('API apagada: no se pudo cargar el historial.');
   }
 }
}
