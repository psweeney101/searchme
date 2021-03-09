import axios from "axios";
const url = "https://api.groupme.com/v3";

const GroupMeService = {
    getCurrentUser: (access_token, cb) => {
        axios.get(`${url}/users/me?token=${access_token}`
        ).then((response) => {
            return cb(response.data.response);
        }).catch((error) => {
            console.error(error);
            return cb(null);
        });
    },
    getDirectory: (access_token, cb) => {
        GroupMeService.getGroups(access_token, (groups) => {
            GroupMeService.getDms(access_token, (dms) => {
                var directory = groups.concat(dms);
                directory.sort((a, b) => {
                    var aDate;
                    var bDate;
                    if (a.other_user) {
                        aDate = a.last_message.created_at;
                    } else {
                        aDate = Math.max(a.created_at, a.messages.last_message_created_at);
                    }
                    if (b.other_user) {
                        bDate = b.last_message.created_at;
                    } else {
                        bDate = Math.max(b.created_at, b.messages.last_message_created_at)
                    }
                    return bDate - aDate;
                });
                return cb(directory);
            });
        });
    },
    getDm: (access_token, user_id, cb) => {
        GroupMeService.getDms(access_token, (direct_messages) => {
            return cb(direct_messages.find((dm) => {
                return dm.other_user.id === user_id;
            }));
        })
    },
    getDmMessages: (access_token, user_id, total_messages, cb, loaded) => {
        var messages = [];
        let fetchBatch = (before_id) => {
            axios.get(`${url}/direct_messages?other_user_id=${user_id}&token=${access_token}&before_id=${before_id}`).then((response) => {
                messages = messages.concat(response.data.response.direct_messages);
                loaded(messages.length);
                if(messages.length === total_messages) {
                    return cb(messages);
                } else if (response.data.response.direct_messages.length === 0) {
                    alert(`GroupMe refused to return all of the messages. You will still be able to search ${messages.length} of your ${total_messages} messages. This is a GroupMe issue and it is likely that the remaining ${total_messages - messages.length} messages are not available on the GroupMe App either.`);
                    return cb(messages);
                } else {
                    fetchBatch(messages[messages.length - 1].id);
                }
            }).catch((error) => {
                console.error(error);
                fetchBatch(messages[messages.length - 1].id);
            });
        }
        fetchBatch("", 0);
    },
    getDms: (access_token, cb) => {
        axios.get(`${url}/chats?token=${access_token}&per_page=100`).then((response) => {
            response.data.response.map((dm) => {
                if(dm.other_user.avatar_url != null) {
                    dm.other_user.avatar_url = dm.other_user.avatar_url.replace(/http:/, "https:");
                }
                return dm;
            })
            return cb(response.data.response);
        }).catch((error) => {
            console.error(error);
            GroupMeService.getDms(access_token, cb);
        });
    },
    getGroup: (access_token, group_id, cb) => {
        axios.get(`${url}/groups/${group_id}?token=${access_token}`
        ).then((response) => {
            return cb(response.data.response);
        }).catch((error) => {
            console.error(error);
            GroupMeService.getGroup(access_token, group_id, cb);
        });
    },
    getGroupMessages: (access_token, group_id, total_messages, cb, loaded) => {
        var messages = [];
        let fetchBatch = (before_id) => {
            axios.get(`${url}/groups/${group_id}/messages?token=${access_token}&limit=100&before_id=${before_id}`).then((response) => {
                messages = messages.concat(response.data.response.messages);
                loaded(messages.length);
                if(messages.length === total_messages) {
                    return cb(messages);
                } else if (response.data.response.messages.length === 0) {
                    alert(`GroupMe refused to return all of the messages in this group. You will still be able to search ${messages.length} of your ${total_messages} messages. This is a GroupMe issue and it is likely that the remaining ${total_messages - messages.length} messages are not available on the GroupMe App either.`);
                    return cb(messages);
                } else {
                    fetchBatch(messages[messages.length - 1].id);
                }
            }).catch((error) => {
                console.error(error);
                fetchBatch(messages[messages.length - 1].id);
            });
        }
        fetchBatch("", 0);
    },
    getGroups: (access_token, cb) => {
        axios.get(`${url}/groups?token=${access_token}&per_page=500`).then((response) => {
            response.data.response.map((group) => {
                if (group.image_url != null) {
                    group.image_url = group.image_url.replace(/http:/, "https:");
                }
                return group;
            });
            return cb(response.data.response);
        }).catch((error) => {
            console.error(error);
            GroupMeService.getGroups(access_token, cb);
        });
    },

}

export default GroupMeService;