server {
        client_max_body_size 5M;
        server_name bmstusa.ru www.bmstusa.ru;

        location /api {
                proxy_pass http://localhost:8080;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_http_version 1.1;
                proxy_set_header Connection "";
        }

        location /ws {

                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                client_max_body_size 50M;
                proxy_set_header Host $http_host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-Frame-Options SAMEORIGIN;
                proxy_pass http://localhost:8080;
        }

        location /images {
                root /home/ubuntu/static;
        }


        location / {
                root /home/ubuntu/bmstusa/frontend/dist;
                try_files $uri $uri/ /index.html;
        }

        location ~ \.(js|css|ogg|ogv|svgz|eot|otf|zip|tgz|gz|rar|doc|xls|exe)$ {
                root /home/ubuntu/bmstusa/frontend/dist;

        }

        location /server/img {
                root /home/ubuntu/bmstusa/frontend/public;
                expires 90d;
        }

	location /img {
                root /home/ubuntu/bmstusa/frontend/public/server;
                expires 90d;
        }

        location /grafana {
                proxy_pass http://localhost:3000;
                rewrite  ^/grafana/(.*)  /$1 break;
                proxy_set_header   Host $host;
        }


    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/bmstusa.ru/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/bmstusa.ru/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}

server {
    if ($host = www.bmstusa.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = bmstusa.ru) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


       server_name bmstusa.ru www.bmstusa.ru;
       listen 80;
#       return 404; # managed by Certbot
}