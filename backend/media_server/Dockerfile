FROM nginx:alpine as production

RUN mkdir /usr/share/nginx/media
RUN mkdir /usr/share/nginx/static

# Setup entrypoint
COPY ./media_server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Add custom nginx.conf
COPY ./media_server/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80
# Start nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]