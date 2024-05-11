.PHONY: build-web
build:
	@ng build --prod

.PHONY: image-web
image:
	@docker image build -t {{YOUR_REGISTRY}} .

.PHONY: push-web
push:
	@docker image push {{YOUR_REGISTRY}}

.PHONY: pull-web
pull:
	@docker image pull {{YOUR_REGISTRY}}

.PHONY: all
all: build image push
