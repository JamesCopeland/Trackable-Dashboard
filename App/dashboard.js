/* globals Chart:false, feather:false */
const baseURL = "https://trackableapi.azurewebsites.net";

function buildTable(data) {
  var table = document.getElementById("task-table-body")
  data.forEach((element, i) => {
    var row = table.insertRow(i)

    buildCell(0, row, element.taskId)
    buildCell(1, row, element.name)
    buildCell(2, row, element.message)
    buildCell(3, row, element.status)
    buildCell(4, row, element.type)
    buildCell(5, row, `<button type="button" class="btn btn-danger delete-btn" onclick="deleteTask(this, ${element.taskId})">Delete</button>`)

  });
}

function buildCell(i, row, text) {
  var cell = row.insertCell(i)
  cell.innerHTML = text
}

var newTaskForm = document.getElementById("newTaskForm")

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

function getTasks() {

  const endpoint = "/Tasks"

  const headers = new Headers();
  headers.append("Content-Type", "application/json")
  headers.append("Access-Control-Allow-Origin", "*")

  const options = {
    method: "GET",
    headers: headers
  }

  return passTokenToApi(endpoint, options, headers)

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