#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <ctype.h>
#include <stdio.h>
#include <time.h>

#define SERVER_NAME "myhttpd"
#define PROTOCOL    "HTTP/1.1"
#define SERVER_URL  "http://www.baidu.com/"
#define FORMAT_DATE "%a, %d %b %Y %H:%M:%S GMT"
#define N 4096

static void send_headers(int status, char* title, char* extra_header, char* mime_type, off_t length, time_t mod);
static void send_error(int status, char* title, char* extra_header, char* text);
static void strencode(char* to, size_t tosize, const char* from);
static void file_infos(char* dir, char* name);
static void strdecode(char* to, char* from);
static char* get_mime_type(char* name);
static int hexit(char c);

int main(int argc, char** argv)
{
    char line[N*2], method[N*2], path[N*2], protocol[N*2], idx[N*4], location[N*4];
    char* file;
    size_t len;
    int ich, i, n;
    struct stat sb;
    FILE* fp;
    struct dirent** dl;

    FILE* fp_tmp = fopen("/home/xiao/myhttpd/log.txt", "a");
    fprintf(fp_tmp, "%d\n", argc);
    for (i = 0; i < argc; ++i) {
        fprintf(fp_tmp, "%s\n", argv[i]);
    }
    fflush(fp_tmp);
    fclose(fp_tmp);
 //   if (argc != 2) {
   //     send_error(500, "Internal Error", NULL, "Config error - no dir specified.");
   // }

    if (chdir(argv[1]) < 0) {
        send_error(500, "Internal Error", NULL, "Config error - couldn't chdir().");
    }

    if (fgets(line, sizeof(line), stdin) == NULL) {
        send_error(400, "Bad Request", NULL, "No request found.");
    }

    if (sscanf(line, "%[^ ] %[^ ] %[^ ]", method, path, protocol) != 3) {
        send_error(400, "Bad Request", NULL, "Can't parse request.");
    }

    while (fgets(line, sizeof(line), stdin) != NULL) {
        if (strcmp(line, "\n") == 0 || strcmp(line, "\r\n") == 0) {
	    break;
	}
    }

    if (strcasecmp(method, "GET") != 0) {
        send_error(501, "Not Implemented", NULL, "That method is not implemented.");
    }

    if (path[0] != '/') {
        send_error(400, "Bad Request", NULL, "Bad filename.");
    }

    file = &(path[1]);

    strdecode(file, file);

    if (file[0] == '\0') {
        file = "./";
    }

    len = strlen(file);
    
    if (stat(file, &sb) < 0) {
        send_error(404, "Not Found", (char*)0, "File not found.");
    }

    if (S_ISDIR(sb.st_mode)) {
    
        if (file[len - 1] != '/') {
	    snprintf(location, sizeof(location), "Location: %s/", path);
	    send_error(302, "Found", location, "Directories must end with a slash.");
	}

	snprintf(idx, sizeof(idx), "%sindex.html", file);
	if (stat(idx, &sb) >= 0) {
	    file = idx;
	    goto do_file;    // 如果有index.html则跳到do_file:
	}

	send_headers(200, "OK", NULL, "text/html", -1, sb.st_mtime);

	printf("<html><head><title>Index of %s</title></head>"
			"\n<body bgcolor=\"#99cc99\"><h4>Index of %s</h4>\n<pre>\n"
			, file, file);

	n = scandir(file, &dl, NULL, alphasort);

        if (n < 0) {
	    perror("scandir");
	} else {
	    for (i = 0; i < n; ++i) {
	        file_infos(file, dl[i]->d_name);
	    }
	}
	
	printf("</pre>\n<hr>\n<address><a href=\"%s\">%s</a></address>\n</body></html>\n"
			, SERVER_URL, SERVER_NAME);
    } else {
      
do_file:
        fp = fopen(file, "r");
	if (fp == (FILE*)0) {
	    send_error(403, "Forbidden", (char*)0, "File is protected.");
	}

	send_headers(200, "OK", (char*)0, get_mime_type(file), sb.st_size, sb.st_mtime);

	while ((ich = getc(fp)) != EOF) {
	    putchar(ich);
	}
    }

    fflush(stdout);
    exit(0);
}

static void file_infos(char* dir, char* name)
{
    static char encoded_name[N];
    static char path[N];
    char timestr[16];
    struct stat sb;

    strencode(encoded_name, sizeof(encoded_name), name);
    snprintf(path, sizeof(path), "%s/%s", dir, name);

    if (lstat(path, &sb) < 0) {
        printf("<a href=\"%s\">%-32.32s</a>\n", encoded_name, name);
    } else {
        strftime(timestr, sizeof(timestr), "%d%b%Y %H:%M", localtime(&sb.st_mtime));
	printf("<a href=\"%s\">%-32.32s</a>    %15s %14ld\n", encoded_name, name, timestr, (int64_t)sb.st_size);
    }
}

static void send_error(int status, char* title, char* extra_header, char* text)
{
    send_headers(status, title, extra_header, "text/html", -1, -1);
    printf("<html><head><title>%d %s</title></head>\n<body bgcolor=\"#cc9999\"><h4>%d %s</h4>\n",
		    status, title, status, title);

    printf("%s\n", text);
    printf("<hr>\n<address><a href=\"%s\">%s</a></address>\n</body></html>\n", SERVER_URL, SERVER_NAME);
    fflush(stdout);

    exit(1);
}

static void send_headers(int status, char* title, char* extra_header, char* mime_type, off_t length, time_t mod)
{
    time_t now;
    char timebuf[100];

    printf("%s %d %s\r\n", PROTOCOL, status, title);    // HTTP/1.1 200 OK
    printf("Server: %s\r\n", SERVER_NAME);              // Server: xhttpd
    
    now = time((time_t*)0);

    strftime(timebuf, sizeof(timebuf), FORMAT_DATE, gmtime(&now));
    printf("Date: %s\r\n", timebuf);                    // Date: Fri. 18 Jul 2014 14:34:26 GMT

    if (extra_header != NULL) {
        printf("%s\r\n", extra_header);
    }

    if (mime_type != NULL) {
        printf("Content-Type: %s\r\n", mime_type);
    }

    if (length >= 0) {
        printf("Content-Length: %ld\r\n", (int64_t)length);
    }

    if (mod != (time_t)-1) {
        strftime(timebuf, sizeof(timebuf), FORMAT_DATE, gmtime(&mod));
	printf("Last-Modified: %s\r\n", timebuf);
    }
    printf("Connection: close\r\n");
    printf("\r\n");
}

static char* get_mime_type(char* name)
{
    char* dot;
    dot = strrchr(name, '.');    // 自右向左查找'.'字符;如不存在返回NULL

    if (dot == (char*)0) {
        return "text/plain; charset=utf-8";
    }
    if (strcmp(dot, ".html") == 0 || strcmp(dot, ".htm") == 0) {
        return "text/html; charset=utf-8";
    }
    if (strcmp(dot, ".jpg") == 0 || strcmp(dot, ".jpeg") == 0) {
        return "image/jpeg";
    }
    if (strcmp(dot, ".gif") == 0) {
        return "image/gif";
    }
    if (strcmp(dot, ".png") == 0) {
        return "image/png";
    }
    if (strcmp(dot, ".css") == 0) {
        return "text/css";
    }
    
    return "text/plain; charset=utf-8";
}

static void strdecode(char* to, char* from)
{
    for ( ; *from != '\0'; ++to, ++from) {
        
        if (from[0] == '%' && isxdigit(from[1]) && isxdigit(from[2])) {
	
	    *to = hexit(from[1])*16 + hexit(from[2]);
	    from += 2;
	} else {
	    *to = *from;
	}
    }
    *to = '\0';
}

static int hexit(char c)
{
    if (c >= '0' && c <= '9') {
        return c - '0';
    }
    if (c >= 'a' && c <= 'f') {
        return c - 'a' + 10;
    }
    if (c >= 'A' && c <= 'F') {
        return c- 'A' + 10;
    }

    return 0;
}

static void strencode(char* to, size_t tosize, const char* from)
{
    int tolen;

    for (tolen = 0; *from != '\0' && tolen + 4 < tosize; ++from) {
        if (isalnum(*from) || strchr("/_.-~", *from) != (char*)0) {
	    *to = *from;
	    ++to;
	    ++tolen;
	} else {
	    sprintf(to, "%%%02x", (int) *from & 0xff);
	    to += 3;
	    tolen += 3;
	}
    }
    *to = '\0';
}
