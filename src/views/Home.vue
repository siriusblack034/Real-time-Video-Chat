<template>
  <main class="wrapper">
    <div class="home" v-if="status === 'home'">
      <h2>Daily Room Demo</h2>
      <p>Start demo with a new unique room or paste in your own room URL</p>
      <div class="start-call-container">
        <button @click="createAndJoinRoom">Create Room and Start</button>
        <p v-if="roomError" class="error">Room could not be created</p>
        <p class="subtext">or</p>

        <input
          type="text"
          placeholder="Enter room URL ......"
          v-model="roomURL"
          pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
          @input="validateInput"
        />
        <button @click="submitJoinRoom" :disabled="!validRoomURL">
          Join Room
        </button>
      </div>
    </div>
    <div class="call-container" :class="{ hidden: status === 'home' }">
      <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
      <div id="call" ref="callRef"></div>
      <!-- Only show the control panel if a call is live -->
      <controls
        v-if="status === 'call'"
        :roomUrl="roomUrl"
        :callFrame="callFrame"
      />
    </div>
  </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
import api from "../api.js";
import Controls from "./Controls.vue";
export default {
  name: "HelloWorld",
  components: { Controls },
  created(){
    console.log(process.env.VUE_APP_DAILY_API_KEY);
  },
  data() {
    return {
      roomURL: "",
      status: "home",
      callFrame: null,
      validRoomURL: false,
      roomError: false,
    };
  },
  methods: {
    createAndJoinRoom() {
      let loader = this.$loading.show();
      api
        .createRoom()
        .then((room) => {
          this.roomURL = room.url;
          this.joinRoom(loader);
        })
        .catch((e) => {
          console.log(e);
          this.roomError = true;
        });
    },
    async joinRoom(loader) {
      if (callFrame) {
        this.callFrame.destroy();
      }
      // Daily event callbacks
      const logEvent = (ev) => console.log(ev);
      const goToLobby = () => (this.status = "lobby");
      const goToCall = () => (this.status = "call");
      const leaveCall = () => {
        if (this.callFrame) {
          this.status = "home";
          this.callFrame.destroy();
        }
      };
      // DailyIframe container element
      const callWrapper = this.$refs.callRef;
      // Create Daily call
      /* const callFrame = DailyIframe.createFrame(callWrapper, {
        iframeStyle: IFRAME_OPTIONS,
        showLeaveButton: true,
      });  */
      const callFrame = await DailyIframe.createFrame(callWrapper, {
        iframeStyle: {
          height: "auto",
          width: "100%",
          aspectRatio: 16 / 9,
          minWidth: "400px",
          maxWidth: "920px",
          border: "1px solid var(--grey)",
          borderRadius: "4px",
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });
      this.callFrame = callFrame;
      loader.hide();
      // Add event listeners and join call
      callFrame
        .on("loaded", logEvent)
        .on("started-camera", logEvent)
        .on("camera-error", logEvent)
        .on("joining-meeting", goToLobby)
        .on("joined-meeting", goToCall)
        .on("left-meeting", leaveCall);
      await callFrame.join({ url: this.roomURL });
    },
    submitJoinRoom() {
      let loader = this.$loading.show();
      this.joinRoom(loader);
    },
    validateInput() {
      this.validRoomURL = !this.roomUrl;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.wrapper {
  background-color: var(--grey-lightest);
  height: 100%;
  display: flex;
  align-items: center;
}
.home {
  flex: 1;
}
.error {
  color: var(--red-dark);
}
.call-container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  flex: 1;
  flex-wrap: wrap;
}
.call-container.hidden {
  flex: 0;
}
#call {
  flex: 1;
  margin-top: 24px;
}
.start-call-container {
  display: flex;
  flex-direction: column;
  max-width: 200px;
  margin: auto;
}
.start-call-container .subtext {
  margin: 8px 0 0;
}
.start-call-container input {
  margin-top: 8px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--grey);
  padding: 0 16px;
}
.start-call-container button {
  color: var(--dark-blue);
  background: var(--teal);
  border: 1px solid transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
button:disabled {
  cursor: not-allowed;
  background: var(--white);
  border: 1px solid var(--grey);
}
</style>
