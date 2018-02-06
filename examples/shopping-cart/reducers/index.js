import  { combineReducers } from '../redux-reducer-functions'
import * as cart from './cart'
import * as products from './products'

export function getTotal(state) {
  return cart.getAddedIds(state.cart).reduce((total, id) =>
    total + products.getProduct(state.products, id).price * cart.getQuantity(state.cart, id),
    0
  ).toFixed(2)
}

export function getCartProducts(state) {
  return cart.getAddedIds(state.cart).map(id => Object.assign(
    {},
     products.getProduct(state.products, id),
    {
      quantity: cart.getQuantity(state.cart, id)
    }
  ))
}

export default combineReducers({
  cart,
  products
})
