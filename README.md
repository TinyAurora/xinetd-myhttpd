# xinetd-myhttpd

### 项目描述
通过实战编写了一个简单的处理http请求的服务程序，并结合linux下的超级服务器xinetd，使其成为一个简单完整的服务器软件程序，并最终部署在阿里云服务器上，来进一步学习和了解完成一个http服务器的大致流程。

### 项目目录
├── index.html&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 网页主站  
├── log.txt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 日志文件  
├── myhttpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 二进制可执行文件  
├── myhttpd.c&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// c源码  
└── README.md&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 说明文档  

### 项目环境
- 操作系统：lubuntu 18.04.1  
- 编译器：gcc version 7.3.0   
- 编辑器：vim 8.0.1453   
- 阿里云服务器：ubuntu 16.04   

### xinetd配置   
1. cd /etc/xinetd.d/  
2. sudo vim myhttpd&nbsp;&nbsp;&nbsp;&nbsp;//  注意加上sudo以及保证myhttpd和所生成的可执行程序名字一样  
3. 添加如下内容：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 注意修改相应的路径参数  
```
service myhttpd
{
        disable         = no
        server_args     = /home/xiao/myhttpd/ I
        server          = /home/xiao/myhttpd/myhttpd
        socket_type     = stream
        protocol        = tcp
        user            = xiao
        wait            = no
        flags           = IPv4
}

```
4. sudo vim /etc/services，添加以下内容：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 端口号和源码一致  
```
myhttpd         12345/tcp
myhttpd         12345/udp
```
5. sudo service xinetd restart   
6. ./myhttpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 如果端口号小于1024，则为系统保留端口，改为sudo ./myhttpd  




