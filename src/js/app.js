const addTiket = document.querySelector('.add-tiket');
const tiketPad = document.querySelector('.tiket-pad');
const url = 'http://localhost:3031';
let cancelDescription;
let submitDescription;

addTiket.addEventListener('click', () => {
  tiketPad.insertAdjacentHTML(
    'beforeend',
    `
        <form class="create-tiket">
        <div class="correctPad">
          <h5 class="headerCreate-tiket">ДОБАВИТЬ ТИКЕТ</h5>
          <label class="descriptionlabel" for="description">
            Краткое описание</label
          >
          <input
            class="descriptionName"
            placeholder="Обзовите задачу"
            type="text"
            name="name"
            id="description"
          />
  
          <label class="fullDescriptionlabel" for="fullDescription">
            Подробное описание</label>
          <textarea
            class="fullDescriptionName"
            placeholder="Опишите текущую задачу"
            name="description"
            id="fullDescription"
          ></textarea>
        </div>
        <input class="cancelDescription" type="button" value="Отмена" />
        <input class="submitDescription" type="button" value="Ok" />
      </form>
      `,
  );
  cancelDescription = document.querySelector('.cancelDescription');
  submitDescription = document.querySelector('.submitDescription');

  cancelDescription.addEventListener('click', () => {
    document.querySelector('.create-tiket').remove();
  });

  submitDescription.addEventListener('click', (e) => {
    e.preventDefault();
    const createTiketForm = document.querySelector('.create-tiket');
    const shortDescription = document.querySelector('.descriptionName').value; // Короткое описание
    const fullDescription = document.querySelector(
      '.fullDescriptionName',
    ).value;
    document.querySelector('.create-tiket').remove();
    const date = new Date();

    const nowDate = `${date.getDate()}.${date.getMonth() + 1
      }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    const xhr = new XMLHttpRequest();
    let body = Array.from(createTiketForm.elements)
      .filter(({ name }) => name)
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('&');

    body = `${body}&created=${encodeURIComponent(nowDate)}`;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        tiketPad.insertAdjacentHTML(
          'beforeend',
          `
              <div class="tiket" data-id ="${xhr.responseText}">
          <input class="status" type="checkbox" name="status" />
          <span class="name" name="name" data-fulldescription ="${fullDescription}">${shortDescription}</span>
          <span class="created" name="created">${nowDate}</span>
          <div class="control-element">
            <img class="correct" src="https://dantealighieri.ch/wp-content/uploads/kisspng-computer-icons-editing-pencil-5ad364bf8a19f4.1303145015238033275657_2-2048x2013.png" alt="Редактирование" />
            <img class="delete" src="http://st2.depositphotos.com/4441075/7697/v/950/depositphotos_76974719-stock-illustration-waste-bin-simple-web-icon.jpg" alt="Удаление" />
          </div>
        </div>
            `,
        );
      }
    };
    xhr.open('POST', `${url}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  });
});

tiketPad.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const targetTicket = e.target.closest('.tiket');
    tiketPad.insertAdjacentHTML(
      'beforeend',
      `
                <form class="delete-tiket">
          <div class="deletePad">
            <h5 class="headerDelete-tiket">Вы точно желаете удалить тикет?</h5>
          <input class="cancelDelete" type="button" value="Отмена" />
          <input class="submitDelete" type="button" value="Ok" />
        </form>
              `,
    );
    document.querySelector('.cancelDelete').addEventListener('click', () => {
      document.querySelector('.delete-tiket').remove();
    });
    document.querySelector('.submitDelete').addEventListener('click', (el) => {
      el.preventDefault();
      const xhr = new XMLHttpRequest();
      const body = `id=${encodeURIComponent(targetTicket.dataset.id)}`;
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.readyState === 4) {
          targetTicket.remove();
          document.querySelector('.delete-tiket').remove();
        }
      };
      xhr.open('DELETE', `${url}/?${body}`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send();
    });
  } else if (e.target.classList.contains('correct')) {
    tiketPad.insertAdjacentHTML(
      'beforeend',
      `
                <form class="create-tiket">
                <div class="correctPad">
                  <h5 class="headerCreate-tiket">ИЗМЕНИТЬ ТИКЕТ</h5>
                  <label class="descriptionlabel" for="description">
                   </label
                  >
                  <input
                    class="descriptionName"
                    placeholder="Обзовите задачу"
                    type="text"
                    name="name"
                    id="description"
                  />
          
                  <label class="fullDescriptionlabel" for="fullDescription">
                    Подробное описание</label>
                  <textarea
                    class="fullDescriptionName"
                    placeholder="Опишите текущую задачу"
                    name="description"
                    id="fullDescription"
                  ></textarea>
                </div>
          
                <input class="cancelCorrectDescription" type="button" value="Отмена" />
                <input class="submitCorrectDescription" type="button" value="Ok" />
              </form>
              `,
    );
    const tiketCorrectValue = e.target.closest('.tiket');
    document.querySelector('.descriptionName').value = tiketCorrectValue.querySelector('.name').textContent;
    document.querySelector('.fullDescriptionName').value = tiketCorrectValue.querySelector('.name').dataset.fulldescription;
    const cancelCorrectDescription = document.querySelector(
      '.cancelCorrectDescription',
    );
    const submitCorrectDescription = document.querySelector(
      '.submitCorrectDescription',
    );
    cancelCorrectDescription.addEventListener('click', () => {
      document.querySelector('.create-tiket').remove();
    });
    submitCorrectDescription.addEventListener('click', () => {
      tiketCorrectValue.querySelector('.name').textContent = document.querySelector('.descriptionName').value;

      // Значение поля Полное содержание (при корректировке данных)
      tiketCorrectValue.querySelector('.name').dataset.fulldescription = document.querySelector('.fullDescriptionName').value;

      const xhr = new XMLHttpRequest();
      const body = `id=${encodeURIComponent(
        tiketCorrectValue.dataset.id,
      )}&name=${encodeURIComponent(
        document.querySelector('.descriptionName').value,
      )}&description=${encodeURIComponent(
        document.querySelector('.fullDescriptionName').value,
      )}`;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          document.querySelector('.create-tiket').remove();
        }
      };
      xhr.open('PUT', `${url}/?${body}`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send();
    });
  } else if (e.target.classList.contains('status')) {
    const checkBox = e.target.closest('.status');
    const tiketInToCheck = checkBox.closest('.tiket');
    const idTicket = tiketInToCheck.dataset.id;
    let conditionCheckBox;
    if (checkBox.checked) {
      conditionCheckBox = true;
    } else if (!checkBox.checked) {
      conditionCheckBox = false;
    }
    const xhr = new XMLHttpRequest();
    const body = `id=${encodeURIComponent(
      idTicket,
    )}&status=${encodeURIComponent(conditionCheckBox)}`;
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        console.log('error');
      }
    };
    xhr.open('PATCH', `${url}/?${body}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  } else if (
    e.target.classList.contains('tiket')
    || e.target.classList.contains('name')
  ) {
    const tiket = e.target.closest('.tiket');
    if (!tiketPad.querySelector('.fullDes')) {
      const tiketFullDescription = tiket.querySelector('.name').dataset.fulldescription;
      tiket.insertAdjacentHTML(
        'afterEnd',
        `
                <div class="fullDes">
                <span class="fullDes_content">${tiketFullDescription}</span>
              </div>
              `,
      );
    } else {
      tiketPad.querySelector('.fullDes').remove();
    }
  }
});
