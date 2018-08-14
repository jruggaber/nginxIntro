# Intro to NGINX
## Setup
* Install NGINX (https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)
* Copy the materials from `./content` to `/www/nginxIntro`
* Copy `./conf.d/nginx.sample.conf` to your NGINX configs directory
* Restart NGINX (`sudo systemctl restart nginx` || `sudo nginx -s reload`)
* Add the following to your hosts file

    `127.0.0.1 www.totallynotshadyapp.com www.bothofmytotallyawesomeapps.com example.bothofmytotallyawesomeapps.com www.mysecondtotallyawesomeapp.com www.myfirsttotallyawesomeapp.com www.igzip.com www.idontgzip.com`

* Run `yarn start` || `npm start`
* Open the following and familiarize yourself with their different behaviors.
  - http://127.0.0.1:3456
  - http://127.0.0.1:4567
  - http://127.0.0.1:5678

### Example 1
#### Routing based on host name

```
# This is a server definition block
server {
  listen 80; # Listen to requests on port 80
  listen 81;
  # respond to requests on port 80/81 to this host name
  server_name www.myfirsttotallyawesomeapp.com;

  # for all locations
  location / {
    # show the content at this location
    proxy_pass http://127.0.0.1:3456;
  }
}

server {
  listen 80;
  server_name www.mysecondtotallyawesomeapp.com;

  location / {
    proxy_pass http://127.0.0.1:4567;
  }
}
```

http://www.myfirsttotallyawesomeapp.com
and
http://www.mysecondtotallyawesomeapp.com
demonstrate routing to two different running node applications on the same computer over port 80.

### Example 2
#### Routing based on path

```
# route the traffic depending on the path
# note how there is nothing matching / here
# what would happen to traffic going to /?
server {
  listen 80;
  # server_name can match wildcards of *.something
  # it can also be a regular expression
  server_name *.bothofmytotallyawesomeapps.com;

  location /1 {
    proxy_pass http://127.0.0.1:3456;
  }

  location /2 {
    proxy_pass http://127.0.0.1:4567;
  }

  location ~(reactjs).* {
    proxy_pass http://127.0.0.1:4567;
  }
}
```

We can set routing to different apps based on the path the user comes from.  Test the following urls and note the difference in behavior  
http://www.bothofmytotallyawesomeapps.com/1  
http://example.bothofmytotallyawesomeapps.com/1  
http://www.bothofmytotallyawesomeapps.com/2  
http://www.bothofmytotallyawesomeapps.com/reactjs_andsomeotherstuffthatdoesntmatter  

### Example 3
#### Writing headers

```
server {
  listen 80;
  server_name www.totallynotshadyapp.com;

  # Note that we can rewrite headers on the way out
  location /shady {
    proxy_pass http://127.0.0.1:5678;
    proxy_set_header  Host www.maybe_a_little_shady.com;
  }

  location / {
    proxy_pass http://127.0.0.1:5678;
    proxy_set_header  Host $host;
  }
}
```

http://www.totallynotshadyapp.com renders as we would expect.

http://www.totallynotshadyapp.com/shady
renders a different host name than we expect, proxy_set_header allows us to override headers before they get to the node application.

### Example 4
#### Gzipping

```
# static file handling with gzip on
server {
  listen 80;
  server_name www.igzip.com;

  gzip on;
  # Where should the system look for content?
  root /www/nginxIntro;
}

# static file handling with gzip off
server {
  listen 80;
  server_name www.idontgzip.com;

  gzip off;
  root /www/nginxIntro;
}
```

While there are pieces of express middleware you can use to compress your response, you can also hand this off to the webserver.

Open http://www.igzip.com/pnp.txt and observer the file size in your dev tools

Open http://www.idontgzip.com/pnp.txt and observer the file size in your dev tools


