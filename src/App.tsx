import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Button,
  StepperField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@aws-amplify/ui-react";
import { Message } from "./model";
import { getAxiosInstance } from "./axios";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID!,
      userPoolId: process.env.REACT_APP_USER_POOL_ID!,
    },
  },
});

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [dos, setDos] = useState(700);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          {user && (
            <main>
              <h1>Hello {user.username}</h1>
              <Button onClick={signOut}>Sign out</Button>
              <Button
                onClick={async () => {
                  const axiosInstance = await getAxiosInstance();
                  axiosInstance
                    .get("/messages")
                    .then((response) => {
                      setMessages(response.data);
                    })
                    .catch((error: any) => {
                      alert(JSON.stringify(error));
                    });
                }}
              >
                一覧取得
              </Button>
              <Table>
                <TableHead>
                  <TableRow as="th">ID</TableRow>
                  <TableRow as="th">content</TableRow>
                </TableHead>
              </Table>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.id}</TableCell>
                    <TableCell>{message.content}</TableCell>
                    <TableCell>
                      <Button
                        onClick={async () => {
                          const axiosInstance = await getAxiosInstance();
                          axiosInstance
                            .get("/messages", { params: { id: message.id } })
                            .then((response) => {
                              alert(JSON.stringify(response.data));
                            })
                            .catch((error: any) => {
                              alert(JSON.stringify(error));
                            });
                        }}
                      >
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <br />
              <TextField
                label="新しいメッセージ"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button
                onClick={async () => {
                  const axiosInstance = await getAxiosInstance();
                  axiosInstance
                    .post("/messages", { content })
                    .then(() => {
                      alert("送信完了しました。一覧取得を行なってください");
                    })
                    .catch((error: any) => {
                      alert(JSON.stringify(error));
                    });
                }}
              >
                送信
              </Button>
              <br />
              <StepperField
                label="同時アクセス数"
                min={0}
                step={1}
                value={dos}
                onChange={(e) => setDos(Number(e.target.value))}
              />
              <Button
                colorTheme="error"
                onClick={async () => {
                  const axiosInstance = await getAxiosInstance();
                  for (let index = 0; index < dos; index++) {
                    axiosInstance.get("/messages");
                  }
                }}
              >
                同時アクセス実行
              </Button>
            </main>
          )}
        </>
      )}
    </Authenticator>
  );
};

export default App;
