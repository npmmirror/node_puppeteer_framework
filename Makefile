default: debug

debug:
	@clear
	@echo "App debug"
	@while true; do gulp start; sleep 2; done

install:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@npm config set registry https://registry.npm.taobao.org
	@npm install --ignore-scripts --no-bin-links
	@npm install gulp-cli -g

download:
	@clear
	@echo "Package Downloading"
	@wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
	@wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
	@apt-get update
	@apt-get install google-chrome-stable