import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Button,
  Divider,
  Flex,
  Grid,
  StepperField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import { Message } from "./model";
import { getAxiosInstance } from "./axios";
import { handleError } from "./utils";
import { getCurrentUser } from "aws-amplify/auth";

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
  const [detail, setDetail] = useState("");
  const [dos, setDos] = useState(700);

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(async () => {
        const axiosInstance = await getAxiosInstance();
        axiosInstance
          .get("/messages")
          .then((response) => {
            setMessages(response.data);
          })
          .catch((error: any) => {
            alert(JSON.stringify(error));
          });
      })
      .catch(() => {
        // サインインしていない場合など
      })
      .finally(() => {
        setTimeout(() => {
          setTrigger(!trigger);
        }, 1000);
      });
  }, [trigger]);

  return (
    <Authenticator loginMechanisms={["username", "email"]}>
      {({ signOut, user }) => (
        <>
          {user && (
            <main>
              <Grid templateColumns="1fr 3fr 1fr">
                <View></View>
                <View>
                  <Flex direction="column" gap={2} alignItems="center">
                    <Flex
                      direction="row"
                      justifyContent="flex-end"
                      width="100%"
                    >
                      <Button
                        onClick={signOut}
                        colorTheme="overlay"
                        variation="primary"
                      >
                        Sign out
                      </Button>
                    </Flex>
                    <br />
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>content</TableCell>
                          <TableCell>詳細ボタン</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell>{message.id}</TableCell>
                            <TableCell>{message.content}</TableCell>
                            <TableCell>
                              <Button
                                onClick={async () => {
                                  const axiosInstance =
                                    await getAxiosInstance();
                                  axiosInstance
                                    .get("/messages", {
                                      params: { id: message.id },
                                    })
                                    .then((response) => {
                                      setDetail(
                                        JSON.stringify(response.data[0])
                                      );
                                      setContent("");
                                    })
                                    .catch((error: any) => {
                                      handleError(error);
                                    });
                                }}
                                variation="primary"
                              >
                                詳細
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {messages.length > 0 && (
                      <>
                        詳細表示:{" "}
                        {detail ||
                          "一覧に表示されたメッセージの「詳細」ボタンを押してください"}
                      </>
                    )}
                    <br />
                    <Divider />
                    <br />
                    <TextField
                      label="新しいメッセージ"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      width="80%"
                    />
                    <Button
                      onClick={async () => {
                        const axiosInstance = await getAxiosInstance();
                        axiosInstance
                          .post("/messages", { content })
                          .then(() => {
                            alert("送信完了しました");
                            setContent("");
                          })
                          .catch((error: any) => {
                            handleError(error);
                          });
                      }}
                      variation="primary"
                      colorTheme="success"
                    >
                      送信
                    </Button>
                    <br />
                    <Divider />
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
                        if (
                          window.confirm(
                            "同時アクセスを実行します。よろしいですか?"
                          )
                        ) {
                          const axiosInstance = await getAxiosInstance();
                          for (let index = 0; index < dos; index++) {
                            axiosInstance.get("/messages");
                          }
                        }
                      }}
                      variation="primary"
                    >
                      同時アクセス実行
                    </Button>
                  </Flex>
                </View>
                <View></View>
              </Grid>
            </main>
          )}
        </>
      )}
    </Authenticator>
  );
};

export default App;
