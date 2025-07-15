# 📦 tabcut — Native Web App Launcher for Linux

`tabcut` lets you convert any website into a native `.desktop` launcher on your Linux system — similar to **Linux Mint's WebApps Manager**, but in the terminal, powered by **Bun** + **TypeScript**.

---

## ⚙️ Features

- 🖥 Create `.desktop` entries for any website
- 🌐 Choose any browser (detected from your system)
- 🕵️ Supports private/incognito mode
- 🧍 Supports isolated browser profiles
- 🎨 Auto-fetch favicon or use a custom icon path
- 💾 Icons saved deterministically
- 🧪 Works on all major Linux distributions
- 🧰 No runtime dependency (ships as binary)

---

## 📥 Installation

### 1. Download the release tarball

```bash
wget https://github.com/mr-zlaam/tabcut/releases/download/tabcut/tabcut-linux-x64.tar.gz
```

### 2. Extract and install

```bash
tar -xvzf tabcut-linux-x64.tar.gz
cd tabcut
chmod +x install.sh
./install.sh
```

> ⚠️ You’ll be prompted for `sudo` to move the binary into `/usr/local/bin`.

---

## 🚀 Usage

### Create a new web app

```bash
tabcut create
```

You'll be prompted for:

- 📛 Application Name
- 🔗 Website URL
- 🗂️ Category (e.g., News, Social, Productivity)
- 🌐 Browser (auto-detected)
- 🧍 Isolated profile (optional)
- 🕵️ Private/Incognito mode (optional)
- ⚙️ Custom browser launch parameters (optional)
- 🖼️ Icon:
  - Auto-fetch favicon
  - or provide a custom `.png` icon path

---

### List all tabcut apps

```bash
tabcut list
```

- Shows only the apps created with `tabcut` (those with slug `mr-zlaam-*`)

---

### Remove a tabcut app

```bash
tabcut remove
```

- Lets you select which app to remove
- Deletes both the `.desktop` entry and the saved icon

---

### Help

```bash
tabcut help
```

Shows a full command overview.

---

### Version

```bash
tabcut --version
```

---

## 📁 Files and Directories

- **Desktop entries:**  
  `~/.local/share/applications/mr-zlaam-<slug>.desktop`

- **Icons:**  
  `~/.local/share/webapps/icons/<slug>.png`

- **Binary:**  
  `/usr/local/bin/tabcut`

---

## 🧼 Uninstallation

Manual removal:

```bash
sudo rm /usr/local/bin/tabcut
rm ~/.local/share/applications/mr-zlaam-*.desktop
rm ~/.local/share/webapps/icons/*.png
```

> Or you can create `tabcut uninstall` later if desired.

---

## 🛠 Built With

- [Bun](https://bun.sh/)
- [TypeScript](https://www.typescriptlang.org/)
- [Inquirer.js (active fork)](https://github.com/SBoudrias/Inquirer.js)
- [Chalk](https://github.com/chalk/chalk)
- Native Linux tools (`which`, `mkdir`, `cp`, etc.)

---

## 🔓 License

MIT — © `mr-zlaam`

---

## 🤝 Contributions

PRs and issues welcome! If you find this project helpful, share and star it ⭐

---

## 💡 Roadmap Ideas

- Add `tabcut uninstall`
- Add system tray support (in future GUI wrapper)
- Optional `.deb` or Flatpak packaging
- Auto-update mechanism (opt-in)

---
