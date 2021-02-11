'use strict';

exports.createTasksTable = `
    create table if not exists tasks (
        id integer primary key,
        text text not null,
        checked boolean not null default false
    );
`;

exports.createTask = `
    insert into tasks (text, checked)
    values ($text, $checked)
`;

exports.getLastTask = `
    select *
    from tasks
    order by id desc
    limit 1
`;

exports.listTasks = `
    select *
    from tasks
`;

exports.toggleTask = `
    update tasks
    set checked = $checked
    where id = $id
`;

exports.deleteTask = `
    delete from tasks
    where id = $id
`;
