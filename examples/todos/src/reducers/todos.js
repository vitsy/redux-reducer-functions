const defState = []

export function addTodo(state, action) {
    return [
      ...state,
      {
        id: action.id,
        text: action.text,
        completed: false
      }
    ]
  }

export function toggleTodo(state, action){
    return state.map(todo =>
      (todo.id === action.id)
        ? {...todo, completed: !todo.completed}
        : todo
    )
  }

export function testAsync(state, action){
  return state;
}

export function other(state = defState, action){
  // place for standart redux switch/case
  return state;
}



