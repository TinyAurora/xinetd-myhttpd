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
- cd /etc/xinetd.d/  
- sudo vim myhttpd&nbsp;&nbsp;&nbsp;&nbsp;//  注意加上sudo以及保证myhttpd和所生成的可执行程序名字一样  
- 添加如下内容：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 注意修改相应的路径参数  
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
- sudo vim /etc/services，添加以下内容：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 端口号和源码一致  
```
myhttpd         12345/tcp
myhttpd         12345/udp
```
- sudo service xinetd restart   
- ./myhttpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 如果端口号小于1024，则为系统保留端口，改为sudo ./myhttpd  

### 主要函数实现功能
- send_headers：发送http状态码及响应首部等信息
- send_error：访问出错时，发送错误提示网页
- strencode：将所要发送资源的名字编码以符合URL的编码规格
- file_infos：获取文件信息   
- strdecode：将所接收的URL请求解码为可读的字符串以便于找到相应的请求资源  
- get_mime_type：获取资源类型
- hexit：将URL中十六进制的数字转化为十进制数
- mylog：日志记录函数

### 代码流程 
- xinetd为守护进程，一直在监听12345端口号；  
- 当该端口号被访问时，xinetd启动myhttpd进程，并传入相应的命令参数以及重定向相关的输入输出描述符；    
- myhttpd进程被启动后，则开始对相应的http请求进行处理；   
- myhttpd首先检测日志文件、传入参数等是否正常，如正常，则开始分析http请求头，取出相应的GET方法以及所请求的资源文件路径名字；     
- 对所请求的资源进行检测，判断是否存在，若存在，检测其为文件类型还是目录类型，并分别进行处理；     
- 如果为文件，则读取相应的文件并发送；      
- 如果为目录，首先检测目录中是否含有index.html，若有，则直接跳转到读取index.html文件并发送，若无，则显示目录文件。    
