export default class MessageService {
    constructor(messages) {
        this.messages = [];
    }

    setMessages(messages) {
        this.messages = messages;
    }

    fetchMessages(search, start, end, sentBy, likedBy, attachments, sort, index, size) {
        var messages = this.sortMessages(this.filterMessages(search, start, end, sentBy, likedBy, attachments), sort);
        var unpagedLength = messages.length;
        return {
            unpagedLength: unpagedLength,
            messages: this.paginateMessages(messages, index, size)
        }
    }

    filterMessages(search, start, end, sentBy, likedBy, attachments) {
        return this.messages.filter((message) => {
            return (
                (search === "" || (message.text != null && message.text.toUpperCase().includes(search.toUpperCase())))
                &&
                (start === "" ||start <= new Date(message.created_at * 1000))
                &&
                (end === "" || end >= new Date(message.created_at * 1000))
                &&
                (sentBy.length === 0 || sentBy.indexOf(message.user_id) !== -1)
                &&
                (likedBy.length === 0 || message.favorited_by.some(user => likedBy.includes(user)))
                &&
                (attachments.length === 0 || message.attachments.some(attachment => attachments.includes(attachment.type)))
            );
        });
    }

    sortMessages(messages, sort) {
        switch(sort) {
            case "most_recent":
                return messages.sort((a, b) => b.created_at - a.created_at);
            case "least_recent":
                return messages.sort((a, b) => a.created_at - b.created_at);
            case "nickname_az":
                return messages.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
            case "nickname_za":
                return messages.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 0);
            case "most_liked":
                return messages.sort((a, b) => b.favorited_by.length - a.favorited_by.length);
            case "least_liked":
                return messages.sort((a, b) => a.favorited_by.length - b.favorited_by.length);
            default:
                return messages;
        }
    }

    paginateMessages(messages, index, size) {
        return messages.splice(index * size, size);
    }
}