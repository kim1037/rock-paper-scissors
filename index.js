const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 16;
const myName = setMyName()

let usersList = []; //存放對手資訊
const myRecords = getMyRecord();

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderSelect = document.querySelector("#gender-select");
const paginator = document.querySelector("#paginator");
const showRecords = document.querySelector("#show-my-records");
const modalBattleButton = document.querySelector("#battle-button");
const randomMatchButton = document.querySelector("#random-battle");

/////////////   function  /////////////
function setMyName() {
  const name =
    JSON.parse(localStorage.getItem("myName")) ||
    prompt("Please Enter your name:");

  localStorage.setItem("myName", JSON.stringify(name));
}

function getMyRecord() {
  // 取得個人戰績
  let records = JSON.parse(localStorage.getItem("myRecords")) || {};
  // 如果沒有紀錄，則執行下段並存入localstorge
  if (!Object.keys(records).length) { //無法直接寫records.length會回傳undefined,物件長度要用上方寫法
    records.fights= 0 
    records.win= 0,
    records.lose= 0,
    records.draw= 0,
    localStorage.setItem("myRecords", JSON.stringify(records));
  }
  records = JSON.parse(localStorage.getItem("myRecords"));
  return records
}

//顯示戰績
function showMyRecords(record) {
  let rawHTML = "";
  rawHTML = `
    <h5 class="card-title" >Your record</h5>
    <p class="card-text my-1">Total Battles : ${record.fights}</p>
    <p class="card-text my-1">Total Wins : ${record.win}</p>
    <p class="card-text my-1">Total Loses : ${record.lose}</p>
    <p class="card-text my-1">Total Draws : ${record.draw}</p>
  `;
  showRecords.innerHTML = rawHTML;
}

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

//Show Player's Modal
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

  modalBattleButton.innerHTML = `
    <button type="button" 
      class="btn btn-danger">
      <a href="battle-page.html" class="go-battle" data-id="${userData.id}" style="text-decoration:none; color: white;">Battle</a> 
    </button>`;
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

//此function只取得對手name, avatar並存入localstorage中, 以便battle頁面顯示
function getOppnentData(id) {
  //先清除原有資料，避免出錯
  localStorage.removeItem("currentOppnent");

  const oppnent = usersList.find((user) => user.id === id);
  const oppnentData = {
    id: id,
    name: `${oppnent.name} ${oppnent.surname}`,
    avatar: oppnent.avatar,
  };
  localStorage.setItem("currentOppnent", JSON.stringify(oppnentData)); //記得要把物件轉回字串才能存入localStorage
}

/////////////   監聽事件  /////////////
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

//隨機配對對手
randomMatchButton.addEventListener(
  "click",
  function onRandomMatchClicked(event) {
    const randomId = Math.floor(Math.random() * usersList.length); //0~199
    getOppnentData(randomId);
  }
);

//選擇對手後，將資訊存放localstorage，以便新頁面存取資訊
modalBattleButton.addEventListener(
  "click",
  function onBattleButtonClicked(event) {
    if (event.target.matches(".go-battle")) {
      getOppnentData(Number(event.target.dataset.id));
    }
  }
);

//顯示個人戰績
showMyRecords(myRecords);

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
