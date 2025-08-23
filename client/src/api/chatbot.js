import apiClient from "./apiClient";

const chatBot = {
  chat: async (inputMessage, messages) => {
    const context = messages.map((msg) => msg.text);

    const response = await apiClient.post("/chats", {
      messages: inputMessage,
      context: context,
    });
    return response.data;
  },
};

export default chatBot;
