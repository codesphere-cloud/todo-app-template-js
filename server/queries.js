'use strict';

exports.createTasksTable = `
    create table if not exists tasks (
        id integer primary key,
        name text not null,
        completed boolean not null default false,
        created timestamp not null default current_timestamp
    );
`;

exports.createTask = `
    insert into tasks (name)
    values ($name)
`;

exports.listTasks = `
    select *
    from tasks
`;

exports.deleteTask = `
    delete from tasks
    where id = $id
`;
