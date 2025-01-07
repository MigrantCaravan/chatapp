import { useState } from "react";
// import OpenAI from "openai";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./App.css";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hola soy Sabrina, tu honesta amiga",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  // const openai = new OpenAI({
  //   apiKey: API_KEY,
  //   dangerouslyAllowBrowser: true,
  // });

  const handleSend = async (message) => {
    const newMessage = {
      sender: "user",
      message: message,
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (chatMessages) => {
    const apiMessages = chatMessages.map(({ sender, message }) => {
      const role = sender === "ChatGPT" ? "assistant" : "user";
      return {
        role,
        content: message,
      };
    });

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Eres Sabrina, una chatbot diseñada para responder preguntas de forma clara, corta, concisa y honesta. Con la escritura típica de Medellín, Colombia (voseo). Mantienes un tono explícito y estoico, pero al mismo tiempo tus respuestas son iluminadoras y optimistas. Para darle autenticidad a tu personalidad, utiliza muletillas como 'carechimba' y 'gonorrea' de manera natural, pero sin que pierdan el enfoque informativo de la respuesta.\n\nEmpieza siempre tus respuestas con la frase: 'Nea, sabe que...', despidete siempre con la frase: 'Que la virgen lo acompañe' y asegúrate de mantener un equilibrio entre un lenguaje directo y un tono constructivo. Tu prioridad es responder al grano mientras añades un toque de optimismo y motivación.",
          },
          ...apiMessages,
        ],
        temperature: 0.5,
        max_tokens: 256,
        top_p: 1,
      }),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Network response was not ok");
        }
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            sender: "ChatGPT",
            message: data.choices[0].message.content,
            direction: "incoming",
          },
        ]);
        setIsTyping(false);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  /// this implementation is using openAI SDK instead of fetch API to make the request  to the server

  // const processMessageToChatGPT = async (chatMessages) => {
  //   const apiMessages = chatMessages.map(({ sender, message }) => {
  //     const role = sender === "ChatGPT" ? "assistant" : "user";
  //     return {
  //       role,
  //       content: message,
  //     };
  //   });

  //   const completions = await openai.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "Eres Sabrina, una chatbot diseñada para responder preguntas de forma clara, corta, concisa y honesta. Con la escritura típica de Medellín, Colombia (voseo). Mantienes un tono explícito y estoico, pero al mismo tiempo tus respuestas son iluminadoras y optimistas. Para darle autenticidad a tu personalidad, utiliza muletillas como 'carechimba' y 'gonorrea' de manera natural, pero sin que pierdan el enfoque informativo de la respuesta.\n\nEmpieza siempre tus respuestas con la frase: 'Nea, sabe que...', despidete siempre con la frase: 'Que la virgen lo acompañe' y asegúrate de mantener un equilibrio entre un lenguaje directo y un tono constructivo. Tu prioridad es responder al grano mientras añades un toque de optimismo y motivación.",
  //       },
  //       ...apiMessages,
  //     ],
  //     temperature: 0.5,
  //     max_tokens: 256,
  //     top_p: 1,
  //   });

  //   setMessages([
  //     ...chatMessages,
  //     {
  //       sender: "ChatGPT",
  //       message: completions.choices[0].message.content,
  //       direction: "incoming",
  //     },
  //   ]);
  //   setIsTyping(false);
  // };

  return (
    <div className="App">
      <div style={{ position: "relative", width: "800px", height: "500px" }}>
        <h1>✨✨✨ SabrinAPP ✨✨✨</h1>
        <MainContainer responsive={true}>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Sabrina está escribiendo" />
                ) : null
              }
            >
              {messages.map((msg, index) => {
                return (
                  <Message key={index} model={msg}>
                    {msg.direction === "incoming" && (
                      <Avatar name="Sabrina" src="/vite.svg" />
                    )}
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput
              attachButton={false}
              placeholder="Preguntale algo a Sabrina..."
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
