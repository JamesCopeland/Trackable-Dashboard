/* globals Chart:false, feather:false */
const baseURL = "https://trackableapi.azurewebsites.net";
var newTaskForm = document.getElementById("newTaskForm")
var updateTaskForm = document.getElementById("updateTaskForm")
var taskObject = {}

function buildTable(data) {
  var table = document.getElementById("task-table-body")
  data.forEach((element, i) => {
    var row = table.insertRow(i)

    buildCell(0, row, element.taskId)
    buildCell(1, row, element.name)
    buildCell(2, row, element.message)
    buildCell(3, row, element.status)
    buildCell(4, row, element.type)
    buildCell(5, row, `<button type="button" class="btn btn-secondary edit-btn" onclick="openUpdateModal(this, ${element.taskId}, ${i})">Edit</button>`, true)
    buildCell(6, row, `<button type="button" class="btn btn-danger delete-btn" onclick="deleteTask(this, ${element.taskId})">Delete</button>`, true)

  });
}

function buildCell(i, row, text, isBtnCell) {
  var cell = row.insertCell(i)
  cell.innerHTML = text

  if(isBtnCell) {
    cell.classList.add('btn-cell')
  }
}

newTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var name = document.getElementById("task-name").value
  var message = document.getElementById("message-text").value
  var status = document.getElementById("task-status").value
  var type = document.getElementById("task-type").value

  createTask({
    "Name": name,
    "Message": message,
    "Status": status,
    "Type": type,
    "Trace": ""
  })
})

updateTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var name = document.getElementById("update-task-name").value
  var message = document.getElementById("update-message-text").value
  var status = document.getElementById("update-task-status").value
  var type = document.getElementById("update-task-type").value
  var id = document.getElementById("update-task-id").value

  updateTask(id, {
    "TaskId": id,
    "Name": name,
    "Message": message,
    "Status": status,
    "Type": type,
    "Trace": ""
  })
})

function openUpdateModal(element, id, rowNum) {

  var name = taskObject[rowNum].name
  var message = taskObject[rowNum].message
  var status = taskObject[rowNum].status
  var type = taskObject[rowNum].type

  document.getElementById("update-task-name").value = name;
  document.getElementById("update-message-text").value = message;
  document.getElementById("update-task-status").value = status;
  document.getElementById("update-task-type").value = type;
  document.getElementById("update-task-id").value = id;

  $('#updateTaskModal').modal('show')

}

function createTask(newTask) {

  const endpoint = "/Tasks"

  const headers = new Headers();
  headers.append("Content-Type", "application/json")
  headers.append("Access-Control-Allow-Origin", "*")

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(newTask)
  }
  
  return (passTokenToApi(endpoint, options, headers)
  .then(postResponse => {
    getTasks().then(function(data) {
      clearTable()
      buildTable(data)
      $("#createTaskModal").modal('hide')
      newTaskForm.reset()
    })
  }))

}

function updateTask(id, updatedTask) {

  const endpoint = `/Tasks/${id}`

  const headers = new Headers();
  headers.append("Content-Type", "application/json")
  headers.append("Access-Control-Allow-Origin", "*")

  const options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(updatedTask)
  }
  
  return (passTokenToApi(endpoint, options, headers)
  .then(putResponse => {
    getTasks().then(function(data) {
      clearTable()
      buildTable(data)
      $("#updateTaskModal").modal('hide')
      updateTaskForm.reset()
    })
  }))

}

function getTasks() {

  const endpoint = "/Tasks"

  const headers = new Headers();
  headers.append("Content-Type", "application/json")
  headers.append("Access-Control-Allow-Origin", "*")

  const options = {
    method: "GET",
    headers: headers
  }

  return (passTokenToApi(endpoint, options, headers)
    .then(data => {
      taskObject = data;
      return data;
    })
    .catch(error => {
      taskObject = {}
      throw error;
    })
  )
}

function clearTable() {
  var table = document.getElementById("task-table-body")
  table.innerHTML = "";
}

function deleteTask(element, id) {

  const endpoint = `/Tasks/${id}`

  const headers = new Headers();
  headers.append("Content-Type", "application/json")
  headers.append("Access-Control-Allow-Origin", "*")

  const options = {
    method: "DELETE",
    headers: headers,
  }

  var row = element.parentNode.parentNode;

  return (passTokenToApi(endpoint, options, headers)
    .then(function (response) {
      // handle success
      row.remove();
    })
  )
  
}