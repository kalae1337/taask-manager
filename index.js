import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const tasksFile = 'tasks.json';

const readTasks = () => {
     try {
        const dataBuffer = fs.readFileSync(tasksFile);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error){
        return [];
    }
};

const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(tasksFile, dataJSON);
}

const argv = yargs(hideBin(process.argv))
.command(
    'add <task>', 
    'Add a task', 
    () => {}, 
    (argv) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        description: argv.task,
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`✅ Task ${argv.task} added succesfully!`);
})

.command(
    'list',
    'List all tasks',
    () => {
    const tasks = readTasks();
    if (tasks.length === 0){
        console.log('No tasks available right now.');
        return;
    }
    console.log('Task List:');
    tasks.forEach(task => {
        console.log(`${task.id}. ${task.description} - ${task.completed ? 'Completed' : 'Not Completed'}`);
    });
})

.command(
    'complete <id>', //required argument
    'Mark a task as complete',
    (yargs) => {
        return yargs.positional('id', {
            type: 'number',
            describe: 'The ID of the task to complete'
        });
    },
    (argv) => {
        const tasks = readTasks();
        const task = tasks.find(t => t.id === argv.id);

        if (!task) {
            
            console.error(`Error: Task with ID ${argv.id} not found.`);
            process.exit(1); 
        }

        task.completed = true;
        saveTasks(tasks);
        console.log(`✅ Task ${argv.id} marked as completed!`);
    }
)

.parse();



// yargs().command({
//     command: 'complete',
//     describe: 'Mark a task as completed',
//     builder: {
//         id: {
//             describe: 'Task ID to mark as completed',
//             demandOption: true,
//             type: 'number'
//         }
//     },
//     handler(argv) {
//         const tasks = readTasks();
//         const task = tasks.find((task) => task.id === argv.id);
//         if (!task) {
//             console.log('Task not found!');
//             return;
//         }
//         task.completed = true;
//         saveTasks(tasks);
//         console.log(`Task ${argv.id} marked as completed!`);
//     }
// });

// yargs().command({
//     command: 'remove',
//     describe: 'Remove a task',
//     builder: {
//         id: {
//             describe: 'Task ID to remove',
//             demandOption: true,
//             type: 'number'
//         }
//     },
//     handler(argv) {
//         const tasks = readTasks();
//         const updatedTasks = tasks.filter((task) => task.id !== argv.id);
//         if (updatedTasks.length === tasks.length) {
//             console.log('Task not found!');
//             return;
//         }
//         saveTasks(updatedTasks);
//         console.log(`Task ${argv.id} removed successfully!`);
//     }
// });


// yargs().parse();
