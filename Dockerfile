ARG image=dependencies

FROM $image as build-image

COPY . $APP_PATH

RUN ng build --configuration production

FROM nginx:alpine3.18 as production

COPY --from=build-image /tmp/dist/nova-web/ /usr/share/nginx/html
