# 🤖 OnlineDiscordBot
A Discord bot designed to enhance the online experience for players using **[PSDK's online features](https://github.com/PokemonWorkshop/OnlineServer)**.

## 📦 Prerequisites
Before installing and running the bot, ensure you have the following:

- **Node.js** (version 16.9.0 or higher is recommended, as required by `discord.js` v14).
- **npm** (comes with Node.js).
- A **Discord bot token** (available in the [Discord Developer Portal](https://discord.com/developers/applications)).
- Your bot's **client ID** and **bearer token**.

## 🚀 Installation guide
Follow these steps to set up and run the bot:

### 1. Clone the repository
Clone this repository to your local machine:
```bash
git clone https://github.com/yourusername/OnlineDiscordBot.git
cd OnlineDiscordBot
```

### 2. Create the `.env` file
In the root folder of the project, create a `.env` file to store your bot's credentials. The file should look like this:

```plaintext
TOKEN=<your-bot-token>
CLIENT_ID=<your-bot-client-id>
BEARER=<your-bearer-token>
BOT_VERSION=1.0
```

Replace `<your-bot-token>`, `<your-bot-client-id>`, and `<your-bearer-token>` with your actual values.

### 3. Install dependencies
Run the following command to install all required dependencies:
```bash
npm install
```

### 4. Start the bot
Start your bot with:
```bash
node bot.js
```

## 🛠️ Configuration
- **Bot permissions**: Make sure your bot has the required permissions to function. You can use the [Discord Permissions Calculator](https://discordapi.com/permissions.html) to set up the necessary permissions.
- **Bot settings**: You can edit `settings.js` in order to change the bot settings.
- **Environment variables**: Do not share your `.env` file publicly to protect sensitive data like your token.

## 🔧 Available functions
- `/commands` to list available commands.
- `/players` to list the players.
- `/gifts` to list mystery gifts.
- `/about` to display bot information.
- Log actions in a dedicated channel.

## 🧐 Troubleshooting
If you encounter any issues during setup or usage, consider the following:

- **Dependencies**: Ensure all dependencies are installed correctly. Run `npm install` again if needed.
- **Node.js version**: Make sure you're using a compatible version of Node.js (16.9.0+).
- **Bot token**: Verify your token and other credentials in the `.env` file.
- **Bot settings**: Verify your settings in `settings.js` file.
- **Logs**: Check the console to see if the message is relevant to your error.

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 🙌 Contribution
Contributions are welcome! Feel free to submit a pull request or open an issue for any bugs or improvements.
