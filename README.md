# 后台基座

## 开发

### 拉取代码

```bash
# 连同 lib 仓库一起拉取
git clone --recursive https://github.com/sohaha/antd-main

# 或拉取当前项目之后再拉取 lib 仓库
git clone https://github.com/sohaha/antd-main
cd antd-main
git submodule update --init --recursive

# 更新 lib 仓库，直接进入 src/lib
cd src/lib
git pull
```

### 安装依赖

```
npm install
```

### 启动项目

```
npm run serve
```

## 部署

### Nginx Config
```
location / {  
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    try_files $uri $uri/ /index.html;
} 
```