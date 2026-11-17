## 1.43.0

`2026-11-18`

- Add PicGo Server image hosting with optional secret authentication
- Support custom SiYuan API addresses and separate accounts for different servers, including built-in image hosting
- Fix SiYuan address validation and permission requests when the protocol is omitted, preserving existing local accounts
- Update Notion authentication, workspace data handling, and Markdown import integration
- Fix Notion page titles, destination workspaces, timestamps, and links that opened a 404 page after saving
- Fix dependency stylesheet builds on Windows

## 1.42.0

`2025-10-21`

- Fix Notion formatting issues
- Fix workspace name display errors
- Improve Notion account verification
- Fix wolai upload problems

## 1.41.0

`2025-06-02`

- Fix dida365 error
- Fix Yuque not showing in TOC issue
- Support memos
- Add filename support for piclist image hosting
- Fix Notion error

## 1.39.0

`2024-09-25`

- Support BuildinAI

## 1.38.0

`2024-07-28`

- Support obsidian

## 1.37.4

`2024-07-17`

- fix siyuan image upload issue.

## 1.37.3

`2024-06-26`

- Fix FlowUS bind error

## 1.37.2

`2024-06-24`

- Fix the problem of formatting error after saving to notion.

## 1.37.1

`2024-06-22`

- Migrate to Manifest V3
- Support tencent cos as imangeHost

## 1.36.0

`2023-11-14`

- Add German language
- Fix wolai issue

## 1.35.0

`2023-08-06`

- Optimized the support for Webdav.

## 1.34.0

`2023-07-01`

- ✨ Removed Powerpack and account system

  - Removed email sending
  - Removed sending to Kindle
  - Removed OCR

- ✨ Removed all remote data

  - Changelog
  - Privacy policy
  - Remote configuration file

## 1.33.0

`2022-12-15`

- 🐛 fix: import to flowus with html content

## 1.32.0

`2022-08-11`

- 🐛 fix: fix notion auth problem

## 1.31.0

`2022-08-11`

- 🐛 feat: support flowus

## 1.30.0

`2021-3-26`

- ✨ support config icon color
- ✨ support save selection

## 1.29.0

`2021-1-27`

- ✨ support leanote
- ✨ support flomo
- ✨ github imageHosting support config branch
- 🐛 fix notion 415 error
- 🐛 Fixed the bug that WebDAV requires powerpack (😄 It's really a bug)

Thanks [PascalNoisette](https://github.com/PascalNoisette)

## 1.28.4

`2020-12-16`

- 🐛 Fix the problem of joplin 1.14 page stuck

## 1.28.3

`2020-12-15`

- ✨ support joplin 1.14+

## 1.28.2

`2020-12-02`

- ✨ Support Github repository
- ✨ Support Github imageHosting
- 💄 show loading when ocr

Thanks @Touma-Kazusa and @Okami Wong

## 1.28.1

`2020-11-26`

- 🐛 Fix the style of area selector (OCR ScreenShoot). The selector will not be obscured by other elements

## 1.28.0

`2020-11-24`

- 🌍 Support zh-TW
- 🐛 Fix the problem that wolai and wotion cannot be used when third-party cookies are turned off.

## 1.28.0

`2020-09-23`

- 🐛 Fix the problem that wolai cannot be used

## 1.27.0

`2020-09-23`

- 🐛 Fix the problem that wolai cannot be used

## 1.26.1

`2020-08-27`

- ✨ support vivaldi

## 1.26.0

`2020-08-14`

- ✨ Support wolai
- ✨ Support baklib
- ✨ ~~support vivaldi~~

## 1.25.0

`2020-07-01`

- ✨ Support notion database
- 🔖 Release canary version

## 1.24.0

`2020-04-28`

- ✨ Support wiznote

## 1.23.0

`2020-04-07`

- 🐛 Fixed an issue where some plugins disappeared
- 💬 Add notice for notion.

## 1.22.0

`2020-03-28`

- 🐛 Fix OneNote oauth,support business account

## 1.21.0

`2020-03-28`

- ✨ Support zhihu gif
- ♻️ Move icon to local
- ♻️ Remove extensions store
- 🐛 Fix sm.ms

## 1.20.0

`2020-02-25`

- ✨ Support dida365
- ✨ Support TickTick
- ✨ Support Webdev (Dropbox)

## 1.19.0

`2020-01-29`

- ✨ Support confluence
- ✨ Support ulysses

## 1.18.0

`2020-01-20`

- 💄 Optimize UI for account selection
- 💄 Add mask for web clipper
- 💄 update powerpack ui

## 1.17.0

`2020-01-08`

- ✨ Support firefox

## 1.16.0

`2019-12-30`

- ✨ Support Joplin
- 💄 Add loading page
- 🐛 Fix web clipper switch error.

## 1.15.1

`2019-12-15`

- ✨ Reduce permissions required by web clipper.

## 1.15.0

`2019-12-14`

- ✨ Yuque(oauth) support built in image hosting
- ✨ Support server chan

## 1.14.1

`2019-12-05`

- 🐛 Fix repository search.

## 1.14.0

`2019-12-05`

- ✨ Github support config label and filter repository;
- ✨ Yuque support config slag and filter repository;
- ✨ Dark mode supports automatic icon switching.
- 🐛 When there is no account, there will be a reminder on the close settings page.

### Powerpack

- ✨ Support send to kindle.

## 1.13.0

`2019-11-08`

- ✨ Support imgur.
- 🐛 Upgrade turndown.
- 💄 Fix icon of bear and OneNote and sm.ms
- 💄 Add title when select account.
- 💄 Fix style of area selector.

### Powerpack

- ✨ Support OCR

### Extension API

- ✨ Support automatic extensions
- ✨ Support pangu

## 1.12.0

`2019-10-28`

- ✨ Support Powerpack.
- 📝 Add Privacy policy.

### Powerpack

- ✨ Support Save to Email

### Extension API

- ✨ Support Download File
- ✨ Support antd

## 1.11.0

`2019-09-30`

- ✨ Support for extended installation, disabling and deletion.
- ✨ Extended API supports copying content to clipboard.
- 🎨 Some built-in extensions become optional installation.
- 💄 Extensions page button to add more prompt.
- 🐛 Fixed a problem where the oauth of the yuque user with the enterprise space failed.
- 🐛 Fixed an issue where OneNote chose the knowledge base not work.
- 🐛 Fixed image clipping failure for relative path/

## 1.10.0

`2019-09-19`

- ✨ Support share clip content to weibo twitter and douban.
- 💄 More icon.
- 🌐 Easier to add translation.

## 1.9.2

`2019-09-11`

- 🐛 Fix default account and add new oauth account not work when enable default extension.
- 🌐 Support ja-JP.
- 💄 fix style of locale selector.

## 1.9.1

`2019-09-06`

- 🐛 Fix oauth failed in firefox.
- 🐛 Fix infinite loop request when edit account.

## 1.9.0

`2019-09-02`

- ✨ Support Bear.
- 📝 Add unauthorized error message for notion and youdao.

## 1.8.0

`2019-09-01`

- ✨ Support OneNote.
- ✨ Support display changelog.
- 🐛 fix yuque oauth error.
- 🐛 fix load imageHosting failed.
- 📝 add tooltip for set default clip extension.

## 1.7.3 & 1.7.2

`2019-08-24`

- ✨ Yuque support oauth.
- 🐛 Fixed description of the update page.
- 🐛 Fix crash when local is not zh-CN or en-US
- 🐛 Fixed okText of account modal.
- 🐛 Fix full page extension.
- 💄 Add Icon For Setting Page.
- 💄 Change name of notion.
- 🌐 Add more translate.

## 1.7.1

`2019-08-18`

- 🐛 Fixed an issue where the WYSIWYG mode could not be properly switched.
