@echo off

:: Добавляем все изменения в git
git add .

:: Создаем коммит с сообщением "update"
git commit -m "update"

:: Отправляем изменения в ветку master
git push -u origin master

:: Запускаем команду npm run deploy
npm run deploy