import { persistentAtom } from '@nanostores/persistent';

// 'cart' es la llave bajo la cual se guardará en el navegador
// [] es el estado inicial (vacío)
export const cartItems = persistentAtom('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Función para AÑADIR
export function addItem(nuevoProducto) {
  const items = cartItems.get();
  const existe = items.find(i => i.id === nuevoProducto.id);

  if (existe) {
    cartItems.set(items.map(i => 
      i.id === nuevoProducto.id ? { ...i, cantidad: i.cantidad + 1 } : i
    ));
  } else {
    cartItems.set([...items, { ...nuevoProducto, cantidad: 1 }]);
  }
}

// Función para INCREMENTAR
export function incrementQuantity(id) {
  const items = cartItems.get();
  cartItems.set(items.map(i => 
    i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i
  ));
}

// Función para DECREMENTAR
export function decrementQuantity(id) {
  const items = cartItems.get();
  cartItems.set(items.map(i => 
    i.id === id && i.cantidad > 1 ? { ...i, cantidad: i.cantidad - 1 } : i
  ));
}

// Función para ELIMINAR
export function removeItem(id) {
  const items = cartItems.get();
  cartItems.set(items.filter(i => i.id !== id));
}