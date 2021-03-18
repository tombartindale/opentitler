import firebase from 'firebase/app'
import "firebase/auth";
import 'firebase/database';
import 'firebase/functions';

let zoomsenseapp;
let db, auth, functions, decryptToken, data;
let zoomsense = {};
let zoomloading = true;

import Vue from 'vue';
// import { rtdbPlugin } from 'vuefire';
// Vue.use(rtdbPlugin);

function setup(options) {
    zoomsenseapp = firebase.initializeApp(options, "zoomsense");
    db = zoomsenseapp.database(),
    auth = zoomsenseapp.auth(),
    functions = zoomsenseapp.functions()
    decryptToken = functions.httpsCallable("decryptToken");
    data = db.ref('data');
}

let zoomsenseapi = {
    setToken(token) {
        if (!token) {
            console.log("Missing Token...");
            return;
        }

        let curMeetingid;
        let curHostuid;
        auth
        .signInAnonymously()
        .then(async (loginData) => {
            this.user = loginData.user;

            // Read result of the decryptToken Function
            const result = await decryptToken({ token: token });
            const { meetingid, hostuid } = result.data;
            curMeetingid = meetingid;
            curHostuid = hostuid;
            const anonymousSession = {
                hostuid: curHostuid,
                meetingid: curMeetingid,
            };
            this.meetinginfo = anonymousSession;
            return loginData.user.getIdToken();
        })
        .then(async () => {
            await db
                .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
                .set({ createdAt: new Date().getTime() });
            await db
                .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
                .set({ createdAt: new Date().getTime() });

            await Vue.prototype.$rtdbBind('zoomsense', data.child('chats').child(this.meetinginfo.meetingid).child('ZoomSensor_1'));
            zoomloading = false;
        })
        .catch((error) => {
            console.log("Error " + error.code + ": " + error.message);
            //   return this.$router.push("/");
        });
    },
    database: db,
    auth: auth,
    functions: functions
}

export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        setup(options);
        Vue.prototype.$zoomsense = zoomsenseapi;
        Vue.mixin({
            data(){
                return {
                    meetinginfo:Object,
                    zoomsense:zoomsense,
                    zoomloading: zoomloading
                }
            }
        })
    }
}


//  