
let zoomsenseapi = {
    setToken(token){
        console.log("set:", token);
    }
}

export default {
    // called by Vue.use(FirstPlugin)
    install(Vue) {
        Vue.$zoomsense = zoomsenseapi;
    }
 }


//  async signInAnonymously() {
//     if (!this.token) {
//       console.log("Missing Token...");
//       return;
//     }

//       console.log('logging in')

//     let curMeetingid;
//     let curHostuid;
//     auth
//       .signInAnonymously()
//       .then(async (loginData) => {
//         this.user = loginData.user;
//       //   this.$cookies.set("user", loginData.user, "1d");

//         // Read result of the decryptToken Function
//         const result = await decryptToken({ token: this.token });
//         const { meetingid, hostuid } = result.data;
//         curMeetingid = meetingid;
//         curHostuid = hostuid;
//         const anonymousSession = {
//           hostuid: curHostuid,
//           meetingid: curMeetingid,
//         };
//         this.meetinginfo = anonymousSession;
//       //   console.log(anonymousSession);
//       //   this.$cookies.set("anonymous", anonymousSession, "1d");
//         return loginData.user.getIdToken();
//       })
//       .then(async () => {

//           // console.log(idToken);
//       //   this.$cookies.set("session", idToken, "1d");
//         await zs
//           .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
//           .set({ createdAt: new Date().getTime() });
//         await zs
//           .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
//           .set({ createdAt: new Date().getTime() });
//       //   EventBus.$emit("logged-in");

//           await this.$rtdbBind('zoomsense', zsense.child('chats').child(this.meetinginfo.meetingid).child('ZoomSensor_1'));
//           this.loading = false;

//       //   this.$router.push("/" + curMeetingid);

//       })
//       .catch((error) => {
//         console.log("Error " + error.code + ": " + error.message);
//       //   return this.$router.push("/");
//       });