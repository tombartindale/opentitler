import firebase from 'firebase/app'
import "firebase/auth";
import 'firebase/database';
import 'firebase/functions';

let zoomsenseapp;
let db, auth, functions, decryptToken, data, meetings;
// let globalvue = null;
// let zoomsense = {};
// let zoomloading = true;

// import Vue from 'vue';
// import { rtdbPlugin } from 'vuefire';
// Vue.use(rtdbPlugin);

function setup(options) {
    zoomsenseapp = firebase.initializeApp(options, "zoomsense");
    db = zoomsenseapp.database(),
        auth = zoomsenseapp.auth(),
        functions = zoomsenseapp.functions()
    decryptToken = functions.httpsCallable("decryptToken");
    data = db.ref('data');
    meetings = db.ref('meetings');
}

// let zoomsenseapi = {
//     setToken: function(token,binding) {
//         if (!token) {
//             console.log("Missing Token...");
//             return;
//         }

//         // console.log(this);

//         // globalvue.prototype.$emit('zoomsense:loading',true);
//         let curMeetingid;
//         let curHostuid;
//         auth
//         .signInAnonymously()
//         .then(async (loginData) => {
//             this.user = loginData.user;

//             // Read result of the decryptToken Function
//             const result = await decryptToken({ token: token });
//             const { meetingid, hostuid } = result.data;
//             curMeetingid = meetingid;
//             curHostuid = hostuid;
//             const anonymousSession = {
//                 hostuid: curHostuid,
//                 meetingid: curMeetingid,
//             };
//             meetinginfo = anonymousSession;
//             return loginData.user.getIdToken();
//         })
//         .then(async () => {
//             await db
//                 .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
//                 .set({ createdAt: new Date().getTime() });
//             await db
//                 .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
//                 .set({ createdAt: new Date().getTime() });

//             // zoomloading = false;

//             await globalvue.prototype.$rtdbBind(binding, data.child('chats').child(meetinginfo.meetingid).child('ZoomSensor_1'));
//             // globalvue.prototype.$emit('zoomsense:loading',false);
//         })
//         .catch((error) => {
//             console.log("Error " + error.code + ": " + error.message);
//             //   return this.$router.push("/");
//         });
//     }
//     // database: db,
//     // auth: auth,
//     // functions: functions
// }

export default {
    // called by Vue.use(FirstPlugin)
    install(Vue, options) {
        setup(options);
        // globalvue = Vue;
        // Vue.prototype.$zoomsense = zoomsenseapi;
        // Vue.mixin({
        //     data(){
        //         return {
        //             meetinginfo:Object,
        //             zoomsense:zoomsense,
        //             zoomloading: zoomloading
        //         }
        //     }
        // })

        Vue.component('ZoomSenseData', {
            render: function (createElement) {
                return createElement('span');
            },
            name: 'ZoomSenseData',
            props: ['token'],
            data: () => ({
                meetinginfo: {}
            }),
            watch: {
                token: {
                    immediate: true,
                    handler: async function () {
                        // console.log('handler');
                        // console.log(this.handler);

                        if (!this.token) {
                            // console.log("Missing Token...");
                            return;
                        }
                        
                        this.$emit('zoomsense:loading', true);
                        let curMeetingid;
                        let curHostuid;
                        let loginData = {};
                        try {
                            loginData = await auth.signInAnonymously();
                        }
                        catch (e) {
                            this.$emit('zoomsense:error', e);
                            return;
                        }

                        try {
                            await (async (loginData) => {
                                // .then(async (loginData) => {
                                this.user = loginData.user;

                                let parsedtoken = this.token;

                                if (parsedtoken.startsWith('https://'))
                                    parsedtoken = parsedtoken.split('?token=')[1];

                                // console.log('token',parsedtoken);

                                // Read result of the decryptToken Function
                                const result = await decryptToken({ token: parsedtoken });
                                const { meetingid, hostuid } = result.data;
                                curMeetingid = meetingid;
                                curHostuid = hostuid;
                                const anonymousSession = {
                                    hostuid: curHostuid,
                                    meetingid: curMeetingid,
                                };
                                this.meetinginfo = anonymousSession;
                                // console.log(this.meetinginfo);
                                return loginData.user.getIdToken();
                            })(loginData);
                        }
                        catch (e) {
                            this.$emit('zoomsense:tokenerror', e);
                            return;
                        }

                        try {
                            await (async () => {
                                // .then(async () => {
                                await db
                                    .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
                                    .set({ createdAt: new Date().getTime() });
                                await db
                                    .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
                                    .set({ createdAt: new Date().getTime() });

                                // zoomloading = false;
                                // await this.$rtdbBind('zoomdata', data.child('chats').child(this.meetinginfo.meetingid).child('ZoomSensor_1'));
                                let meeting = await new Promise((resolve) => {
                                    meetings.child(this.meetinginfo.hostuid).child(this.meetinginfo.meetingid).once('value', snapshot => {
                                        resolve(snapshot.val());
                                    });
                                });
                                // console.log(meeting);
                                this.$emit('zoomsense:loaded', {
                                    fbpath: data.child('chats').child(this.meetinginfo.meetingid).child('ZoomSensor_1'),
                                    meeting: meeting
                                });
                                this.$emit('zoomsense:loading', false);
                            })();
                        }
                        catch (e) {
                            this.$emit('zoomsense:error', e);
                        }

                        // .catch((error) => {
                        //     console.log("Error " + error.code + ": " + error.message);
                        //     this.$emit('zoomsense:error',error);
                        //     //   return this.$router.push("/");
                        // });
                    }
                }
            }
        });
    }
}


//  