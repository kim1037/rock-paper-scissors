const currentOppnent = JSON.parse(localStorage.getItem('currentOppnent'))

console.log(currentOppnent)

const oppnentInfo = document.querySelector("#oppnent-info");

function renderOppnentData(oppnent){
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