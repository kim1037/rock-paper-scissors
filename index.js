const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 16;

let usersList = [];
const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];

// ```
// set dataset to record history of fight,
// {
//   'fights': 134
//   'win':104,
//   'lose':20,
//   'draw':10,
//   'oppnent_record' : [
//     {
//       'id' : 1,
//       'fights':,
//       'win' : 2,
//       'lose' : 5
//       'draw' : 0 
//     },
//         {
//       'id' : 2,
//       'fights':7,
//       'win' : 2,
//       'lose' : 5
//       'draw' : 0 
//     },....
    
//   ]
// }

// ```;

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderSelect = document.querySelector("#gender-select");
const paginator = document.querySelector("#paginator");

function renderUserList(users) {
  let rawHTML = "";
  for (let user of users) {
    rawHTML += `<div class="card mb-2" style="width: 12rem">
          <img src="${user.avatar}" class="card-img-top player-avatar" 
            data-bs-toggle="modal" 
            data-bs-target="#user-modal"
            data-id="${user.id}"
            alt="avatar"  
            style="width:150px; height:150px;" />
          <h6 class="pt-2 text-center">${user.name}</h6>
        </div>`;
  }

  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const userModalTItle = document.querySelector("#user-modal-title");
  const userModalImage = document.querySelector("#user-modal-image");
  const userModalInfo = document.querySelector("#user-modal-info");
  const userData = usersList.find((user) => user.id === id);

  userModalImage.innerHTML = `<img src="${userData.avatar}" alt="avatar" style="width:200px; height:200px;">`;
  userModalTItle.innerText = `${userData.name} ${userData.surname}`;
  userModalInfo.innerHTML = `
            <p>Gender : ${userData.gender}</p>
            <p>Age : ${userData.age}</p>
            <p>Birthday : ${userData.birthday}</p>
            <p>Region : ${userData.region}</p>
            <p>Email : ${userData.email}</p>
  `;
}

function getUsersByPage(page) {
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return usersList.slice(startIndex, startIndex + USERS_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let rawHTML = ``;
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);
  renderUserList(getUsersByPage(page));
});

dataPanel.addEventListener("click", function onAvatarClciked(event) {
  if (event.target.matches(".player-avatar")) {
    showUserModal(Number(event.target.dataset.id));
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    usersList.push(...response.data.results);
    renderUserList(getUsersByPage(1));
    renderPaginator(usersList.length);
  })
  .catch((error) => {
    console.log(error);
  });
