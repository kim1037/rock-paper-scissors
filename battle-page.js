const currentOppnent = JSON.parse(localStorage.getItem("currentOppnent"));
const myRecords = JSON.parse(localStorage.getItem("myRecords"));
const myName = JSON.parse(localStorage.getItem("myName")); 

const myInfo = document.querySelector("#my-info");
const oppnentInfo = document.querySelector("#oppnent-info");
const actionArea = document.querySelector("#action-area");


//顯示我的姓名, 照片
function renderMyData(mydata){
  myInfo.innerHTML = `
   <img
      src="https://static01.nyt.com/newsgraphics/2020/11/12/fake-people/4b806cf591a8a76adfc88d19e90c8c634345bf3d/fallbacks/mobile-05.jpg"
      class="m-2 img-fluid rounded-start"
      alt="my avatar"
      style="width: 150px; height: 150px"
    />
    ${mydata}
  `;
}

//顯示對手姓名, 照片
function renderOppnentData(oppnent) {
  oppnentInfo.innerHTML = `
    <img
        src="${oppnent.avatar}"
        class="m-2 img-fluid rounded-start"
        alt="my avatar"
        style="width: 150px; height: 150px"
      />
      ${oppnent.name}
  `;
}

//判斷猜拳勝負
function battle(action) {
  // 0 = rock, 1 = paper, 2=scissors
  const actionName = ["rock", "paper", "scissors"];
  //對手隨機出拳
  const oppnentAction = Math.floor(Math.random() * 3);

  if (action === oppnentAction) {
    youDraw();
    return alert(`對手出 ${actionName[oppnentAction]}，平手!`);
  } else if (
    (action === 0 && oppnentAction === 2) ||
    (action === 1 && oppnentAction === 0) ||
    (action === 2 && oppnentAction === 1)
  ) {
    youWin();
    return alert(`對手出 ${actionName[oppnentAction]}，你贏了!`);
  } else if (
    (action === 2 && oppnentAction === 0) ||
    (action === 0 && oppnentAction === 1) ||
    (action === 1 && oppnentAction === 2)
  ) {
    youLose();
    return alert(`對手出 ${actionName[oppnentAction]}，你輸了!`);
  }
}

//勝負紀錄function
function youWin() {
  myRecords.fights += 1;
  myRecords.win += 1;
  localStorage.setItem("myRecords", JSON.stringify(myRecords));
}

function youLose() {
  myRecords.fights += 1;
  myRecords.lose += 1;
  localStorage.setItem("myRecords", JSON.stringify(myRecords));
}

function youDraw() {
  myRecords.fights += 1;
  myRecords.draw += 1;
  localStorage.setItem("myRecords", JSON.stringify(myRecords));
}

//監聽出拳事件
actionArea.addEventListener("click", function onGestureClicked(event) {
  if (event.target.matches(".gesture-pic")) {
    battle(Number(event.target.dataset.action));
  }
});

//顯示自己
renderMyData(myName);

//顯示對手
renderOppnentData(currentOppnent);
