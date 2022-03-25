const BASE_URL = "https://bitfonix-server.herokuapp.com/api";
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
  const token = localStorage.getItem("token");
  $.ajax({
    url: `${BASE_URL}/user/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    window.location.replace("users.html");
  });
};

$("#deleteUserBtn").click(() => {
  const id = window.location.search.split("=")[1];
  deleteUser(id);
});

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
          <a href="update_user.html?id=${item.id}">
          Edit
            <i data-feather="edit"></i>
          </a>
        </td>
       
      </tr>`
    );
    //   <td>
    //   <a class="delete-user" onclick="deleteUser(${item.id})" href="#">
    //   Delete
    //     <i data-feather="delete"></i>
    //   </a>
    // </td>
    $("#dataTableExample tbody").html(htmlData);
  });
};

if (window.location.pathname.includes("users.html")) getUsersList();

const getUserDetails = () => {
  const id = window.location.search.split("=")[1];
  const token = localStorage.getItem("token");

  $.ajax({
    url: `${BASE_URL}/user/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    $("#exampleInputFirstname1").val(response.firstname);
    $("#exampleInputLastname1").val(response.lastname);
    $("#exampleInputEmail1").val(response.email);
  });

  $.ajax({
    url: `${BASE_URL}/wallet/user/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    const walletId = response.id || response._id;
    localStorage.setItem("walletId", walletId);
    $("#exampleInputBuyingPower1").val(response.buying);
    $("#exampleInputEquity1").val(response.equity);
  });

  $.ajax({
    url: `${BASE_URL}/txs/user/${id}`,
    headers: { Authorization: `Bearer ${token}` },
  }).then((data) => {
    const htmlData = data.map(
      (item) => `<tr>
			<td>${item.asset}</td>
			<td>${item.price}</td>
			<td>${item.quantity}</td>
			<td>${item?.order?.orderType}</td>
			<td>${item?.order?.exitOrder?.priceFeed || "-"}</td>
			<td>${item?.order?.orderCompleted === true ? item.totalPrice : "-"}</td>
      <td>${
        item?.order?.orderCompleted === true
          ? "Order complete"
          : "Order not complete"
      }</td>
      <td>${item?.createdAt}</td>
        </tr>`
    );
    console.log("HTML DATA", htmlData);
    // const htmlData = data.map(
    //   (item) => `<tr>
    //     <td>${item.firstname}</td>
    //     <td>${item.lastname}</td>
    //     <td>${item.email}</td>
    //     <td>${item.country}</td>
    //     <td>${item.phoneNumber}</td>
    //     <td>${
    //       item.status === 1
    //         ? "active"
    //         : item.status === 2
    //         ? "blocked"
    //         : "deleted"
    //     }</td>
    //     <td>${item.createdAt}</td>
    //     <td>
    //       <a href="update_user.html?id=${item.id}">
    //       Edit
    //         <i data-feather="edit"></i>
    //       </a>
    //     </td>

    //   </tr>`
    // );

    // $("#myTable3-body").append(`<tr>
    // <td>${tx.asset}</td>
    // <td>${tx.order.id}</td>
    // <td>${tx.quantity}</td>
    // <td>${tx.order?.enterOrder?.priceFeed || "-"}</td>
    // <td>${tx.order?.exitOrder?.priceFeed || "-"}</td>
    // <td>${
    //   tx.order.orderCompleted === true
    //     ? "Order complete"
    //     : "Order not complete"
    // }</td>
    //   </tr>`);

    $("#userOrdersTable tbody").html(htmlData);
  });
};

if (window.location.pathname.includes("update_user.html")) getUserDetails();

$(".delete-user").click(() => deleteUser());

const updateUserFunction = (e) => {
  e?.preventDefault();
  const id = window.location.search.split("=")[1];
  const token = localStorage.getItem("token");

  const firstname = $("#exampleInputFirstname1").val();
  const lastname = $("#exampleInputLastname1").val();

  const payload = {
    firstname,
    lastname,
  };

  $.ajax({
    url: `${BASE_URL}/user/${id}`,
    method: "PUT",
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log("UPDATE WALLET");
    window.location.reload();
  });
};

$("#updateUserBtn").click(() => updateUserFunction());

const updateUserWallet = (e) => {
  e?.preventDefault();

  const walletId = localStorage.getItem("walletId");
  const token = localStorage.getItem("token");

  const buying = $("#exampleInputBuyingPower1").val();
  const equity = $("#exampleInputEquity1").val();

  // equity, profit, loss
  const payload = { buying, equity };

  console.log("PAYLOAD", payload);
  $.ajax({
    url: `${BASE_URL}/wallet/${walletId}`,
    method: "PUT",
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log("UPDATE WALLET", response);
    window.location.reload();
  });
};

$("#updateUserWalletBtn").click(() => updateUserWallet());
