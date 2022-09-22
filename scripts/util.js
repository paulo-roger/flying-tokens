export async function chatMessage(messageContent) {
    if (messageContent !== '') {
        let chatData = {
            user: game.user._id,
            speaker: {alias: 'Flying Tokens: ' },
            content: messageContent,
            whisper: ChatMessage.getWhisperRecipients("GM"),
        };
        await ChatMessage.create(chatData, {});
    }
}