let nextTodoId = 0
export const addTodo = (text) => ({
  type: 'todos.addTodo',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = (filter) => ({
  type: 'visibilityFilter.setVisibilityFilter',
  filter
})


export const toggleTodo = (id) => ({
  type: 'todos.toggleTodo',
  id
})
