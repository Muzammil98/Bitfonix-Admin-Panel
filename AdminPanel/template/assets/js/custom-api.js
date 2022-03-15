const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = "http://localhost:5000/api"

$("#logoutBtn").click(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
});

$("#loginBtn").click((e) => loginFunction(e));

const loginFunction = (e) => {
  e.preventDefault();

  const email = $("#exampleInputEmail1").val();
  const password = $("#exampleInputPassword1").val();
  console.log(email, password);

  $.post(
    `${BASE_URL}/admin/login`,
    {
      email,
      password,
    },
    (data, status) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.replace("index.html");
    }
  );
};

const user = JSON.parse(localStorage.getItem("user"));

$(".admin-name").text(user.firstname + " " + user.lastname);
$(".admin-email").text(user.email);

const getTransactionsData = () => {};

const deleteUser = (id) => {
  console.log("DEDEDE", id);
};
const getUsersList = (e) => {
  e?.preventDefault();

  const token = localStorage.getItem("token");

  $.ajax({
    url: `${BASE_URL}/users`,
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const htmlData = data.map(
      (item) => `<tr>
        <td>${item.firstname}</td>
        <td>${item.lastname}</td>
        <td>${item.email}</td>
        <td>${item.country}</td>
        <td>${item.phoneNumber}</td>
        <td>${
          item.status === 1
            ? "active"
            : item.status === 2
            ? "blocked"
            : "deleted"
        }</td>
        <td>${item.createdAt}</td>
        <td>
          <a href="update_user.html">
          Edit
            <i data-feather="edit"></i>
          </a>
        </td>
        <td>
          <a class="delete-user" onclick="deleteUser(${item.id})" href="#">
          Delete
            <i data-feather="delete"></i>
          </a>
        </td>
      </tr>`
    );

    $("#dataTableExample tbody").html(htmlData);
  });
};

if (window.location.pathname.includes("users.html")) getUsersList();

$(".delete-user").click(() => deleteUser());
