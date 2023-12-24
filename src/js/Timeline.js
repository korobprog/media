export default class Timeline {
   init() {
      this.renderTimeline();
   }
   renderTimeline() {
      this.timeline = document.createElement("div");
      this.timeline.classList.add("timeline");
      this.container = document.createElement("div");
      this.container.classList.add("container");
      this.timeline.appendChild(this.container);
      this.messageForm = document.createElement("form");
      this.messageForm.classList.add("message-form");
      this.messageForm.innerHTML =
         "<input id = 'message-input' placeholder = 'Введите текст, запишите видео или аудио'>";
      this.messageForm.innerHTML +=
         "<div class = 'record-audio'> </div> <div class = 'record-video'> </div>";
      this.timeline.appendChild(this.messageForm);
      this.askPosition = document.createElement("form");
      this.askPosition.classList.add("ask-position");
      this.askPosition.innerHTML =
         "<div> К сожалению, что-то пошло не так <br> Пожалуйста, введите ваши координаты вручную <br> Широта и долгота через запятую </div> <input id = 'ask-input'> <div class = 'btn-group'> <button class = 'btn cancel-btn'> Отмена </button> <button class = 'btn ok-btn'> OK </button></div>";
      this.invalidMessage = document.createElement("div");
      this.invalidMessage.classList.add("invalid-message");
      this.invalidMessage.innerText = "Координаты невалидны";
      document.querySelector("body").appendChild(this.timeline);
      this.noAudio = document.createElement("div");
      this.noAudio.classList.add("no-audio");
      this.noAudio.innerHTML =
         "<div class = 'no-audio-text'> К сожалению, запись аудио невозможна, купите микрофон или дайте разрешение на использование звукозаписи </div> <button class = 'btn cancel-btn'> OK </button>";
      this.noAudio.querySelector(".btn").onclick = () =>
         (this.noAudio.style.display = "none");
      this.timeline.appendChild(this.noAudio);
      this.messageForm.addEventListener("submit", (evt) => {
         evt.preventDefault();
         this.publishTextMessage();
      });
      this.messageForm
         .querySelector(".record-audio")
         .addEventListener("click", () => {
            this.createAudio();
         });
      this.messageForm
         .querySelector(".record-video")
         .addEventListener("click", () => {
            this.createVideo();
         });
   }
   getPosition() {
      navigator.geolocation.getCurrentPosition((position) => (
         this.position = {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude,
         }), () => this.position = null);
   }
   createTextMessage(text, latitude, longtitude) {
      const message = document.createElement('div');
      message.classList.add('message');
      message.innerHTML = `<div class = 'message-header'> ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()} </div> <div class = 'message-text'> ${text} </div> <div class = 'position'> 📍 ${latitude}, ${longtitude} </div>`;
      this.container.appendChild(message);
      document.querySelector('#message-input').value = '';
   }
   publishTextMessage() {
      this.getPosition();
      setTimeout(() => {
         this.text = document.querySelector('#message-input').value;
         if (!this.text) {
            return;
         }
         if (this.position) {
            this.createTextMessage(this.text, this.position.latitude, this.position.longtitude);
         } else {
            this.timeline.appendChild(this.askPosition);
            this.getManualPosition();
         }
      }, 3000);
   }
   getManualPosition() {
      this.askPosition.querySelector('#ask-input').addEventListener('input', () => {
         if (document.querySelector('.invalid-message')) {
            this.invalidMessage.remove();
         }
      });
      this.askPosition.querySelector('.ok-btn').onclick = (evt) => {
         evt.preventDefault();
         const coords = this.askPosition.querySelector('#ask-input').value;
         if (this.verifyCoords(coords)) {
            this.askPosition.remove();
            this.createTextMessage(this.text, this.position.latitude, this.position.longitude);
         } else {
            this.askPosition.appendChild(this.invalidMessage);
         }
      };
      this.askPosition.querySelector('.cancel-btn').addEventListener('click', (evt) => {
         evt.preventDefault();
         this.askPosition.remove();
      });
   }
   verifyCoords(coords) {
      if (/^\[([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)\]$/.test(coords)
         || /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/.test(coords)) {
         let coordinates = coords.replace('[', '');
         coordinates = coordinates.split(',');
         // eslint-disable-next-line no-console
         this.position = {
            latitude: Number.parseFloat(coordinates[0]),
            longitude: Number.parseFloat(coordinates[1]),
         };

         return true;
      } return false;
   }
}
