# Docker バージョン

念の為作成者が動作確認した際の Docker バージョンを記述いたします。

```bash
$ docker version
Client:
 Cloud integration: v1.0.35+desktop.11
 Version:           25.0.3
 API version:       1.44
 Go version:        go1.21.6
 Git commit:        4debf41
 Built:             Tue Feb  6 21:13:26 2024
 OS/Arch:           darwin/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.28.0 (139021)
 Engine:
  Version:          25.0.3
  API version:      1.44 (minimum version 1.24)
  Go version:       go1.21.6
  Git commit:       f417435
  Built:            Tue Feb  6 21:14:25 2024
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.28
  GitCommit:        ae07eda36dd25f8a1b98dfbf587313b99c0190bb
 runc:
  Version:          1.1.12
  GitCommit:        v1.1.12-0-g51d5e94
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

# 起動方法

[./app/.env](./app/.env)ファイルに環境変数を以下の通りに記述します。

- `REACT_APP_API_ROOT_URL`: REST API のエンドポイント URL
- `REACT_APP_USER_POOL_CLIENT_ID`: ユーザープールクライアント ID
- `REACT_APP_USER_POOL_ID`: ユーザープール ID

以下コマンドを実行してください

```bash
$ docker build -t demo-api-frontend:latest .
$ docker run -p {画面を表示するポート}:80 -d demo-api-frontend:latest
```
