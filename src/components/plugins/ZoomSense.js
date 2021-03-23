import firebase from 'firebase/app'
import "firebase/auth";
import 'firebase/database';
import 'firebase/functions';

let zoomsenseapp, db, auth, functions, decryptToken, data, meetings,meeting;

function setup(options) {
    zoomsenseapp = firebase.initializeApp(options, "zoomsense");
    db = zoomsenseapp.database(),
        auth = zoomsenseapp.auth(),
        functions = zoomsenseapp.functions()
    decryptToken = functions.httpsCallable("decryptToken");
    data = db.ref('data');
    meetings = db.ref('meetings');
}

export default {
    install(Vue, options) {
        setup(options);

        Vue.component('ZoomSenseData', {
            render: function (createElement) {
                return createElement('span');
            },
            name: 'ZoomSenseData',
            props: ['token'],
            data: () => ({
                meetinginfo: null
            }),
            watch: {
                token: {
                    immediate: true,
                    handler: async function () {

                        if (!this.token) {
                            // console.log("Missing Token...");
                            return;
                        }

                        this.$emit('zoomsense:loading', true);
                        let curMeetingid;
                        let curHostuid;
                        let loginData = {};

                        // if (!auth.currentUser) {

                        try {
                            loginData = await auth.signInAnonymously();
                        }
                        catch (e) {
                            this.$emit('zoomsense:error', e);
                            return;
                        }
                        // }

                        this.user = loginData.user;

                        if (!this.meetinginfo)
                        {
                            try {
                                await (async (loginData) => {
                                    // .then(async (loginData) => {
                                    

                                    let parsedtoken = this.token;

                                    if (parsedtoken.startsWith('https://'))
                                        parsedtoken = parsedtoken.split('?token=')[1];

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
                        
                    
                        // console.log(this.meetinginfo);

                    // if (!auth.currentUser) {

                        try {
                            await (async () => {
                                // .then(async () => {
                                await db
                                    .ref(`/anonymous/users/${this.user.uid}/hosts/${curHostuid}`)
                                    .set({ createdAt: new Date().getTime() });
                                await db
                                    .ref(`/anonymous/users/${this.user.uid}/meetings/${curMeetingid}`)
                                    .set({ createdAt: new Date().getTime() });

                                meeting = await new Promise((resolve) => {
                                    meetings.child(this.meetinginfo.hostuid).child(this.meetinginfo.meetingid).once('value', snapshot => {
                                        resolve(snapshot.val());
                                    });
                                });
                            })();
                        }
                        catch (e) {
                            this.$emit('zoomsense:error', e);
                            return;
                        }
                    }

                        try {
                            this.$emit('zoomsense:loaded', {
                                data: data,
                                // activepath: data.child('activeSpeakers').child(this.meetinginfo.meetingid).child('ZoomSensor_1/current/activeHistory').limitToLast(10),
                                meeting: Object.assign(meeting,this.meetinginfo)
                            });
                            this.$emit('zoomsense:loading', false);
                        }
                        catch (e) {
                            this.$emit('zoomsense:error', e);
                            return;
                        }
                    }
                }
            }
        });
    }
}


//  