
---

# Tabcut — Native Web App Launcher for Linux

tabcut lets you convert any website into a native `.desktop` launcher on your Linux system — similar to Linux Mint's WebApps Manager, but fully terminal-based, powered by Bun and TypeScript.

---

## Features

* Create `.desktop` entries for any website
* Choose any installed browser
* Private or incognito mode support
* Isolated browser profiles
* Auto-fetch favicon or provide custom icon
* Icons saved deterministically
* Works on all major Linux distributions
* Ships as a standalone binary with no runtime dependencies

---

## Installation

### Method 1: One-liner (recommended)

```bash
sh <(curl -fsSL https://raw.githubusercontent.com/mr-zlaam/tabcut/main/tabcut-install.sh)
```

This downloads the latest release tarball, extracts it into a temporary folder, runs the bundled installer, and moves the binary into `/usr/local/bin`.

---

### Method 2: Manual

Step 1. Download the release tarball:

```bash
wget https://github.com/mr-zlaam/tabcut/releases/download/tabcut/tabcut-linux-x64.tar.gz
```

Step 2. Extract and install:

```bash
tar -xvzf tabcut-linux-x64.tar.gz
cd tabcut
chmod +x install.sh
./install.sh
```

---

## Usage

Create a new web app:

```bash
tabcut create
```

List all tabcut apps:

```bash
tabcut list
```

Remove a tabcut app:

```bash
tabcut remove
```

Show help:

```bash
tabcut help
```

Check version:

```bash
tabcut --version
```

---

## Files and Paths

* Desktop entries: `~/.local/share/applications/mr-zlaam-<slug>.desktop`
* Icons: `~/.local/share/webapps/icons/<slug>.png`
* Binary: `/usr/local/bin/tabcut`

---

## Uninstallation

```bash
sudo rm /usr/local/bin/tabcut
rm ~/.local/share/applications/mr-zlaam-*.desktop
rm ~/.local/share/webapps/icons/*.png
```

A future version may add `tabcut uninstall`.

---

## Built With

* Bun
* TypeScript
* Inquirer.js (active fork)
* Chalk
* Native Linux tools (`which`, `mkdir`, `cp`, etc.)

---

## License

MIT — © mr-zlaam

---

## Contributing

Pull requests and issues welcome. If you find this project useful, star the repository and share it.

---

## Roadmap Ideas

* Optional `.deb` or Flatpak packaging
* Auto-update mechanism (opt-in)
* Possible GUI wrapper with tray support

---
