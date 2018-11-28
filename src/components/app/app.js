import React from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends React.Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Create Awesome app'),
      this.createTodoItem('have a lunch')
    ],
    term: '',
    filter: 'active'
  }

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const array = todoData.filter((el) => el.id !== id)
      return {
        todoData: array
      }
    })
  }

  addItem = (text) => {
    const newItem = this.createTodoItem(text);
    this.setState(({ todoData }) => {
      return {
        todoData: [...todoData, newItem]
      }
    })
  };

  toggleProperty(array, id, propertyName) {
    const idx = array.findIndex((el) => el.id === id);

    const oldItem = array[idx];
    const newItem = { ...oldItem, [propertyName]: !oldItem[propertyName] };

    return [
      ...array.slice(0, idx),
      newItem,
      ...array.slice(idx + 1)
    ]
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  }

  onSearchChange = (term) => {
    this.setState({ term });
  }

  onFilterChange = (filter) => {
    this.setState({ filter });
  }

  search(items, term) {
    if (term.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return item.label
        .toLowerCase()
        .indexOf(term.toLowerCase()) > -1;
    })
  }

  filter(items, filter) {
    switch (filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  render() {

    const { todoData, term, filter } = this.state;

    const doneCount = this.state.todoData.filter((el) => el.done);
    const todoCount = this.state.todoData.length - doneCount.length;
    const visibleItems = this.filter(this.search(todoData, term), filter);


    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount.length} />
        <div className="top-panel d-flex">
          <SearchPanel
            onSearchChange={this.onSearchChange} />
          <ItemStatusFilter
            filter={filter} 
            onFilterChange={this.onFilterChange}/>
        </div>

        <TodoList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />
        <ItemAddForm
          onItemAdded={this.addItem} />
      </div>
    );

  }
}
