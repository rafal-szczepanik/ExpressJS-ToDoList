const inputValue = document.querySelector('.add-text');
const taskConfirmForm = document.querySelector('.form');
const listContainer = document.querySelector('.list');
const listItem = document.querySelector('.list-item');
const taskConfirmBtn = document.querySelector(".task-btn");
const editTaskWindow = document.querySelector('.task-edit-wrapper');
const form = document.querySelector('.task-edit-container form');
const textArea = document.querySelector('textarea');
const tasksNumber = document.querySelector(".tasks-number");
const tasksToDoNumber = document.querySelector(".tasks-todo-number");

let currenID = "";


const fetchedAllElements = async () => {
  const response = await fetch('/task');
  return await response.json();
};
const fetchedElement = async (id) => {
  const response = await fetch(`task/${id}`);
  const {isDone, task} = await response.json();
  return {
    isDone,
    task
  };
};

const disableHandler = ({target}) => {
  taskConfirmBtn.disabled = !target.value.length;
};

const confirmTask = async e => {
  e.preventDefault();
  const taskData = inputValue.value;
  await fetch('/task', {
    method: 'POST',
    body: JSON.stringify({
      taskData,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  inputValue.value = "";
  taskConfirmBtn.disabled = true;

  createElements();
  showTasksNumber();
  showToDoTasksNumber();
};

const handleTaskDisplay = (isDone, liElement, textElement, checkBtn) => {

  if (isDone) {
    liElement.classList.add('darker');
    textElement.classList.add('done');
    checkBtn.innerText = "To Do";
  } else {
    liElement.classList.remove('darker');
    textElement.classList.remove('done');
  }
};

const createElements = async () => {

  const data = await fetchedAllElements();
  listContainer.innerText = '';

  data.forEach(({task, isDone, id}) => {
    const clonedItem = listItem.cloneNode(true);
    const textItem = clonedItem.firstChild;
    clonedItem.classList.remove('hidden');
    textItem.innerText = task;
    clonedItem.dataset.id = id;
    const [editBtn, checkedBtn, deleteBtn] = clonedItem.childNodes[1].childNodes;

    if (isDone) {
      editBtn.classList.add('hidden');
    }

    editBtn.addEventListener('click', editTaskPanel);
    checkedBtn.addEventListener('click', checkTask);
    deleteBtn.addEventListener('click', deleteTask);

    handleTaskDisplay(isDone, clonedItem, textItem, checkedBtn);
    listContainer.appendChild(clonedItem);
  });
};

const editTask = async (e) => {
  e.preventDefault();

  await fetch(`/task/${currenID}`, {
    method: 'PUT',
    body: JSON.stringify({
      task: textArea.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  editTaskWindow.classList.add('hidden');
  textArea.value = "";
  createElements();
};


const editTaskPanel = async (e) => {
  const {id} = (e.target.closest('.list-item').dataset);
  const {task} = await fetchedElement(id);
  textArea.value = task;
  editTaskWindow.classList.remove('hidden');
  currenID = id;
};

const checkTask = async ({target}) => {
  const {id} = target.closest('.list-item').dataset;
  const {isDone} = await fetchedElement(id);
  const listItem = target.closest('.list-item');
  const text = target.closest('.list-item').firstChild;
  handleTaskDisplay(isDone, listItem, text, target);

  await fetch(`task/${id}`, {
    method: 'PUT',
    body: JSON.stringify({isDone: !isDone}),
    headers: {
      'Content-Type': "application/json"
    }
  });
  showToDoTasksNumber();
  createElements();
};

const deleteTask = async ({target}) => {
  const {id} = target.closest('.list-item').dataset;
  await fetch(`task/${id}`, {
    method: "DELETE",
  });
  showTasksNumber();
  showToDoTasksNumber();
  createElements();

};


const showToDoTasksNumber = async () => {
  const data = await fetchedAllElements();
  const toDoNumber = data.filter(el => !el.isDone);
  tasksToDoNumber.innerText = `Tasks To Do: ${Number(toDoNumber.length)}`;
  console.log((toDoNumber));
};

const showTasksNumber = async () => {
  const data = await fetchedAllElements();
  tasksNumber.innerText = `All Tasks: ${Number(data.length)}`;
};

const searchTask = () => {
};
showTasksNumber();
showToDoTasksNumber();
createElements();


inputValue.addEventListener('keyup', disableHandler);
taskConfirmForm.addEventListener('submit', confirmTask);
form.addEventListener('submit', editTask);
