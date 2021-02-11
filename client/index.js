/* global document fetch */

'use strict';

let tasks = [];

function renderTodo(task) {
    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key='${task.id}']`);

    if (task.deleted) {
        item.remove();
        if (tasks.length === 0) {
            list.innerHTML = '';
        }
        return;
    }

    const isChecked = task.checked ? 'done': '';
    const node = document.createElement('li');
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', task.id);
    node.innerHTML = `
        <input id="${task.id}" type="checkbox"/>
        <label for="${task.id}" class="tick js-tick"></label>
        <span>${task.text}</span>
        <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
        </button>
    `;

    if (item) {
        list.replaceChild(node, item);
    } else {
        list.append(node);
    }
}

async function addTodo(text) {
    const options = {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text, checked: false}),
    };

    const task = await (await fetch('/tasks', options)).json();

    tasks.push(task);
    renderTodo(task);
}

async function toggleDone(key) {
    const index = tasks.findIndex(item => item.id === Number(key));
    const task = tasks[index];

    task.checked = !task.checked;
    renderTodo(task);

    const options = {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({checked: task.checked}),
    };

    await fetch(`/tasks/${key}`, options);
}

async function deleteTodo(key) {
    const index = tasks.findIndex(item => item.id === Number(key));
    const todo = {
        deleted: true,
        ...tasks[index]
    };
    tasks = tasks.filter(item => item.id !== Number(key));
    renderTodo(todo);

    await fetch(`/tasks/${key}`, {method: 'delete'});
}

const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.querySelector('.js-todo-input');

    const text = input.value.trim();
    if (text !== '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }

    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodo(itemKey);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    tasks = await (await fetch('/tasks')).json();
    tasks.forEach(t => renderTodo(t));
});
