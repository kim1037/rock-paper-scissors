const currentOppnent = JSON.parse(localStorage.getItem("currentOppnent"));

const oppnentInfo = document.querySelector("#oppnent-info");
const actionArea = document.querySelector("#action-area");

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

renderOppnentData(currentOppnent);

//判斷猜拳勝負
function battle(action) {
  // 0 = rock, 1 = paper, 2=scissors
  //對手隨機出拳
  const oppnentAction = Math.floor(Math.random() * 3);
  console.log(action, oppnentAction);

  if (action === oppnentAction) {
    console.log("平手!");
  } else if (
    (action === 0 && oppnentAction === 2) ||
    (action === 1 && oppnentAction === 0) ||
    (action === 2 && oppnentAction === 1)
  ) {
    console.log("你贏了!");
  } else if (
    (action === 2 && oppnentAction === 0) ||
    (action === 0 && oppnentAction === 1) ||
    (action === 1 && oppnentAction === 2)
  ) {
    console.log("你輸了!");
  }
}

actionArea.addEventListener("click", function onGestureClicked(event) {
  if (event.target.matches(".gesture-pic")) {
    battle(Number(event.target.dataset.action));
  }
});
